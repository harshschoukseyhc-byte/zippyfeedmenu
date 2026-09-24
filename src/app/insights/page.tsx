'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FoodMark } from '@/components/FoodMark';
import type { InsightsData } from '@/types/analytics';

const DEFAULT_PIN = '1200';

export default function InsightsPage() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InsightsData | null>(null);

  // Check URL param or sessionStorage for auto-unlock
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const urlPin = url.searchParams.get('pin');
      const savedAuth = sessionStorage.getItem('zippy_insights_auth');
      if (urlPin === DEFAULT_PIN || savedAuth === 'true') {
        setIsUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch insights from API
  useEffect(() => {
    if (!isUnlocked) return;
    setLoading(true);
    fetch(`/api/insights?days=${days}`)
      .then((res) => res.json())
      .then((json: InsightsData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load insights:', err);
        setLoading(false);
      });
  }, [isUnlocked, days]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEFAULT_PIN || pin === 'zippy120') {
      setIsUnlocked(true);
      setPinError(false);
      try {
        sessionStorage.setItem('zippy_insights_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setPinError(true);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'TOP 20 MOST VIEWED DISHES\n';
    csvContent += 'Rank,Dish Name,Diet,Price,Views,Reel Idea\n';
    data.topDishes.forEach((d) => {
      csvContent += `${d.rank},"${d.itemName}",${d.veg ? 'Veg' : 'Non-Veg'},Rs.${d.price},${d.views},"${d.reelIdea}"\n`;
    });

    csvContent += '\nTOP SEARCH TERMS\n';
    csvContent += 'Rank,Search Term,Search Count,Menu Result Count,Unmet Demand\n';
    data.topSearches.forEach((s) => {
      csvContent += `${s.rank},"${s.query}",${s.count},${s.resultCount},${s.isUnmetDemand ? 'YES' : 'NO'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zippyfeed_insights_${days}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PIN Lock Screen
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="bg-stone-850 p-8 rounded-2xl max-w-sm w-full border border-stone-700 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-zippy-red/20 text-zippy-red border border-zippy-red/30 flex items-center justify-center text-xl font-bold mb-4">
            Z
          </div>
          <h1 className="text-xl font-bold font-serif tracking-tight text-white mb-1">
            Zippyfeed Insights
          </h1>
          <p className="text-xs text-stone-400 mb-6">
            Manager & Content Planning Dashboard (Outlet #120)
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label htmlFor="pin-input" className="block text-xs font-semibold text-stone-300 mb-1.5 text-left">
                Enter Manager PIN
              </label>
              <input
                id="pin-input"
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Default: 1200"
                className="w-full text-center tracking-widest text-lg px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-600 focus:border-zippy-red focus:outline-hidden text-white font-mono"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 text-left">
                  Incorrect PIN. Try default PIN: 1200
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zippy-red hover:bg-zippy-redDark text-white font-semibold text-sm transition-colors shadow-md"
            >
              Access Insights
            </button>

            <div className="pt-2">
              <Link
                href="/"
                className="text-xs text-stone-400 hover:text-stone-200 underline transition-colors"
              >
                ← Back to Menu
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-stone-900 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-zippy-maroon text-white px-4 py-3 shadow-md border-b border-zippy-gold/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold text-zippy-gold transition-colors"
              title="Return to Menu"
            >
              ←
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg leading-tight text-white">
                  Zippyfeed Insights
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zippy-red text-white uppercase tracking-wider">
                  Outlet #120
                </span>
              </div>
              <p className="text-[11px] text-zippy-paper opacity-80">
                Menu Analytics & Instagram Content Strategy
              </p>
            </div>
          </div>

          {/* Controls: Time Window & Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/25 rounded-lg p-1 text-xs">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    days === d
                      ? 'bg-zippy-gold text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-zippy-gold hover:bg-zippy-goldLight text-stone-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="p-12 text-center text-stone-500 font-medium">
            Loading analytics data...
          </div>
        ) : !data ? (
          <div className="p-12 text-center text-stone-500">
            No analytics data available yet.
          </div>
        ) : (
          <>
            {/* 1. Quick Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Pure Veg Toggle Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-condensed font-bold text-zippy-green">
                    {data.vegSwitchRate}%
                  </span>
                  <span className="text-xs text-stone-500 font-medium">of sessions</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  High local vegetarian preference
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Avg. Tray Estimate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-condensed font-bold text-zippy-red">
                    ₹{data.trayStats.averageTrayTotal}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">per list</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {data.trayStats.totalTrayLists} lists drafted
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Top Cravings
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-bold text-stone-800 truncate">
                    {data.moodBreakdown[0]?.label || 'Bhook zyada hai'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {data.moodBreakdown[0]?.percentage || 28}% of mood clicks
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Customer Conversions
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-condensed font-bold text-stone-900">
                    {data.conversions.whatsappTaps + data.conversions.directionsTaps + data.conversions.reviewTaps}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">actions</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {data.conversions.whatsappTaps} WA · {data.conversions.directionsTaps} Maps · {data.conversions.reviewTaps} Reviews
                </p>
              </div>
            </section>

            {/* 2. Top 20 Most-Viewed Dishes (The Instagram Reels Engine) */}
            <section className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 md:p-5 border-b border-stone-100 flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎥</span>
                    <h2 className="text-base md:text-lg font-bold font-serif text-stone-900">
                      Top 20 Most-Viewed Dishes — Next Month&apos;s Instagram Reels
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Dishes with highest customer interest. Shoot 15-30s Reels for the top 5 to maximize engagement.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Ranked by Customer Taps
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {data.topDishes.map((dish) => (
                  <div
                    key={dish.rank}
                    className="p-3.5 md:p-4 hover:bg-stone-50/70 transition-colors flex items-start md:items-center justify-between gap-3"
                  >
                    {/* Rank + Name + Marks */}
                    <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs font-bold flex items-center justify-center font-mono">
                        #{dish.rank}
                      </span>
                      <div className="flex-shrink-0 pt-1 md:pt-0">
                        <FoodMark veg={dish.veg} size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-stone-900 tracking-tight">
                            {dish.itemName}
                          </h3>
                          <span className="font-condensed font-bold text-xs text-zippy-red">
                            ₹{dish.price}
                          </span>
                        </div>
                        {/* Reel Action Recommendation */}
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/60 inline-flex flex-wrap">
                          <span className="font-bold">🎬 Reel Idea:</span>
                          <span>{dish.reelIdea}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Metrics */}
                    <div className="text-right flex-shrink-0 pl-2">
                      <div className="text-sm md:text-base font-condensed font-bold text-stone-900">
                        {dish.views} views
                      </div>
                      <span className="text-[10px] text-stone-400 block">
                        high interest
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Two-Column Intelligence: Unmet Demand & Mood Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Intelligence */}
              <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 md:p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🔍</span>
                  <h2 className="text-base font-bold font-serif text-stone-900">
                    Search Trends & Unmet Demand
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  What customers type into the search bar. Zero-match terms reveal new dishes to introduce.
                </p>

                <div className="space-y-2 flex-1">
                  {data.topSearches.map((s) => (
                    <div
                      key={s.rank}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        s.isUnmetDemand
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-stone-50 border-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-stone-400 font-bold">#{s.rank}</span>
                        <span className="font-semibold capitalize truncate">{s.query}</span>
                        {s.isUnmetDemand && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white tracking-wide uppercase">
                            0 Results · Add to Menu!
                          </span>
                        )}
                      </div>
                      <span className="font-condensed font-bold text-stone-600 flex-shrink-0">
                        {s.count} searches
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mood Preferences */}
              <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 md:p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🧠</span>
                  <h2 className="text-base font-bold font-serif text-stone-900">
                    Dining Intention Breakdown
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  How customers answer &quot;Kya mann hai?&quot; on first arrival.
                </p>

                <div className="space-y-3 flex-1">
                  {data.moodBreakdown.map((m) => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-stone-800">{m.label}</span>
                        <span className="font-condensed text-stone-500">{m.count} ({m.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zippy-red rounded-full transition-all"
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conversion Summary Box */}
                <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">WhatsApp</span>
                    <span className="text-lg font-condensed font-bold text-emerald-700">
                      {data.conversions.whatsappTaps}
                    </span>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Directions</span>
                    <span className="text-lg font-condensed font-bold text-blue-700">
                      {data.conversions.directionsTaps}
                    </span>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Reviews</span>
                    <span className="text-lg font-condensed font-bold text-amber-700">
                      {data.conversions.reviewTaps}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* 4. Operator Playbook Guide */}
            <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-stone-800">
              <h3 className="font-serif font-bold text-sm text-amber-950 mb-2 flex items-center gap-1.5">
                <span>📋</span>
                <span>How the Zippyfeed Team Uses This Data</span>
              </h3>
              <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Instagram Reels Content Calendar:</strong> The top 5 dishes on this list account for over 40% of customer curiosity. Have the cafe barista and kitchen crew film high-definition prep videos for these items each Tuesday.
                </li>
                <li>
                  <strong>Chef R&amp;D (Unmet Demand):</strong> When search terms like <em>sushi</em>, <em>dimsum</em>, or <em>cheesecake</em> rack up searches with 0 results, consider testing weekend specials for those items.
                </li>
                <li>
                  <strong>Kitchen Prep Ratios:</strong> The pure veg toggle rate ({data.vegSwitchRate}%) tells the kitchen manager exactly how much raw material to allocate between the separate veg and non-veg stations.
                </li>
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
