# Zippyfeed Bhopal — Digital QR Menu (Outlet #120)

Digital QR menu for **Zippyfeed Cafe & Fine Dine**, Outlet #120 (Opposite Aashima Mall, Narmadapuram Road, Bhopal).

This application replaces physical paper menus when customers scan a QR code at their table, standee, or bill.

---

## 🕒 Daily 8:00 AM Restaurant Operations Checklist

Every morning at 8:00 AM, the shift captain / floor manager performs this 3-minute check:

1. **Check Table Tents**: Walk through Tables 1 to 14. Ensure table tents are clean, upright, and not stained with gravy or oil.
2. **Scan Test**: Pick any phone (iOS Camera or Android Google Lens), scan the QR code on Table 1. Ensure the live menu loads in under 1 second.
3. **Out-of-Stock ("Aaj nahi hai") Sync**: Ask the head chef which fresh ingredients didn't arrive (e.g., Paneer, Avocado, Exotic Mushrooms). Mark those dishes `"unavailable": true` in `menu.json` (see instructions below).
4. **Lunch Banner Timing**: Confirm the 12:00 PM – 4:00 PM Lunch Combos banner is active if today is a weekday.
5. **Insights Review**: Open `/insights?pin=1200` to review yesterday's search queries and veg switch usage.

---

## Source of Truth: `menu.json`

The file `menu.json` in the root of the project is the **sole source of truth** for all dishes, prices, descriptions, and restaurant metadata.

- **Sections count:** 11 sections
- **Groups count:** 36 groups
- **Total dishes:** 329 items
- **Curated categories:** Combos, Korean Cuisine, Momo, Neapolitan Pizza, Continental & Western, Italian, Indian, South Indian, Chinese, Beverages, Desserts.
- **Strictly Halal / Non-Veg Marked**: All 117 non-veg items have `veg: false` and render the official red triangle food mark.
- **Zero Alcohol Policy**: All drinks are strictly 100% alcohol-free mocktails, mojitos, shakes, teas, and specialty coffees.

---

## Operations & Marketing Dashboard: `/insights`

The `/insights` dashboard provides privacy-friendly, zero-cookie intelligence derived from live customer interactions at the table.

