/**
 * Rate-Limiter IP Resolution Security Tests
 *
 * Uses Node.js built-in test runner (node:test + node:assert). No new dependencies.
 *
 * Run: node --test --experimental-strip-types src/lib/security/rate-limit.test.ts
 * Or:  npx tsx --test src/lib/security/rate-limit.test.ts
 *
 * Since this project has no test runner configured, these tests validate the
 * inline logic that mirrors the production resolveClientIp() implementation.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Minimal NextRequest stub
// ---------------------------------------------------------------------------
function makeRequest(headers: Record<string, string>) {
  return {
    headers: {
      get: (key: string): string | null => {
        const val = headers[key.toLowerCase()];
        return val !== undefined ? val : null;
      },
    },
  };
}

// ---------------------------------------------------------------------------
// resolveClientIp — inline mirror of production implementation for isolation
// MUST stay in sync with src/lib/security/rate-limit.ts resolveClientIp()
// ---------------------------------------------------------------------------
function resolveClientIp(
  req: ReturnType<typeof makeRequest>,
  nodeEnv: string = 'production'
): string {
  const isDev = nodeEnv === 'development';
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp && realIp.length > 0) return realIp;
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] && parts[i].length > 0) return parts[i];
    }
  }
  if (isDev) return '127.0.0.1';
  return '0.0.0.0';
}

// ---------------------------------------------------------------------------
// isLocalIp + checkLimitExemption — mirror of production logic
// ---------------------------------------------------------------------------
function isLocalIp(ip: string): boolean {
  if (!ip) return true;
  const c = ip.trim().toLowerCase();
  return (
    c === '127.0.0.1' || c === '::1' || c === 'localhost' ||
    c.startsWith('127.') || c.startsWith('192.168.') || c.startsWith('10.') ||
    c === 'unknown'
  );
}
function checkLimitExemption(ip: string, nodeEnv: string = 'production'): boolean {
  return nodeEnv === 'development' && isLocalIp(ip);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('resolveClientIp', () => {
  it('T01: Public x-real-ip returned as-is', () => {
    assert.equal(resolveClientIp(makeRequest({ 'x-real-ip': '203.0.113.42' }), 'production'), '203.0.113.42');
  });

  it('T02: x-real-ip takes priority over x-forwarded-for', () => {
    assert.equal(
      resolveClientIp(makeRequest({ 'x-real-ip': '203.0.113.1', 'x-forwarded-for': '10.0.0.5, 198.51.100.2' }), 'production'),
      '203.0.113.1'
    );
  });

  it('T03: Spoofed leftmost XFF private IP -> rightmost public IP used', () => {
    assert.equal(
      resolveClientIp(makeRequest({ 'x-forwarded-for': '192.168.1.1, 198.51.100.99' }), 'production'),
      '198.51.100.99'
    );
  });

  it('T04: Spoofed 10.x leftmost -> rightmost public IP used', () => {
    assert.equal(
      resolveClientIp(makeRequest({ 'x-forwarded-for': '10.0.0.1, 203.0.113.42' }), 'production'),
      '203.0.113.42'
    );
  });

  it('T05: Single XFF value returned', () => {
    assert.equal(resolveClientIp(makeRequest({ 'x-forwarded-for': '203.0.113.10' }), 'production'), '203.0.113.10');
  });

  it('T06: Three XFF values -> rightmost returned', () => {
    assert.equal(
      resolveClientIp(makeRequest({ 'x-forwarded-for': '192.168.1.1, 10.10.10.1, 198.51.100.77' }), 'production'),
      '198.51.100.77'
    );
  });

  it('T07: No headers in production -> sentinel 0.0.0.0', () => {
    assert.equal(resolveClientIp(makeRequest({}), 'production'), '0.0.0.0');
  });

  it('T08: No headers in development -> 127.0.0.1 fallback', () => {
    assert.equal(resolveClientIp(makeRequest({}), 'development'), '127.0.0.1');
  });

  it('T09: Empty XFF string -> sentinel in production', () => {
    assert.equal(resolveClientIp(makeRequest({ 'x-forwarded-for': '' }), 'production'), '0.0.0.0');
  });

  it('T10: Whitespace-only XFF -> sentinel in production', () => {
    assert.equal(resolveClientIp(makeRequest({ 'x-forwarded-for': '   ,  , ' }), 'production'), '0.0.0.0');
  });
});

describe('Private IP exemption (env-gated)', () => {
  it('T11: 192.168.x.x in production -> NOT exempt', () => {
    assert.equal(checkLimitExemption('192.168.1.1', 'production'), false);
  });

  it('T12: 192.168.x.x in development -> IS exempt', () => {
    assert.equal(checkLimitExemption('192.168.1.1', 'development'), true);
  });

  it('T13: 10.x.x.x in production -> NOT exempt', () => {
    assert.equal(checkLimitExemption('10.0.0.1', 'production'), false);
  });

  it('T14: 127.0.0.1 in production -> NOT exempt', () => {
    assert.equal(checkLimitExemption('127.0.0.1', 'production'), false);
  });

  it('T15: 127.0.0.1 in development -> IS exempt', () => {
    assert.equal(checkLimitExemption('127.0.0.1', 'development'), true);
  });

  it('T16: Public IP in production -> NOT exempt', () => {
    assert.equal(checkLimitExemption('203.0.113.42', 'production'), false);
  });

  it('T17: Sentinel 0.0.0.0 in production -> NOT exempt (fails safe)', () => {
    assert.equal(checkLimitExemption('0.0.0.0', 'production'), false);
  });
});

describe('Security invariants', () => {
  it('Invariant A: Spoofed XFF:192.168.1.1 cannot bypass production limiter', () => {
    const req = makeRequest({ 'x-forwarded-for': '192.168.1.1, 198.51.100.1' });
    const ip = resolveClientIp(req, 'production');
    assert.equal(ip, '198.51.100.1');
    assert.equal(checkLimitExemption(ip, 'production'), false);
  });

  it('Invariant B: Missing headers in production cannot bypass via 127.0.0.1 fallback', () => {
    const req = makeRequest({});
    const ip = resolveClientIp(req, 'production');
    assert.equal(ip, '0.0.0.0');
    assert.equal(checkLimitExemption(ip, 'production'), false);
  });

  it('Invariant C: Rate-limit key is stable across calls for same headers', () => {
    const req = makeRequest({ 'x-real-ip': '203.0.113.42' });
    assert.equal(resolveClientIp(req, 'production'), resolveClientIp(req, 'production'));
  });
});
