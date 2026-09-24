export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
}

export interface ServerEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
}

export interface TopDishInsight {
  rank: number;
  itemId: string;
  itemName: string;
  sectionId: string;
  price: number;
  veg: boolean;
  views: number;
  reelIdea: string;
}

export interface TopSearchInsight {
  rank: number;
  query: string;
  count: number;
  resultCount: number;
  isUnmetDemand: boolean;
}

export interface MoodInsight {
  id: string;
  label: string;
  count: number;
  percentage: number;
}

export interface InsightsData {
  timeWindowDays: number;
  totalEvents: number;
  uniqueSessions: number;
  vegSwitchRate: number;
  topDishes: TopDishInsight[];
  topSearches: TopSearchInsight[];
  moodBreakdown: MoodInsight[];
  trayStats: {
    totalTrayLists: number;
    averageTrayTotal: number;
  };
  conversions: {
    whatsappTaps: number;
    directionsTaps: number;
    reviewTaps: number;
  };
}
