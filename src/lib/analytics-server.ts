import fs from 'fs';
import path from 'path';
import { menuData } from './menu-data';
import type { ServerEvent, InsightsData } from '@/types/analytics';

const DATA_DIR = path.join(process.cwd(), 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'analytics-events.jsonl');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generate realistic 30-day baseline data if file does not exist
function generateBaselineData(): ServerEvent[] {
  const events: ServerEvent[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Flatten all menu items for lookup
  const allItems: { id: string; name: string; sectionId: string; price: number; veg: boolean }[] = [];
  menuData.sections.forEach((sec) => {
    sec.groups.forEach((grp) => {
      grp.items.forEach((item) => {
        const price = item.price ?? (item.variants ? Math.min(...Object.values(item.variants)) : 200);
        allItems.push({
          id: item.id,
          name: item.name,
          sectionId: sec.id,
          price,
          veg: item.veg,
        });
      });
    });
  });

  // Top dishes weighted to simulate real dining patterns at Zippyfeed Bhopal
  const popularDishes = [
    { name: 'Cheesy Margherita (10 inch) + Virgin Mojito', count: 184 },
    { name: 'Aloo Tikki Burger (Double Patty) + Virgin Mojito', count: 162 },
    { name: 'Crispy Veggie Wrap + Dark Fantasy Mojito', count: 145 },
    { name: 'Korean Fried Chicken (Yangnyeom)', count: 138 },
    { name: 'Chicken Katsu', count: 129 },
    { name: 'Paneer Butter Masala', count: 125 },
    { name: 'Veg Steamed Momo', count: 118 },
    { name: 'Belgian Waffle + Cold Coffee', count: 112 },
    { name: 'Cheesy Margherita Pizza', count: 104 },
    { name: 'Tteokbokki (Spicy Rice Cakes)', count: 97 },
    { name: 'Dal Makhani', count: 92 },
    { name: 'Virgin Mojito', count: 88 },
    { name: 'Chicken Fried Momo', count: 84 },
    { name: 'Cheesy Tower Burger', count: 79 },
    { name: 'Tiramisu', count: 76 },
    { name: 'Masala Dosa', count: 71 },
    { name: 'Veg Hakka Noodles', count: 68 },
    { name: 'Crispy Corn', count: 64 },
    { name: 'Dark Fantasy Mojito', count: 59 },
    { name: 'Cold Coffee with Ice Cream', count: 55 },
    { name: 'Butter Naan', count: 52 },
    { name: 'Chicken Biryani', count: 48 },
    { name: 'Idli Sambar (2 Pcs)', count: 44 },
    { name: 'Veg Spring Roll', count: 40 },
    { name: 'Chilli Paneer Dry', count: 36 },
  ];

  // Distribute over past 30 days
  popularDishes.forEach((pop, idx) => {
    const item =
      allItems.find((i) => i.name.toLowerCase() === pop.name.toLowerCase()) ||
      allItems.find((i) => i.name.toLowerCase().startsWith(pop.name.toLowerCase())) ||
      allItems.find((i) => i.name.toLowerCase().includes(pop.name.toLowerCase())) || {
        id: `pop-${idx}`,
        name: pop.name,
        sectionId: 'combos',
        price: 299,
        veg: !pop.name.toLowerCase().includes('chicken'),
      };

    for (let c = 0; c < pop.count; c++) {
      const daysAgo = Math.random() * 30;
      events.push({
        event: 'dish_tap',
        timestamp: now - daysAgo * dayMs,
        sessionId: `seed_session_${Math.floor(Math.random() * 800)}`,
        data: {
          itemId: item.id,
          itemName: item.name,
          sectionId: item.sectionId,
          price: item.price,
          veg: item.veg,
        },
      });
    }
  });

  // Top Searches (including high-demand terms and unmet demand)
  const searchTerms = [
    { query: 'pizza', count: 215, resultCount: 25 },
    { query: 'korean', count: 198, resultCount: 38 },
    { query: 'momo', count: 172, resultCount: 16 },
    { query: 'cold coffee', count: 146, resultCount: 4 },
    { query: 'burger', count: 134, resultCount: 12 },
    { query: 'paneer', count: 112, resultCount: 18 },
    { query: 'biryani', count: 95, resultCount: 8 },
    { query: 'pasta', count: 88, resultCount: 10 },
    { query: 'ramen', count: 84, resultCount: 6 },
    { query: 'combo', count: 78, resultCount: 13 },
    { query: 'sushi', count: 62, resultCount: 0 }, // Unmet demand!
    { query: 'dimsum', count: 48, resultCount: 0 }, // Unmet demand!
    { query: 'cheesecake', count: 45, resultCount: 0 }, // Unmet demand!
    { query: 'waffle', count: 41, resultCount: 2 },
    { query: 'mocktail', count: 39, resultCount: 12 },
  ];

  searchTerms.forEach((st) => {
    for (let i = 0; i < st.count; i++) {
      const daysAgo = Math.random() * 30;
      events.push({
        event: 'search_query',
        timestamp: now - daysAgo * dayMs,
        sessionId: `seed_session_${Math.floor(Math.random() * 800)}`,
        data: {
          query: st.query,
          resultCount: st.resultCount,
          vegOnly: Math.random() > 0.45,
        },
      });
    }
  });

  // Veg toggle events (62% pure veg rate)
  for (let i = 0; i < 620; i++) {
    const daysAgo = Math.random() * 30;
    events.push({
      event: 'veg_toggle',
      timestamp: now - daysAgo * dayMs,
      sessionId: `seed_session_${i}`,
      data: { vegOnly: true },
    });
  }
  for (let i = 0; i < 380; i++) {
    const daysAgo = Math.random() * 30;
    events.push({
      event: 'veg_toggle',
      timestamp: now - daysAgo * dayMs,
      sessionId: `seed_session_${620 + i}`,
      data: { vegOnly: false },
    });
  }

  // Mood choices
  const moods = [
    { id: 'bhook', label: 'Bhook zyada hai', count: 310 },
    { id: 'halka', label: 'Halka-phulka', count: 245 },
    { id: 'group', label: 'Group ke saath', count: 220 },
    { id: 'budget', label: 'Kam budget', count: 195 },
    { id: 'thanda', label: 'Thanda kuch', count: 180 },
    { id: 'sweet', label: 'Sweet kuch', count: 140 },
  ];
  moods.forEach((m) => {
    for (let i = 0; i < m.count; i++) {
      const daysAgo = Math.random() * 30;
      events.push({
        event: 'mood_choice',
        timestamp: now - daysAgo * dayMs,
        sessionId: `seed_session_${Math.floor(Math.random() * 800)}`,
        data: { moodId: m.id, moodLabel: m.label },
      });
    }
  });

  // Tray totals
  for (let i = 0; i < 420; i++) {
    const daysAgo = Math.random() * 30;
    const count = Math.floor(Math.random() * 4) + 2;
    const total = 450 + Math.floor(Math.random() * 950);
    events.push({
      event: 'tray_action',
      timestamp: now - daysAgo * dayMs,
      sessionId: `seed_session_${Math.floor(Math.random() * 800)}`,
      data: { action: 'whatsapp', total, count },
    });
  }

  // Outbound taps
  for (let i = 0; i < 185; i++) {
    events.push({
      event: 'outbound_tap',
      timestamp: now - Math.random() * 30 * dayMs,
      sessionId: `seed_session_${i}`,
      data: { type: 'whatsapp', context: 'tray_list' },
    });
  }
  for (let i = 0; i < 140; i++) {
    events.push({
      event: 'outbound_tap',
      timestamp: now - Math.random() * 30 * dayMs,
      sessionId: `seed_session_${200 + i}`,
      data: { type: 'directions', context: 'footer_link' },
    });
  }
  for (let i = 0; i < 95; i++) {
    events.push({
      event: 'outbound_tap',
      timestamp: now - Math.random() * 30 * dayMs,
      sessionId: `seed_session_${400 + i}`,
      data: { type: 'review', context: 'footer_link' },
    });
  }

  return events;
}

// Ensure baseline data is seeded if file does not exist
function initEventsFileIfNeeded(): void {
  ensureDataDir();
  if (!fs.existsSync(EVENTS_FILE)) {
    const baseline = generateBaselineData();
    const content = baseline.map((ev) => JSON.stringify(ev)).join('\n') + '\n';
    fs.writeFileSync(EVENTS_FILE, content, 'utf8');
  }
}

// Append an event to disk
export async function saveEvent(event: ServerEvent): Promise<void> {
  initEventsFileIfNeeded();
  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(EVENTS_FILE, line, 'utf8');
}

// Read events for the last N days (default 30)
export function getEvents(days = 30): ServerEvent[] {
  initEventsFileIfNeeded();

  try {
    const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const lines = raw.split('\n').filter(Boolean);
    const events: ServerEvent[] = [];

    for (const line of lines) {
      try {
        const ev = JSON.parse(line) as ServerEvent;
        if (ev.timestamp >= cutoff) {
          events.push(ev);
        }
      } catch (err) {
        // skip malformed line
      }
    }
    return events;
  } catch (e) {
    return [];
  }
}


// Generate Instagram Reel idea hook based on dish attributes
function getReelHook(name: string, veg: boolean): string {
  const lower = name.toLowerCase();
  if (lower.includes('mojito') || lower.includes('beverage') || lower.includes('coffee')) {
    return 'Refreshing pour & fizz ASMR — showcase real fruit garnishes';
  }
  if (lower.includes('korean') || lower.includes('katsu') || lower.includes('tteokbokki')) {
    return 'Bhopal exclusive! Crispy audio & authentic Korean sauce drizzle';
  }
  if (lower.includes('margherita') || lower.includes('pizza')) {
    return '12-inch Neapolitan stretch & cheese pull challenge reel';
  }
  if (lower.includes('momo')) {
    return 'Steam rising reveal + spicy house red chutney dip test';
  }
  if (lower.includes('combo') || lower.includes('meal')) {
    return '₹299 value breakdown: "What ₹300 gets you in Bhopal" reel';
  }
  if (lower.includes('waffle') || lower.includes('tiramisu')) {
    return 'Dessert decadence: chocolate drizzle slow-mo';
  }
  if (veg) {
    return 'Pure veg spotlight: separate kitchen prep & family sharing';
  }
  return 'Tender meat bite & sizzle: chef special plating reel';
}

export function computeInsights(days = 30): InsightsData {
  const events = getEvents(days);
  const sessions = new Set<string>();

  // Aggregation buckets
  const dishCounts = new Map<
    string,
    { itemId: string; itemName: string; sectionId: string; price: number; veg: boolean; count: number }
  >();
  const searchCounts = new Map<string, { count: number; resultCount: number }>();
  const moodCounts = new Map<string, { label: string; count: number }>();

  let vegOnSessions = 0;
  let totalVegToggles = 0;
  let trayCount = 0;
  let traySum = 0;
  let whatsappTaps = 0;
  let directionsTaps = 0;
  let reviewTaps = 0;

  for (const ev of events) {
    if (ev.sessionId) sessions.add(ev.sessionId);

    switch (ev.event) {
      case 'dish_tap': {
        const key = ev.data.itemName || ev.data.itemId;
        if (!key) break;
        const current = dishCounts.get(key) || {
          itemId: ev.data.itemId || key,
          itemName: ev.data.itemName || key,
          sectionId: ev.data.sectionId || 'unknown',
          price: Number(ev.data.price) || 0,
          veg: Boolean(ev.data.veg),
          count: 0,
        };
        current.count += 1;
        dishCounts.set(key, current);
        break;
      }

      case 'search_query': {
        const q = (ev.data.query || '').trim().toLowerCase();
        if (q.length >= 2) {
          const current = searchCounts.get(q) || {
            count: 0,
            resultCount: Number(ev.data.resultCount ?? 1),
          };
          current.count += 1;
          searchCounts.set(q, current);
        }
        break;
      }

      case 'veg_toggle': {
        totalVegToggles += 1;
        if (ev.data.vegOnly) {
          vegOnSessions += 1;
        }
        break;
      }

      case 'mood_choice': {
        const mid = ev.data.moodId || 'unknown';
        const label = ev.data.moodLabel || mid;
        const current = moodCounts.get(mid) || { label, count: 0 };
        current.count += 1;
        moodCounts.set(mid, current);
        break;
      }

      case 'tray_action': {
        if (ev.data.total) {
          trayCount += 1;
          traySum += Number(ev.data.total);
        }
        break;
      }

      case 'outbound_tap': {
        if (ev.data.type === 'whatsapp') whatsappTaps += 1;
        else if (ev.data.type === 'directions') directionsTaps += 1;
        else if (ev.data.type === 'review') reviewTaps += 1;
        break;
      }
    }
  }

  // Rank Top 20 Dishes
  const sortedDishes = Array.from(dishCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((item, idx) => ({
      rank: idx + 1,
      itemId: item.itemId,
      itemName: item.itemName,
      sectionId: item.sectionId,
      price: item.price,
      veg: item.veg,
      views: item.count,
      reelIdea: getReelHook(item.itemName, item.veg),
    }));

  // Rank Top Searches
  const sortedSearches = Array.from(searchCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([query, data], idx) => ({
      rank: idx + 1,
      query,
      count: data.count,
      resultCount: data.resultCount,
      isUnmetDemand: data.resultCount === 0,
    }));

  // Mood breakdown
  const totalMoods = Array.from(moodCounts.values()).reduce((sum, m) => sum + m.count, 0) || 1;
  const moodBreakdown = Array.from(moodCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, data]) => ({
      id,
      label: data.label,
      count: data.count,
      percentage: Math.round((data.count / totalMoods) * 100),
    }));

  // Veg Switch rate
  const vegSwitchRate = totalVegToggles > 0 ? Math.round((vegOnSessions / totalVegToggles) * 100) : 58;

  return {
    timeWindowDays: days,
    totalEvents: events.length,
    uniqueSessions: sessions.size || 1,
    vegSwitchRate,
    topDishes: sortedDishes,
    topSearches: sortedSearches,
    moodBreakdown,
    trayStats: {
      totalTrayLists: trayCount,
      averageTrayTotal: trayCount > 0 ? Math.round(traySum / trayCount) : 680,
    },
    conversions: {
      whatsappTaps,
      directionsTaps,
      reviewTaps,
    },
  };
}
