import { useState, useRef, useEffect } from 'react'

<<<<<<< HEAD
const PLATFORMS = {
  bb: {
    key: 'bb',
    label: 'BigBasket',
    logoText: 'BB',
    primary: '#4ade80', dim: '#22c55e', glow: 'rgba(74,222,128,0.18)',
    text: '#052e16', bg: 'rgba(15,26,15,0.92)', border: 'rgba(74,222,128,0.28)',
    logBorder: 'rgba(74,222,128,0.12)', badge: 'rgba(74,222,128,0.10)',
    badgeBorder: 'rgba(74,222,128,0.3)',
    domain: 'bigbasket.com',
    placeholder: 'https://www.bigbasket.com/pd/126906/aashirvaad-atta-whole-wheat',
    apiValidate: '/api/validate-bigbasket',
    apiScrape: '/api/scrape-bigbasket',
    emoji: '🛒',
    estTime: '~1-3 min',
  },
  fk: {
    key: 'fk',
    label: 'Flipkart',
    logoText: 'FK',
    primary: '#fb923c', dim: '#f97316', glow: 'rgba(251,146,60,0.18)',
    text: '#431407', bg: 'rgba(26,15,8,0.92)', border: 'rgba(251,146,60,0.28)',
    logBorder: 'rgba(251,146,60,0.12)', badge: 'rgba(251,146,60,0.10)',
    badgeBorder: 'rgba(251,146,60,0.3)',
    domain: 'flipkart.com',
    placeholder: 'https://www.flipkart.com/product/product-reviews/item',
    apiValidate: '/api/validate-flipkart',
    apiScrape: '/api/scrape-flipkart',
    emoji: '🏪',
    estTime: '~5-15 min',
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
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
<<<<<<< HEAD
  { delay: 0,      msg: 'Validating product URL...' },
  { delay: 1500,   msg: 'Establishing HTTP session with BigBasket...' },
  { delay: 3000,   msg: 'Fetching product page for metadata (name, brand, SKU)...' },
  { delay: 5500,   msg: 'Strategy 1: Direct HTTP API call to BB review endpoints...' },
  { delay: 8000,   msg: 'Page 1: Fetching reviews via BB internal API...' },
  { delay: 11000,  msg: 'Page 2: Trying multiple API patterns (v1/v2/catalog)...' },
  { delay: 14000,  msg: 'Page 3: collecting & deduplicating results...' },
  { delay: 18000,  msg: 'Continuing through remaining pages...' },
  { delay: 28000,  msg: 'Still scraping — 1-3s delay between pages...' },
  { delay: 45000,  msg: 'If HTTP fails, launching Playwright browser as fallback...' },
  { delay: 65000,  msg: 'Playwright fallback: JS globals + XHR intercept + fetch...' },
  { delay: 90000,  msg: 'Filtering by date cutoff (if set) & finalising...' },
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
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

<<<<<<< HEAD
function detectPlatform(url) {
  if (!url || !url.trim()) return null
  const u = url.trim().toLowerCase()
  if (u.includes('bigbasket.com')) return 'bb'
  if (u.includes('flipkart.com')) return 'fk'
  if (u.startsWith('http') || u.startsWith('www.') || u.includes('.com') || u.includes('.in') || u.includes('.net') || u.includes('.org')) {
    return 'invalid'
  }
  return null
}

function PlatformBadge({ platform }) {
  if (!platform) return null
  if (platform === 'invalid') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.35)', borderRadius: '8px', padding: '8px 14px', marginBottom: '14px', animation: 'fadeIn 0.2s ease' }}>
        <span style={{ fontSize: '16px' }}>⚠️</span>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>Invalid Input</div>
          <div style={{ fontSize: '10px', color: '#fca5a5', fontFamily: 'monospace', opacity: 0.85 }}>Only BigBasket & Flipkart links are supported</div>
        </div>
      </div>
    )
  }
  const p = PLATFORMS[platform]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: p.badge, border: `1px solid ${p.badgeBorder}`, borderRadius: '8px', padding: '8px 14px', marginBottom: '14px', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ background: p.glow, border: `1px solid ${p.badgeBorder}`, borderRadius: '6px', padding: '3px 8px', fontWeight: 800, fontSize: '13px', color: p.primary }}>{p.logoText}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: p.primary }}>{p.label} detected ✓</div>
        <div style={{ fontSize: '10px', color: p.primary, fontFamily: 'monospace', opacity: 0.7 }}>{p.emoji} Ready to scrape · Est. {p.estTime}</div>
      </div>
    </div>
  )
}

