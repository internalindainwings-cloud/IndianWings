/**
 * First-Party Visitor Telemetry & User Activity Tracker
 * Handles: Session generation, scroll milestones, dwell time, navigation, and zero-loss exit beacons.
 */

export interface TelemetryEvent {
  eventType: 'PAGE_VIEW' | 'SCROLL_DEPTH' | 'CARD_CLICK' | 'MODAL_OPEN' | 'EXIT';
  route: string;
  label?: string;
  durationSpent?: number;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

const VISITOR_STORAGE_KEY = 'tiwc_visitor_id';
const SESSION_STORAGE_KEY = 'tiwc_session_id';

let memoryVisitorId: string | null = null;
let memorySessionId: string | null = null;
let activeRoute: string = '/';
let routeStartTime: number = Date.now();
const triggeredMilestones = new Set<number>();
let eventBuffer: TelemetryEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;
let isInitialized = false;

/**
 * Generates a unique UUID v4 safely across all environments
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves or creates a persistent visitor UUID (across multiple visits)
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  if (memoryVisitorId) return memoryVisitorId;

  try {
    let stored = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!stored) {
      stored = `tiwc_v_${generateUUID()}`;
      localStorage.setItem(VISITOR_STORAGE_KEY, stored);
    }
    memoryVisitorId = stored;
    return stored;
  } catch {
    // Fallback for private mode or restricted storage
    if (!memoryVisitorId) {
      memoryVisitorId = `tiwc_v_${generateUUID()}`;
    }
    return memoryVisitorId;
  }
}

/**
 * Retrieves or creates a session UUID (per tab/browser session)
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  if (memorySessionId) return memorySessionId;

  try {
    let stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      stored = `tiwc_s_${generateUUID()}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, stored);
    }
    memorySessionId = stored;
    return stored;
  } catch {
    if (!memorySessionId) {
      memorySessionId = `tiwc_s_${generateUUID()}`;
    }
    return memorySessionId;
  }
}

/**
 * Dispatches queued events to /api/telemetry/event
 */
export function flushEvents(useBeacon: boolean = false) {
  if (eventBuffer.length === 0) return;

  const eventsToSend = [...eventBuffer];
  eventBuffer = [];

  const payload = JSON.stringify({
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    events: eventsToSend,
  });

  if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/telemetry/event', blob);
  } else {
    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Re-queue on failure if not exiting
      if (!useBeacon) {
        eventBuffer.push(...eventsToSend);
      }
    });
  }
}

/**
 * Queues a single telemetry event with auto-flush
 */
export function trackTelemetryEvent(
  eventType: TelemetryEvent['eventType'],
  route: string,
  label?: string,
  metadata?: Record<string, unknown>,
  durationSpent?: number
) {
  const event: TelemetryEvent = {
    eventType,
    route,
    label,
    metadata,
    durationSpent,
    timestamp: new Date().toISOString(),
  };

  eventBuffer.push(event);

  // Flush immediately if buffer reaches 5 events
  if (eventBuffer.length >= 5) {
    flushEvents();
    return;
  }

  // Otherwise debounce flush every 3.5 seconds
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushEvents();
    }, 3500);
  }
}

/**
 * Handles page navigation / route change
 */
export function recordRouteChange(newRoute: string) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const timeSpentOnPrevRoute = Math.round((now - routeStartTime) / 1000);

  // Record transition if leaving a previous route
  if (activeRoute && activeRoute !== newRoute && timeSpentOnPrevRoute > 0) {
    trackTelemetryEvent('PAGE_VIEW', activeRoute, `Navigated from ${activeRoute}`, undefined, timeSpentOnPrevRoute);
  }

  activeRoute = newRoute;
  routeStartTime = now;
  triggeredMilestones.clear();

  // Log entry into the new route
  trackTelemetryEvent('PAGE_VIEW', newRoute, `Landed on ${newRoute}`);
}

/**
 * Initializes passive scroll milestone and exit telemetry listeners
 */
export function initTelemetryTracker(): () => void {
  if (typeof window === 'undefined' || isInitialized) return () => {};
  isInitialized = true;

  // Initial Route Entry
  activeRoute = window.location.pathname;
  recordRouteChange(activeRoute);

  // 1. Passive Scroll Listener with rAF
  let isScrolling = false;
  const handleScroll = () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

          const milestones = [25, 50, 75, 100];
          for (const m of milestones) {
            if (scrollPercent >= m && !triggeredMilestones.has(m)) {
              triggeredMilestones.add(m);
              trackTelemetryEvent(
                'SCROLL_DEPTH',
                activeRoute,
                `Scrolled ${m}% of ${activeRoute}`,
                { scrollPercent: m }
              );
            }
          }
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // 2. Tab Visibility & Exit Telemetry via sendBeacon
  const handleVisibilityOrExit = () => {
    if (document.visibilityState === 'hidden') {
      const now = Date.now();
      const dwellTime = Math.round((now - routeStartTime) / 1000);

      trackTelemetryEvent(
        'EXIT',
        activeRoute,
        `Exited site from ${activeRoute}`,
        { exitRoute: activeRoute },
        dwellTime
      );

      flushEvents(true); // Force sendBeacon
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityOrExit);
  window.addEventListener('pagehide', handleVisibilityOrExit);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('visibilitychange', handleVisibilityOrExit);
    window.removeEventListener('pagehide', handleVisibilityOrExit);
    if (flushTimer) clearTimeout(flushTimer);
    isInitialized = false;
  };
}
