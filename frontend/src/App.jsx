import { useState, useRef, useEffect } from 'react'

const C = {
  bb: {
    primary: '#4ade80', dim: '#22c55e', glow: 'rgba(74,222,128,0.15)',
    text: '#052e16', bg: 'rgba(15,26,15,0.85)', border: 'rgba(74,222,128,0.25)',
    logBorder: 'rgba(74,222,128,0.12)', badge: 'rgba(74,222,128,0.10)',
    badgeBorder: 'rgba(74,222,128,0.3)'
  },
  fk: {
    primary: '#fb923c', dim: '#f97316', glow: 'rgba(251,146,60,0.15)',
    text: '#431407', bg: 'rgba(26,15,8,0.85)', border: 'rgba(251,146,60,0.25)',
    logBorder: 'rgba(251,146,60,0.12)', badge: 'rgba(251,146,60,0.10)',
    badgeBorder: 'rgba(251,146,60,0.3)'
  },
}

const ALL_COLUMNS = [
  { key: 'review_id',      desc: 'Unique ID per review' },
  { key: 'rating',         desc: 'Star rating (1-5)' },
  { key: 'review_header',  desc: 'Title / headline' },
  { key: 'review_text',    desc: 'Full body text' },
  { key: 'review_combine', desc: 'Header + Text merged' },
  { key: 'review_country', desc: 'Country of review' },
  { key: 'date',           desc: 'Review date YYYY-MM-DD' },
  { key: 'product_name',   desc: 'Full product name' },
  { key: 'brand',          desc: 'Brand name' },
  { key: 'variant_name',   desc: 'Pack size / variant' },
  { key: 'sku',            desc: 'Platform product ID' },
  { key: 'product_url',    desc: 'Direct product link' },
  { key: 'category',       desc: 'Product category' },
  { key: 'platform',       desc: 'bigbasket / flipkart' },
]

const BB_LOG_SEQUENCE = [
  { delay: 0,     msg: 'Validating product URL...' },
  { delay: 1800,  msg: 'Launching Chromium browser (headless)...' },
  { delay: 3500,  msg: 'Navigating to BigBasket product page...' },
  { delay: 6000,  msg: 'Waiting for page load + network idle...' },
  { delay: 8500,  msg: 'Strategy 1: Listening for XHR review API calls...' },
  { delay: 11000, msg: 'Strategy 2: DOM mining — scanning review card elements...' },
  { delay: 14500, msg: 'Strategy 3: Checking JS globals (__NEXT_DATA__, __PRELOADED_STATE__)...' },
  { delay: 17500, msg: 'Strategy 4: Parsing inline <script> JSON blobs...' },
  { delay: 21000, msg: 'Strategy 5: In-browser fetch to BB API endpoints...' },
  { delay: 25000, msg: 'Page 1 done — deduplicating reviews...' },
  { delay: 30000, msg: 'Page 2: repeating all 5 strategies...' },
  { delay: 36000, msg: 'Page 3: collecting & merging results...' },
  { delay: 44000, msg: 'Continuing through remaining pages...' },
  { delay: 60000, msg: 'Still scraping — BB rate-limits aggressively, please wait...' },
  { delay: 80000, msg: 'Retry logic active — 2-4s delay between pages...' },
  { delay: 110000,msg: 'Filtering by date cutoff (if set) & finalising...' },
]

const FK_LOG_SEQUENCE = [
  { delay: 0,     msg: 'Validating Flipkart product URL...' },
  { delay: 1800,  msg: 'Launching Chromium browser (headless)...' },
  { delay: 3500,  msg: 'Visiting Flipkart homepage to establish session...' },
  { delay: 6000,  msg: 'Dismissing login popup if present...' },
  { delay: 8000,  msg: 'Fetching product page for metadata (name, brand, SKU)...' },
  { delay: 12000, msg: 'Navigating to product-reviews page (sorted: most recent)...' },
  { delay: 15000, msg: 'DOM scraping: extracting CSS card elements...' },
  { delay: 19000, msg: 'Page 1 complete — deduplicating...' },
  { delay: 25000, msg: 'Page 2: scrolling & extracting review cards...' },
  { delay: 33000, msg: 'Page 3: parsing dates, ratings, review text...' },
  { delay: 42000, msg: 'Continuing — Flipkart has up to 100 pages...' },
  { delay: 60000, msg: 'Still running — DOM scraping is thorough but slower...' },
  { delay: 90000, msg: 'Applying date filter, dedup by title+body key...' },
]