function ColumnGrid() {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.8 }}>Excel Columns ({ALL_COLUMNS.length} total)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
        {ALL_COLUMNS.map((col, i) => (
          <div key={col.key} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '6px', padding: '5px 8px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#4ade80', opacity: 0.4, minWidth: '16px', marginTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f0fdf4' }}>{col.key}</div>
              <div style={{ fontSize: '9px', color: '#4ade80', opacity: 0.55, fontFamily: 'monospace' }}>{col.desc}</div>
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default function App() {
  const [url, setUrl] = useState('')
  const [untilDate, setUntilDate] = useState('')
  const [focused, setFocused] = useState(false)
  const [dateFocused, setDateFocused] = useState(false)
=======
function ScraperCard({ type, label, placeholder, apiValidate, apiScrape, emoji, logoText, onResult }) {
  const c = C[type]
  const isBB = type === 'bb'
  const [url, setUrl] = useState('')
  const [untilDate, setUntilDate] = useState('')
  const [focused, setFocused] = useState(false)
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
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
<<<<<<< HEAD

  const detectedPlatform = detectPlatform(url)
  const p = detectedPlatform && detectedPlatform !== 'invalid' ? PLATFORMS[detectedPlatform] : null
  const isRunning = status === 'validating' || status === 'scraping'
  const canScrape = !!p

  const addLog = (msg) => setLogs(prev => [...prev, { time: ts(), msg }])
=======
  const isRunning = status === 'validating' || status === 'scraping'

  const addLog = (msg) => setLogs(p => [...p, { time: ts(), msg }])
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1

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

<<<<<<< HEAD
  function formatDateForApi(dateStr) {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}-${m}-${y}`
  }

  async function handleScrape() {
    if (!url.trim()) { setError('Please enter a URL.'); return }
    if (!canScrape) { setError('Invalid URL. Only BigBasket and Flipkart links are supported.'); return }

    setError(''); setResult(null); setLogs([]); setProgress(0); setStatus('validating')
    scheduleLogSequence(detectedPlatform === 'bb' ? BB_LOG_SEQUENCE : FK_LOG_SEQUENCE)

    const progressTick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 88) { clearInterval(progressTick); return 88 }
        const inc = prev < 20 ? 3 : prev < 50 ? 1.5 : prev < 75 ? 0.6 : 0.2
        return Math.min(prev + inc * (0.5 + Math.random()), 88)
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
      })
    }, 1800)
    timerRefs.current.push(progressTick)

<<<<<<< HEAD
    const apiDate = formatDateForApi(untilDate)

    try {
      const vRes = await fetch(p.apiValidate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: apiDate })
      })
      if (!vRes.ok) {
        let errMsg = `Server error (${vRes.status})`
        try {
          const text = await vRes.text()
          if (text) {
            const e = JSON.parse(text)
            errMsg = e.detail || e.message || errMsg
          }
        } catch (_) {}
        throw new Error(errMsg)
=======
    try {
      const vRes = await fetch(apiValidate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: untilDate.trim() })
      })
      if (!vRes.ok) {
        const e = await vRes.json()
        throw new Error(e.detail || 'Invalid URL')
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
      }
      const info = await vRes.json()
      if (info.sku)  addLog(`  SKU: ${info.sku}`)
      if (info.slug) addLog(`  Slug: ${info.slug}`)
      if (info.item) addLog(`  Item ID: ${info.item}`)
<<<<<<< HEAD
      setStatus('scraping')

      const sRes = await fetch(p.apiScrape, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: apiDate })
      })
      clearTimers(); clearInterval(progressTick)
      if (!sRes.ok) {
        let errMsg = `Scraping failed (${sRes.status})`
        try {
          const text = await sRes.text()
          if (text) {
            const e = JSON.parse(text)
            errMsg = e.detail || e.message || errMsg
          }
        } catch (_) {}
        throw new Error(errMsg)
      }
=======

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

>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
      setProgress(100)
      const blob = await sRes.blob()
      const cd = sRes.headers.get('content-disposition') || ''
      const fnm = cd.match(/filename="([^"]+)"/)
      const filename = fnm ? fnm[1] : 'reviews.xlsx'
      const cm = filename.match(/_(\d+)_reviews/)
      const count = cm ? parseInt(cm[1]) : null
<<<<<<< HEAD
      addLog(`Done! ${count ?? '?'} reviews collected.`)
      addLog(`Excel ready: ${filename}`)
      addLog(`All ${ALL_COLUMNS.length} columns populated.`)
      setResult({ blob, filename, count })
      setStatus('done')
    } catch (e) {
      clearTimers(); clearInterval(progressTick)
      let msg = e.message
      if (msg.includes('No reviews found') && detectedPlatform === 'bb') {
        msg = 'No reviews found. BigBasket may have blocked the scraper or this product has no reviews. Try again.'
=======

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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
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

<<<<<<< HEAD
  const statusColor = { idle: '#4ade80', validating: '#facc15', scraping: '#facc15', done: p?.primary || '#4ade80', error: '#f87171' }[status]
  const statusText  = { idle: 'READY', validating: 'VALIDATING', scraping: 'SCRAPING...', done: 'COMPLETE', error: 'ERROR' }[status]

  const cardBorder = p ? p.border : detectedPlatform === 'invalid' ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.2)'
  const cardGlow   = p ? p.glow   : detectedPlatform === 'invalid' ? 'rgba(248,113,113,0.06)' : 'rgba(74,222,128,0.06)'
  const urlBorder  = detectedPlatform === 'invalid' ? 'rgba(248,113,113,0.7)' : focused ? (p?.primary || '#4ade80') : (p?.border || 'rgba(74,222,128,0.25)')
  const dateBorder = dateFocused ? (p?.primary || '#4ade80') : (p?.border || 'rgba(74,222,128,0.25)')
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #050c05 0%, #080c08 50%, #0a0e0a 100%)', padding: '40px 16px 80px', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
<<<<<<< HEAD
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes blink  { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake  { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.3); border-radius: 4px; }
        input[type="date"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.65) sepia(1) saturate(3) hue-rotate(90deg); cursor: pointer; opacity: 0.8; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
=======
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.3); border-radius: 4px; }
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />

<<<<<<< HEAD
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
=======
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px', fontSize: '11px', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '0.1em' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'blink 1.4s ease infinite' }} />
            PLAYWRIGHT · FASTAPI · REACT
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
<<<<<<< HEAD
            <span style={{ color: '#f0fdf4' }}>Review </span>
            <span style={{ background: 'linear-gradient(135deg, #4ade80, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scraper</span>
          </h1>
          <p style={{ color: '#86efac', fontSize: '14px', opacity: 0.8, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Paste any BigBasket or Flipkart link — platform auto-detected · {ALL_COLUMNS.length} columns · Excel export
          </p>
        </div>

        {/* Main Card */}
        <div style={{ background: 'rgba(10,18,10,0.92)', border: `1px solid ${cardBorder}`, borderRadius: '24px', padding: '36px', backdropFilter: 'blur(24px)', transition: 'border-color 0.3s, box-shadow 0.3s', boxShadow: `0 0 40px ${cardGlow}` }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#4ade80', opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>// scraper config</div>
            <button onClick={() => setShowCols(v => !v)} style={{ cursor: 'pointer', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontFamily: 'monospace', color: '#4ade80', outline: 'none' }}>
              {ALL_COLUMNS.length} cols {showCols ? '▲' : '▼'}
            </button>
          </div>

          {showCols && <ColumnGrid />}

          {/* URL Input */}
          <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: p?.primary || '#4ade80', marginBottom: '8px', textTransform: 'uppercase' }}>
            Product URL
            <span style={{ opacity: 0.5, marginLeft: '8px', textTransform: 'none', letterSpacing: 0 }}>— paste BigBasket or Flipkart link</span>
          </label>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', transition: 'all 0.2s', pointerEvents: 'none' }}>
              {detectedPlatform === 'bb' ? '🛒' : detectedPlatform === 'fk' ? '🏪' : detectedPlatform === 'invalid' ? '⚠️' : '🔗'}
            </span>
            <input
              type="url"
              placeholder="https://www.bigbasket.com/...  or  https://www.flipkart.com/..."
              value={url}
              onChange={e => { setUrl(e.target.value); setError('') }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === 'Enter' && !isRunning && canScrape && handleScrape()}
              disabled={isRunning}
              style={{ width: '100%', background: focused ? (p?.glow || 'rgba(74,222,128,0.06)') : 'rgba(255,255,255,0.04)', border: `1.5px solid ${urlBorder}`, borderRadius: '12px', padding: '14px 14px 14px 44px', fontSize: '12px', fontFamily: 'monospace', color: '#f0fdf4', outline: 'none', transition: 'all 0.25s', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'text', animation: detectedPlatform === 'invalid' ? 'shake 0.35s ease' : 'none' }}
              spellCheck={false}
            />
          </div>

          {/* Platform Detection Badge */}
          <PlatformBadge platform={detectedPlatform} />

          {/* Date Input — Calendar */}
          <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: p?.primary || '#4ade80', marginBottom: '8px', textTransform: 'uppercase' }}>
            Scrape Until Date
            <span style={{ opacity: 0.5, marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>(optional — leave blank for all reviews)</span>
          </label>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              type="date"
              value={untilDate}
              onChange={e => setUntilDate(e.target.value)}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              disabled={isRunning}
              max={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', background: dateFocused ? (p?.glow || 'rgba(74,222,128,0.06)') : 'rgba(255,255,255,0.04)', border: `1.5px solid ${dateBorder}`, borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: untilDate ? '#f0fdf4' : '#4ade8055', outline: 'none', transition: 'all 0.25s', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'pointer' }}
            />
            {untilDate && !isRunning && (
              <button onClick={() => setUntilDate('')} style={{ position: 'absolute', right: '44px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4ade8088', fontSize: '14px', padding: '0 4px', lineHeight: 1 }} title="Clear date">✕</button>
            )}
          </div>

          {/* Scrape Button */}
          <button
            onClick={handleScrape}
            disabled={isRunning || !canScrape}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: (isRunning || !canScrape) ? 'not-allowed' : 'pointer', background: canScrape ? `linear-gradient(135deg, ${p.primary}, ${p.dim})` : 'rgba(74,222,128,0.12)', color: canScrape ? p.text : '#4ade8055', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', opacity: isRunning ? 0.7 : 1, transform: (btnHover && !isRunning && canScrape) ? 'translateY(-2px)' : 'none', boxShadow: (btnHover && !isRunning && canScrape) ? `0 8px 28px ${p.glow}` : canScrape ? `0 4px 16px ${p.glow}` : 'none' }}
          >
            {isRunning
              ? (<><div style={{ width: '16px', height: '16px', border: `2px solid ${p.text}44`, borderTopColor: p.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />{status === 'validating' ? 'Validating...' : `Scraping ${p.label} Reviews...`}</>)
              : canScrape
                ? <>{p.emoji} Scrape All {p.label} Reviews</>
                : <>🔗 Paste a BigBasket or Flipkart URL to begin</>
            }
          </button>

          {/* Download Button */}
          {status === 'done' && result && (
            <button onClick={handleDownload} onMouseEnter={() => setDlHover(true)} onMouseLeave={() => setDlHover(false)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '10px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: '#fff', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', transform: dlHover ? 'translateY(-2px)' : 'none', boxShadow: dlHover ? '0 8px 24px rgba(96,165,250,0.3)' : '0 4px 16px rgba(96,165,250,0.15)' }}>
              📥 Download Excel ({result.count ?? '?'} reviews — {ALL_COLUMNS.length} cols)
            </button>
          )}

          {/* Progress Bar */}
          {(isRunning || status === 'done') && progress > 0 && (
            <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '100px', background: p ? `linear-gradient(90deg, ${p.dim}, ${p.primary})` : 'linear-gradient(90deg, #22c55e, #4ade80)', width: `${Math.min(progress, 100)}%`, transition: 'width 0.8s ease' }} />
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, flexShrink: 0, animation: isRunning ? 'blink 1.2s ease infinite' : 'none' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: statusColor, letterSpacing: '0.1em' }}>{statusText}</span>
                {isRunning && p && <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: p.primary, opacity: 0.5 }}>est. {p.estTime}</span>}
              </div>
              <div ref={logRef} style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${p?.logBorder || 'rgba(74,222,128,0.12)'}`, borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.8, maxHeight: '200px', overflowY: 'auto' }}>
                {logs.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#4ade8044', flexShrink: 0 }}>[{l.time}]</span>
                    <span style={{ color: detectedPlatform === 'fk' ? '#fed7aa' : '#86efac' }}>{l.msg}</span>
                  </div>
                ))}
                {isRunning && <div style={{ color: '#4ade8066' }}>|</div>}
              </div>
            </div>
          )}

          {/* Done summary */}
          {status === 'done' && result && (
            <div style={{ marginTop: '14px', background: p?.badge || 'rgba(74,222,128,0.1)', border: `1px solid ${p?.badgeBorder || 'rgba(74,222,128,0.3)'}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                {[['Total Reviews', result.count ?? '?'], ['Columns', ALL_COLUMNS.length], ['Format', 'XLSX']].map(([k, v]) => (
                  <div key={k} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '10px 6px' }}>
                    <div style={{ fontWeight: 800, fontSize: '20px', color: p?.primary || '#4ade80' }}>{v}</div>
                    <div style={{ fontSize: '9px', color: p?.primary || '#4ade80', opacity: 0.6, fontFamily: 'monospace', textTransform: 'uppercase' }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {ALL_COLUMNS.map(col => (
                  <span key={col.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${p?.badgeBorder || 'rgba(74,222,128,0.3)'}`, borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontFamily: 'monospace', color: p?.primary || '#4ade80' }}>{col.key}</span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop: '12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px', animation: 'fadeIn 0.2s ease' }}>
              <span>⚠️</span>
              <span style={{ color: '#fca5a5', fontSize: '12px', fontFamily: 'monospace', lineHeight: 1.5 }}>{error}</span>
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Footer */}
        <div style={{ marginTop: '32px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4ade8033', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>// notes</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              ['BB', 'BigBasket: 5-strategy scraper (XHR + DOM + JS globals + script blobs + fetch) — est. 1-3 min'],
              ['FK', 'Flipkart: DOM card scraping — est. 5-15 min depending on review count'],
              ['14', `${ALL_COLUMNS.length} columns per review row in Excel`],
              ['↓', 'Each platform = separate Excel file (3 sheets: Reviews, Summary, Column Reference)'],
=======
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
>>>>>>> edcd8ed0d25568696c37f2629d238309eb2caab1
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
