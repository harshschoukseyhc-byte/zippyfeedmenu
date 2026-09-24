/**
 * Privacy-friendly, zero-cookie client analytics for Zippyfeed Bhopal.
 * Tracks interactions locally without collecting any PII or third-party cookies.
 */

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
}

// Generate or retrieve anonymous session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem('zippy_anon_sid');
    if (!sid) {
      sid = 'zs_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('zippy_anon_sid', sid);
    }
    return sid;
  } catch (e) {
    return 'anon_' + Date.now().toString(36);
  }
}

// Internal dispatcher using sendBeacon or fetch
export function trackEvent(eventName: string, data: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  const payload: AnalyticsEvent = {
    event: eventName,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data,
  };

  // 1. Send via Beacon API or fetch to internal API
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
  } else {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  }

  // 2. Also keep a local cache in localStorage for instant offline access and demo
  try {
    const key = 'zippy_recent_events';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(payload);
    if (existing.length > 200) existing.shift(); // retain last 200 client events
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    // ignore local storage errors
  }
}

// High-level tracking helpers
export function trackSectionView(sectionId: string, sectionName: string) {
  trackEvent('section_view', { sectionId, sectionName });
}

export function trackDishTap(
  itemId: string,
  itemName: string,
  sectionId?: string,
  price?: number,
  veg?: boolean
) {
  trackEvent('dish_tap', { itemId, itemName, sectionId, price, veg });
}

export function trackSearchQuery(query: string, resultCount: number, vegOnly: boolean) {
  trackEvent('search_query', { query, resultCount, vegOnly });
}

export function trackVegToggle(vegOnly: boolean) {
  trackEvent('veg_toggle', { vegOnly });
}

export function trackMoodChoice(moodId: string, moodLabel: string) {
  trackEvent('mood_choice', { moodId, moodLabel });
}

export function trackTrayAction(
  action: 'add' | 'remove' | 'open' | 'close' | 'whatsapp',
  total: number,
  count: number,
  items?: string[]
) {
  trackEvent('tray_action', { action, total, count, items });
}

export function trackOutboundTap(
  type: 'whatsapp' | 'directions' | 'review' | 'instagram' | 'phone',
  context?: string
) {
  trackEvent('outbound_tap', { type, context });
}