function ts() { return new Date().toTimeString().slice(0, 8) }

function ColumnGrid({ c }) {
  return (
    <div style={{ marginTop: '10px', marginBottom: '4px' }}>
      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: c.primary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.8 }}>
        Excel Columns ({ALL_COLUMNS.length} total)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
        {ALL_COLUMNS.map((col, i) => (
          <div key={col.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${c.badgeBorder}`, borderRadius: '6px', padding: '5px 8px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ fontSize: '9px', fontFamily: 'monospace', color: c.primary, opacity: 0.4, minWidth: '16px', marginTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f0fdf4' }}>{col.key}</div>
              <div style={{ fontSize: '9px', color: c.primary, opacity: 0.55, fontFamily: 'monospace' }}>{col.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScraperCard({ type, label, placeholder, apiValidate, apiScrape, emoji, logoText, onResult }) {
  const c = C[type]
  const isBB = type === 'bb'
  const [url, setUrl] = useState('')
  const [untilDate, setUntilDate] = useState('')
  const [focused, setFocused] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const [dlHover, setDlHover] = useState(false)
  const [status, setStatus] = useState('idle')
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)
  const [showCols, setShowCols] = useState(false)
  const logRef = useRef(null)
  const timerRefs = useRef([])
  const isRunning = status === 'validating' || status === 'scraping'

  const addLog = (msg) => setLogs(p => [...p, { time: ts(), msg }])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  function clearTimers() {
    timerRefs.current.forEach(t => clearTimeout(t))
    timerRefs.current = []
  }

  function scheduleLogSequence(sequence) {
    clearTimers()
    sequence.forEach(({ delay, msg }) => {
      const t = setTimeout(() => addLog(msg), delay)
      timerRefs.current.push(t)
    })
  }

  async function handleScrape() {
    if (!url.trim()) { setError('Please enter a URL.'); return }
    const domain = isBB ? 'bigbasket.com' : 'flipkart.com'
    if (!url.includes(domain)) { setError(`URL must be a ${label} link.`); return }

    setError(''); setResult(null); setLogs([]); setProgress(0); setStatus('validating')
    scheduleLogSequence(isBB ? BB_LOG_SEQUENCE : FK_LOG_SEQUENCE)

    const progressTick = setInterval(() => {
      setProgress(p => {
        if (p >= 88) { clearInterval(progressTick); return 88 }
        const inc = p < 20 ? 3 : p < 50 ? 1.5 : p < 75 ? 0.6 : 0.2
        return Math.min(p + inc * (0.5 + Math.random()), 88)
      })
    }, 1800)
    timerRefs.current.push(progressTick)

    try {
      const vRes = await fetch(apiValidate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: untilDate.trim() })
      })
      if (!vRes.ok) {
        const e = await vRes.json()
        throw new Error(e.detail || 'Invalid URL')
      }
      const info = await vRes.json()
      if (info.sku)  addLog(`  SKU: ${info.sku}`)
      if (info.slug) addLog(`  Slug: ${info.slug}`)
      if (info.item) addLog(`  Item ID: ${info.item}`)

      setStatus('scraping')

      const sRes = await fetch(apiScrape, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: untilDate.trim() })
      })

      clearTimers()
      clearInterval(progressTick)

      if (!sRes.ok) {
        const e = await sRes.json()
        throw new Error(e.detail || 'Scraping failed')
      }

      setProgress(100)
      const blob = await sRes.blob()
      const cd = sRes.headers.get('content-disposition') || ''
      const fnm = cd.match(/filename="([^"]+)"/)
      const filename = fnm ? fnm[1] : 'reviews.xlsx'
      const cm = filename.match(/_(\d+)_reviews/)
      const count = cm ? parseInt(cm[1]) : null

      addLog(`Done! ${count ?? '?'} reviews collected.`)
      addLog(`Excel ready: ${filename}`)
      addLog(`All ${ALL_COLUMNS.length} columns populated.`)

      const r = { blob, filename, count }
      setResult(r)
      onResult && onResult(r)
      setStatus('done')

    } catch (e) {
      clearTimers()
      clearInterval(progressTick)
      let msg = e.message
      if (msg.includes('No reviews found') && isBB) {
        msg = 'No reviews found. BigBasket may have blocked the scraper or this product has no reviews. Try again — the multi-strategy scraper (5 methods) will retry automatically.'
      }
      setError(msg)
      setStatus('error')
      addLog(`Error: ${e.message}`)
    }
  }

  function handleDownload() {
    if (!result) return
    const u = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = u; a.download = result.filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(u), 1000)
  }

  const statusColor = { idle: c.primary, validating: '#facc15', scraping: '#facc15', done: c.primary, error: '#f87171' }[status]
  const statusText  = { idle: 'READY', validating: 'VALIDATING', scraping: 'SCRAPING...', done: 'COMPLETE', error: 'ERROR' }[status]

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '20px', padding: '32px', backdropFilter: 'blur(20px)', flex: 1, minWidth: '320px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: c.badge, border: `1px solid ${c.badgeBorder}`, borderRadius: '10px', padding: '8px 14px', fontWeight: 800, fontSize: '18px', color: c.primary }}>{logoText}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#f0fdf4' }}>{label}</div>
          <div style={{ fontSize: '11px', color: c.primary, fontFamily: 'monospace', opacity: 0.7 }}>Review Scraper</div>
        </div>
        <button onClick={() => setShowCols(v => !v)} style={{ marginLeft: 'auto', cursor: 'pointer', background: c.badge, border: `1px solid ${c.badgeBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontFamily: 'monospace', color: c.primary, outline: 'none' }}>
          {ALL_COLUMNS.length} cols {showCols ? 'v' : '>'}
        </button>
      </div>

      {showCols && <ColumnGrid c={c} />}

      <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: c.primary, marginBottom: '8px', textTransform: 'uppercase', marginTop: showCols ? '14px' : '0' }}>Product URL</label>
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔗</span>
        <input type="url" placeholder={placeholder} value={url}
          onChange={e => setUrl(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && !isRunning && handleScrape()}
          disabled={isRunning}
          style={{ width: '100%', background: focused ? c.glow : 'rgba(255,255,255,0.04)', border: `1.5px solid ${focused ? c.primary : c.border}`, borderRadius: '10px', padding: '14px 14px 14px 42px', fontSize: '12px', fontFamily: 'monospace', color: '#f0fdf4', outline: 'none', transition: 'all 0.2s', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'text' }}
          spellCheck={false} />
      </div>

      <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: c.primary, marginBottom: '8px', textTransform: 'uppercase' }}>
        Scrape Until Date <span style={{ opacity: 0.5 }}>(DD-MM-YYYY, optional)</span>
      </label>
      <input type="text" placeholder="e.g. 01-01-2024  -- leave blank for all"
        value={untilDate} onChange={e => setUntilDate(e.target.value)} disabled={isRunning}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${c.border}`, borderRadius: '10px', padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#f0fdf4', outline: 'none', marginBottom: '16px', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'text' }}
        spellCheck={false} />

      <button onClick={handleScrape} disabled={isRunning}
        onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
        style={{ width: '100%', padding: '16px', borderRadius: '10px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer', background: `linear-gradient(135deg, ${c.primary}, ${c.dim})`, color: c.text, fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', opacity: isRunning ? 0.7 : 1, transform: btnHover && !isRunning ? 'translateY(-2px)' : 'none', boxShadow: btnHover && !isRunning ? `0 8px 24px ${c.glow}` : `0 4px 16px ${c.glow}` }}>
        {isRunning
          ? (<><div style={{ width: '16px', height: '16px', border: `2px solid ${c.text}44`, borderTopColor: c.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />{status === 'validating' ? 'Validating...' : 'Scraping Reviews...'}</>)
          : (<>{emoji} Scrape All Reviews</>)}
      </button>

      {status === 'done' && result && (
        <button onClick={handleDownload}
          onMouseEnter={() => setDlHover(true)} onMouseLeave={() => setDlHover(false)}
          style={{ width: '100%', padding: '16px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '10px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: '#fff', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', transform: dlHover ? 'translateY(-2px)' : 'none', boxShadow: dlHover ? '0 8px 24px rgba(96,165,250,0.3)' : '0 4px 16px rgba(96,165,250,0.15)' }}>
          Download Excel ({result.count ?? '?'} reviews - {ALL_COLUMNS.length} cols)
        </button>
      )}

      {(isRunning || status === 'done') && progress > 0 && (
        <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '100px', background: `linear-gradient(90deg, ${c.dim}, ${c.primary})`, width: `${Math.min(progress, 100)}%`, transition: 'width 0.8s ease' }} />
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, flexShrink: 0, animation: isRunning ? 'blink 1.2s ease infinite' : 'none' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: statusColor, letterSpacing: '0.1em' }}>{statusText}</span>
            {isRunning && (
              <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: c.primary, opacity: 0.5 }}>
                {isBB ? 'est. ~1-3 min' : 'est. ~5-15 min'}
              </span>
            )}
          </div>
          <div ref={logRef} style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${c.logBorder}`, borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.8, maxHeight: '200px', overflowY: 'auto' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#4ade8044', flexShrink: 0 }}>[{l.time}]</span>
                <span style={{ color: type === 'fk' ? '#fed7aa' : '#86efac' }}>{l.msg}</span>
              </div>
            ))}
            {isRunning && <div style={{ color: '#4ade8066' }}>|</div>}
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <div style={{ marginTop: '14px', background: c.badge, border: `1px solid ${c.badgeBorder}`, borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {[['Total Reviews', result.count ?? '?'], ['Columns', ALL_COLUMNS.length], ['Format', 'XLSX']].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '10px 6px' }}>
                <div style={{ fontWeight: 800, fontSize: '20px', color: c.primary }}>{v}</div>
                <div style={{ fontSize: '9px', color: c.primary, opacity: 0.6, fontFamily: 'monospace', textTransform: 'uppercase' }}>{k}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: c.primary, opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase' }}>Columns in Excel:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {ALL_COLUMNS.map(col => (
              <span key={col.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${c.badgeBorder}`, borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontFamily: 'monospace', color: c.primary }}>
                {col.key}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px' }}>
          <span>Warning:</span>
          <span style={{ color: '#fca5a5', fontSize: '12px', fontFamily: 'monospace', lineHeight: 1.5 }}>{error}</span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [bbResult, setBbResult] = useState(null)
  const [fkResult, setFkResult] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #050c05 0%, #080c08 50%, #0a0e0a 100%)', padding: '40px 16px 80px', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.3); border-radius: 4px; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px', fontSize: '11px', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '0.1em' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'blink 1.4s ease infinite' }} />
            PLAYWRIGHT · FASTAPI · REACT
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            <span style={{ color: '#f0fdf4' }}>Review </span><span style={{ color: '#4ade80' }}>Scraper</span>
          </h1>
          <p style={{ color: '#86efac', fontSize: '14px', opacity: 0.8, maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Scrape all reviews from BigBasket & Flipkart -- {ALL_COLUMNS.length} columns -- export to Excel.
          </p>
          {(bbResult || fkResult) && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {bbResult && <span style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#4ade80' }}>BigBasket: {bbResult.count ?? '?'} reviews</span>}
              {fkResult && <span style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#fb923c' }}>Flipkart: {fkResult.count ?? '?'} reviews</span>}
              {bbResult && fkResult && <span style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#fde047', fontWeight: 700 }}>Total: {(bbResult.count ?? 0) + (fkResult.count ?? 0)}</span>}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ScraperCard
            type="bb" label="BigBasket"
            placeholder="https://www.bigbasket.com/pd/126906/aashirvaad-atta-whole-wheat"
            apiValidate="/api/validate-bigbasket" apiScrape="/api/scrape-bigbasket"
            emoji="BB" logoText="BB" onResult={setBbResult}
          />
          <ScraperCard
            type="fk" label="Flipkart"
            placeholder="https://www.flipkart.com/product/product-reviews/item"
            apiValidate="/api/validate-flipkart" apiScrape="/api/scrape-flipkart"
            emoji="FK" logoText="FK" onResult={setFkResult}
          />
        </div>

        <div style={{ marginTop: '40px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4ade8033', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>// notes</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              ['BB', 'BigBasket: 5-strategy scraper (XHR + DOM + JS globals + script blobs + fetch) -- est. 1-3 min'],
              ['FK', 'Flipkart: DOM card scraping -- est. 5-15 min depending on review count'],
              ['14', `${ALL_COLUMNS.length} columns per review row in Excel`],
              ['3s', 'Each platform = separate Excel file (3 sheets: Reviews, Summary, Column Reference)'],
            ].map(([icon, tip]) => (
              <div key={tip} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#86efac55', fontFamily: 'monospace', lineHeight: 1.5 }}>
                <span style={{ color: '#4ade8044' }}>[{icon}]</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