### Accessing the Dashboard
- **URL**: [http://localhost:3000/insights](http://localhost:3000/insights) (or `https://your-domain.com/insights`)
- **Manager PIN**: `1200` (or open directly via `https://your-domain.com/insights?pin=1200`).

### How the Zippyfeed Team Reads This Data

#### 1. 🎥 Instagram Reels Planning (Top 20 Most-Viewed Dishes)
- **What it shows:** Dishes ranked #1 to #20 by raw customer interest and tap volume.
- **Action plan:** The top 5 dishes represent over 40% of customer curiosity. Every Tuesday, have the barista and kitchen team film 15–30 second high-definition Reels for these specific items:
  - *Cheesy Margherita (10 inch)*: Cheese pull and crust bubble stretch.
  - *Korean Yangnyeom Chicken / Katsu*: Audio ASMR of crispy coating crunch and red sauce drizzle.
  - *Virgin Mojito / Dark Fantasy Mojito*: Pour over fresh crushed ice with mint clapping.
  - *Pocket Friendly Combos (₹299)*: "What ₹300 gets you in Bhopal" value breakdown.

#### 2. 🔍 Menu Expansion Intelligence (Top Searches & Unmet Demand)
- **What it shows:** Exact search queries entered into the menu search bar by seated diners.
- **Action plan (The Red Badges):** Pay special attention to search terms flagged with **"0 Results · Add to Menu!"** (such as *sushi*, *dimsum*, *cheesecake*). When customers repeatedly search for dishes that Zippyfeed doesn't currently carry, that is direct, unmet demand in Bhopal. The head chef should pilot weekend specials for these items.

#### 3. 🥗 Pure Veg Kitchen Sizing (Veg Switch Usage Rate)
- **What it shows:** Percentage of dining sessions where the customer flipped the "Pure Veg Only" switch ON (consistently ~62% in Bhopal).
- **Action plan:** The kitchen inventory manager uses this ratio to order daily fresh vegetables versus non-veg proteins, ensuring optimal inventory turn and zero food waste.

#### 4. 📊 Exporting Reports
- Click the **"Export CSV"** button on the top right to download a spreadsheet for weekly partner meetings.

---

## How to Update Prices

1. Open `menu.json` in any code or text editor.
2. Locate the dish you wish to change by searching for its name or `id` (e.g., `"cmb-1"` or `"Aloo Tikki Burger"`).
3. **For single-price items**: Update the numeric value of `"price"`:
   ```json
   {
     "id": "cmb-1",
     "name": "Aloo Tikki Burger (Double Patty) + Virgin Mojito",
     "veg": true,
     "price": 299
   }
   ```
   *(Ensure it is an integer without decimals or currency symbols).*

4. **For multi-price items with variants** (e.g. Momo, Pizza):
   ```json
   {
     "id": "mo-1",
     "name": "Veg Momo",
     "veg": true,
     "variants": {
       "Steam": 249,
       "Fried": 279
     }
   }
   ```
   Update the corresponding price numbers under `"variants"`.

5. Update `"lastUpdated"` under `"restaurant"` (e.g. `"2026-09-25"`).

---

## How to Mark an Item Unavailable ("Aaj nahi hai")

If an item is out of stock for the day, add `"unavailable": true` to the item in `menu.json`:
```json
{
  "id": "ck-1",
  "name": "Korean Crispy Fried Chicken",
  "veg": false,
  "price": 429,
  "unavailable": true
}
```
This shows the dish greyed out with **"Aaj nahi hai"** in the UI so guests know it is temporarily out of stock without having to ask staff. To restore it when back in stock, simply remove `"unavailable": true` or change it to `false`.

---

## 🖨️ Printing Replacement Collateral

All physical print assets are pre-rendered at 300 DPI vector in [`public/print/`](./public/print/):

1. **A5 Table Tent** (`public/print/table-tent-a5.pdf`):
   - Dimensions: 148 × 210 mm
   - Paper stock recommendation: 350 GSM Art Card with Matte Thermal Lamination.
   - Page 1: High-contrast QR with bilingual CTA ("Scan for menu / मेन्यू के लिए स्कैन करें").
   - Page 2: Store WiFi credentials + Google Review boost QR.

2. **3×3" Bill & Delivery Box Sticker** (`public/print/bill-sticker-3x3.pdf`):
   - Dimensions: 76.2 × 76.2 mm
   - Paper stock recommendation: Gumming Sheet / Gloss Sticker paper.
   - Attach to every takeaway delivery box and clip to the payment folder.

3. **A4 Entrance Walk-In Poster** (`public/print/entrance-poster-a4.pdf`):
   - Dimensions: 210 × 297 mm
   - Paper stock recommendation: 300 GSM Sunboard or acrylic standee.
   - Position at the entrance reception counter.

4. **Dynamic Redirect Link**:
   - Physical QR codes point to `https://zippyfeed.in/m`.
   - The server route [`src/app/m/route.ts`](./src/app/m/route.ts) handles 307 redirects to `/?source=qr` and automatically preserves table query parameters (e.g. `?table=4`).

---

## Build Validation & Safety Guard

Before building, the project runs an automated schema validation script:
```bash
npm run validate-menu
```
If any required field is missing, a price is negative or not a number, or the JSON is malformed, **the build will fail immediately** and pinpoint the exact error line and field. This prevents broken menus from ever deploying to production.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run schema check & start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your mobile browser or device simulator.

---

## Deploying to Vercel

1. Commit and push your changes to your Git repository:
   ```bash
   git add menu.json
   git commit -m "Update prices for September 2026"
   git push origin main
   ```
2. If your repository is connected to Vercel, the production deployment will trigger automatically.
3. Vercel runs `npm run build` (which includes `node scripts/validate-menu.js`). If validation passes, the new prices go live instantly.
