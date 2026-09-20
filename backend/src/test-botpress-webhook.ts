import http from 'http';
import { createApp } from './app';
import { env } from './config/env';

async function runSecurityTests() {
  console.log('\n==================================================');
  console.log('BOTPRESS WEBHOOK AUTOMATED SECURITY TEST SUITE');
  console.log('==================================================\n');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(4099, resolve));
  const baseUrl = 'http://127.0.0.1:4099/api/integrations/botpress/lead';
  const secret = env.BOTPRESS_WEBHOOK_SECRET;

  console.log(`Test server running on port 4099`);
  console.log(`Secret configured: ${secret ? 'YES (length ' + secret.length + ')' : 'NO'}`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string, details?: unknown) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`, details ?? '');
      failed++;
    }
  }

  const runId = Math.floor(Math.random() * 10000);

  try {
    // -------------------------------------------------------------
    // Test 1: No x-bp-secret -> 401
    // -------------------------------------------------------------
    const res1 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': `10.10.${runId}.1`,
      },
      body: JSON.stringify({ fullName: 'Test User', phone: '+919811808387' }),
    });
    const data1 = await res1.json() as any;
    assert(res1.status === 401, 'Test 1: Missing x-bp-secret returns 401', { status: res1.status, data1 });

    // -------------------------------------------------------------
    // Test 2: Wrong x-bp-secret (different length) -> 401
    // -------------------------------------------------------------
    const res2 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': 'short-wrong-key',
        'x-forwarded-for': `10.10.${runId}.2`,
      },
      body: JSON.stringify({ fullName: 'Test User', phone: '+919811808387' }),
    });
    assert(res2.status === 401, 'Test 2: Wrong x-bp-secret (length mismatch) returns 401', { status: res2.status });

    // -------------------------------------------------------------
    // Test 3: Wrong x-bp-secret (same length, invalid characters) -> 401
    // -------------------------------------------------------------
    const wrongSameLength = 'x'.repeat(secret.length);
    const res3 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': wrongSameLength,
        'x-forwarded-for': `10.10.${runId}.3`,
      },
      body: JSON.stringify({ fullName: 'Test User', phone: '+919811808387' }),
    });
    assert(res3.status === 401, 'Test 3: Wrong x-bp-secret (same length mismatch) returns 401', { status: res3.status });

    // -------------------------------------------------------------
    // Test 4: Payload > 15KB -> 413
    // -------------------------------------------------------------
    const oversizedBody = JSON.stringify({
      fullName: 'Test Large Payload',
      phone: '+919811808387',
      message: 'A'.repeat(16 * 1024), // 16KB message
    });
    const res4 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': secret,
        'x-forwarded-for': `10.10.${runId}.4`,
      },
      body: oversizedBody,
    });
    const data4 = (await res4.json()) as any;
    assert(
      res4.status === 413 && data4.success === false,
      'Test 4: Payload exceeding 15KB rejected with 413 Payload Too Large',
      { status: res4.status, data4 }
    );

    // -------------------------------------------------------------
    // Test 5: Invalid payload (malformed phone / missing name) -> 400
    // -------------------------------------------------------------
    const res5 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': secret,
        'x-forwarded-for': `10.10.${runId}.5`,
      },
      body: JSON.stringify({
        fullName: 'A', // too short (<2 chars)
        phone: '12', // too short (<7 digits)
      }),
    });
    const data5 = (await res5.json()) as any;
    assert(
      res5.status === 400 && data5.success === false && data5.fields,
      'Test 5: Malformed payload rejected with 400 and structured validation errors',
      { status: res5.status, data5 }
    );

    // -------------------------------------------------------------
    // Test 6: Valid payload with correct secret -> 201 Created
    // -------------------------------------------------------------
    const testPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);
    const ipForCreateAndIdempotency = `10.10.${runId}.6`;
    const validPayload = {
      fullName: 'Botpress Test Lead',
      phone: testPhone,
      email: 'botpress-test@theindianwingscompany.com',
      destination: 'Srinagar & Gulmarg Snow Tour',
      travelDate: '2026-11-20',
      travellers: '3 Adults',
      tripType: 'Winter Special',
      message: 'Automated verification test from Botpress integration suite',
    };

    const res6 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': secret,
        'x-forwarded-for': ipForCreateAndIdempotency,
      },
      body: JSON.stringify(validPayload),
    });
    const data6 = (await res6.json()) as any;
    assert(
      res6.status === 201 && data6.success === true && !!data6.id,
      'Test 6: Valid payload creates enquiry with 201 Created',
      { status: res6.status, data6 }
    );

    // -------------------------------------------------------------
    // Test 7: Idempotency (same payload within 2 minutes) -> 200 Idempotent
    // -------------------------------------------------------------
    const res7 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': secret,
        'x-forwarded-for': ipForCreateAndIdempotency,
      },
      body: JSON.stringify(validPayload),
    });
    const data7 = (await res7.json()) as any;
    assert(
      res7.status === 200 && data7.duplicate === true && data7.id === data6.id,
      'Test 7: Duplicate submission within 2 mins returns 200 idempotent response without duplicating lead',
      { status: res7.status, data7 }
    );

    // -------------------------------------------------------------
    // Test 8: Rate Limiter Enforcement (Upstash Redis sliding window) -> 429
    // -------------------------------------------------------------
    const rateLimitTestIp = `10.10.${runId}.8`;
    let got429 = false;
    for (let i = 0; i < 8; i++) {
      const rlRes = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bp-secret': secret,
          'x-forwarded-for': rateLimitTestIp,
        },
        body: JSON.stringify({
          fullName: `Spam User ${i}`,
          phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
          travelDate: '2026-11-20',
        }),
      });
      if (rlRes.status === 429) {
        got429 = true;
        break;
      }
    }
    assert(got429, 'Test 8: Distributed rate limit triggers 429 Too Many Requests when threshold exceeded');

    // -------------------------------------------------------------
    // Test 9: Server-to-server Origin check (No Origin header allowed)
    // -------------------------------------------------------------
    const res9 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bp-secret': secret,
        'x-forwarded-for': `10.10.${runId}.9`,
      },
      body: JSON.stringify({
        fullName: 'No Origin Check',
        phone: '99' + Math.floor(10000000 + Math.random() * 90000000),
        travelDate: '2026-12-01',
      }),
    });
    const data9 = (await res9.json()) as any;
    assert(
      res9.status === 201 && data9.success === true,
      'Test 9: Server-to-server request without browser Origin header succeeds',
      { status: res9.status, data9 }
    );

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log('\n==================================================');
    console.log(`ALL SECURITY & INTEGRATION TESTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================\n');

  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSecurityTests().catch((err) => {
  console.error('Test run failed with unhandled exception:', err);
  process.exit(1);
});
