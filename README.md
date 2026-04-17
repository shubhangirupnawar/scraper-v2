# BigBasket + Flipkart Review Scraper v2

## Requirements
- Python 3.9+
- Node.js 18+

---

## Setup & Run

### Step 1 — Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --port 8080 --reload
```

### Step 2 — Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### Step 3 — Open in browser
```
http://localhost:5173
```

---

## How to Use

1. **BigBasket** — Paste product page URL → Click "Scrape All Reviews" → Download Excel
2. **Flipkart** — Paste product/review page URL → Click "Scrape All Reviews" → Download Excel

Each platform downloads a **separate Excel file** — no combined sheet.

---

## Excel Output Format (per platform)

### Sheet 1: Reviews (BigBasket Reviews / Flipkart Reviews)

| Column | Description |
|---|---|
| review_id | Auto-generated: Platform+Brand+Product+Date+Seq |
| rating | Star rating (1–5) |
| review_header | Review title |
| review_text | Review body |
| review_combine | Header + text combined |
| review_country | Country (default: india) |
| date | Date (YYYY-MM-DD) |
| product_name | Product name |
| brand | Brand name |
| variant_name | Pack size / variant (e.g. 5 kg) |
| sku | Numeric SKU (BB) / item-id (Flipkart) |
| product_url | Product page URL |
| category | Category (e.g. Atta, Oil) |
| platform | bigbasket / flipkart |

### Sheet 2: Summary
- Product URL, rating stats, scrape date, review count

### Sheet 3: Column Reference
- Description of every column

> Note: review_media column removed.

---

## Notes

- A browser window opens automatically during scraping — do NOT close it
- BigBasket: Fast (API-based interception)
- Flipkart: Slower (DOM scraping, 5–15 min depending on review count)
- Use "Scrape Until Date" (DD-MM-YYYY) to limit how far back reviews are collected

---

## Setup Instructions
1. Clone the repo
2. Copy `.env.example` → `.env`
3. Fill in your API keys in `.env`
4. Backend: `pip install -r requirements.txt`
5. Frontend: `npm install`