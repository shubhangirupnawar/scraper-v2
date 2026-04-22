import { useState, useRef, useEffect } from 'react'
import Dashboard from './Dashboard'

const PLATFORMS = {
  bb: {
    key: 'bb', label: 'BigBasket', logoText: 'BB',
    primary: '#4ade80', dim: '#22c55e', glow: 'rgba(74,222,128,0.18)',
    text: '#052e16', bg: 'rgba(15,26,15,0.92)', border: 'rgba(74,222,128,0.28)',
    logBorder: 'rgba(74,222,128,0.12)', badge: 'rgba(74,222,128,0.10)',
    badgeBorder: 'rgba(74,222,128,0.3)',
    apiValidate: '/api/validate-bigbasket', apiScrape: '/api/scrape-bigbasket',
    estTime: '~1-3 min',
  },
  fk: {
    key: 'fk', label: 'Flipkart', logoText: 'FK',
    primary: '#fb923c', dim: '#f97316', glow: 'rgba(251,146,60,0.18)',
    text: '#431407', bg: 'rgba(26,15,8,0.92)', border: 'rgba(251,146,60,0.28)',
    logBorder: 'rgba(251,146,60,0.12)', badge: 'rgba(251,146,60,0.10)',
    badgeBorder: 'rgba(251,146,60,0.3)',
    apiValidate: '/api/validate-flipkart', apiScrape: '/api/scrape-flipkart',
    estTime: '~5-15 min',
  },
}

const ALL_COLUMNS = [
  { key: 'review_id', desc: 'Unique ID per review' },
  { key: 'rating', desc: 'Star rating (1-5)' },
  { key: 'review_header', desc: 'Title / headline' },
  { key: 'review_text', desc: 'Full body text' },
  { key: 'review_combine', desc: 'Header + Text merged' },
  { key: 'review_entry', desc: 'Country of review' },
  { key: 'date', desc: 'Review date YYYY-MM-DD' },
  { key: 'product_name', desc: 'Full product name' },
  { key: 'brand', desc: 'Brand name' },
  { key: 'variant_me', desc: 'Pack size / variant' },
  { key: 'sku', desc: 'Platform product ID' },
  { key: 'product_url', desc: 'Direct product link' },
  { key: 'category', desc: 'Product category' },
  { key: 'platform', desc: 'bigbasket / flipkart' },
]

const BB_LOGS = [
  { delay: 0, msg: 'Validating product URL...' },
  { delay: 2000, msg: 'Launching Chromium browser...' },
  { delay: 5000, msg: 'Navigating to BigBasket product page...' },
  { delay: 9000, msg: 'Capturing review API endpoint (XHR intercept)...' },
  { delay: 13000, msg: 'Page 1: fetching via BB internal API...' },
  { delay: 18000, msg: 'Page 2: paginating...' },
  { delay: 24000, msg: 'Continuing through remaining pages...' },
  { delay: 40000, msg: 'Still scraping — BB rate-limits aggressively...' },
  { delay: 65000, msg: 'Retry logic active — 2-4s delay between pages...' },
  { delay: 95000, msg: 'Filtering by date cutoff & finalising...' },
]

const FK_LOGS = [
  { delay: 0, msg: 'Validating Flipkart product URL...' },
  { delay: 2000, msg: 'Launching Chromium browser...' },
  { delay: 5000, msg: 'Visiting Flipkart homepage...' },
  { delay: 8000, msg: 'Fetching product page metadata (name, brand, SKU)...' },
  { delay: 13000, msg: 'Loading review page 1 (sorted: most recent)...' },
  { delay: 18000, msg: 'DOM scraping: extracting review cards...' },
  { delay: 24000, msg: 'Page 2: scrolling & extracting...' },
  { delay: 35000, msg: 'Page 3: parsing dates, ratings, text...' },
  { delay: 50000, msg: 'Continuing — Flipkart has up to 100 pages...' },
  { delay: 75000, msg: 'Still running — applying dedup & date filter...' },
]

function ts() { return new Date().toTimeString().slice(0, 8) }

function detectPlatform(url) {
  if (!url || !url.trim()) return null
  const u = url.trim().toLowerCase()
  if (u.includes('bigbasket.com')) return 'bb'
  if (u.includes('flipkart.com')) return 'fk'
  return null
}

function formatDateForApi(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return d && m && y ? `${d}-${m}-${y}` : dateStr
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [url, setUrl] = useState('')
  const [untilDate, setUntilDate] = useState('')
  const [status, setStatus] = useState('idle')
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [showCols, setShowCols] = useState(false)
  const [focused, setFocused] = useState(false)
  const logRef = useRef(null)
  const timerRefs = useRef([])

  const platform = detectPlatform(url)
  const p = platform ? PLATFORMS[platform] : null
  const isRunning = status === 'validating' || status === 'scraping'

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  function addLog(msg) {
    setLogs(prev => [...prev, { time: ts(), msg }])
  }

  function clearTimers() {
    timerRefs.current.forEach(t => clearTimeout(t))
    timerRefs.current = []
  }

  function scheduleLog(seq) {
    clearTimers()
    seq.forEach(({ delay, msg }) => {
      const t = setTimeout(() => addLog(msg), delay)
      timerRefs.current.push(t)
    })
  }

  async function handleScrape() {
    if (!url.trim() || !p) return
    setError(''); setResult(null); setLogs([]); setStatus('validating')
    scheduleLog(platform === 'bb' ? BB_LOGS : FK_LOGS)

    const apiDate = formatDateForApi(untilDate)

    try {
      const vRes = await fetch(p.apiValidate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: apiDate }),
      })
      if (!vRes.ok) {
        const e = await vRes.json()
        throw new Error(e.detail || 'Invalid URL')
      }
      const info = await vRes.json()
      if (info.sku) addLog(`SKU: ${info.sku}`)
      if (info.slug) addLog(`Slug: ${info.slug}`)
      if (info.item) addLog(`Item ID: ${info.item}`)

      setStatus('scraping')

      const sRes = await fetch(p.apiScrape, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), until_date: apiDate }),
      })
      clearTimers()

      if (!sRes.ok) {
        const e = await sRes.json()
        throw new Error(e.detail || 'Scraping failed')
      }

      const blob = await sRes.blob()
      const cd = sRes.headers.get('content-disposition') || ''
      const fnm = cd.match(/filename="([^"]+)"/)
      const filename = fnm ? fnm[1] : 'reviews.xlsx'
      const cm = filename.match(/_(\d+)_reviews/)
      const count = cm ? parseInt(cm[1]) : null

      addLog(`Done! ${count ?? '?'} reviews collected.`)
      addLog(`Saved to Supabase + Excel ready: ${filename}`)

      const dlUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = dlUrl; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(dlUrl), 1000)

      setResult({ blob, filename, count })
      setStatus('done')

    } catch (e) {
      clearTimers()
      setError(e.message)
      setStatus('error')
      addLog(`Error: ${e.message}`)
    }
  }

  function handleDownload() {
    if (!result) return
    const dlUrl = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = dlUrl; a.download = result.filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(dlUrl), 1000)
  }

  const statusColor = {
    idle: '#4ade80', validating: '#facc15', scraping: '#facc15',
    done: p?.primary || '#4ade80', error: '#f87171'
  }[status]
  const statusLabel = {
    idle: 'READY', validating: 'VALIDATING', scraping: 'SCRAPING...',
    done: 'COMPLETE', error: 'ERROR'
  }[status]

  const cardBorder = p ? p.border : 'rgba(74,222,128,0.2)'
  const cardGlow = p ? p.glow : 'rgba(74,222,128,0.06)'

  if (showDashboard) return (
    <div>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '12px 24px' }}>
        <button onClick={() => setShowDashboard(false)} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#4ade80', cursor: 'pointer' }}>
          ← Back to Scraper
        </button>
      </div>
      <Dashboard />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #050c05 0%, #080c08 50%, #0a0e0a 100%)',
      padding: '40px 16px 80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.2} }
        @keyframes fadeIn{ from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.3); border-radius: 4px; }
        input[type="date"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(3) hue-rotate(80deg); cursor: pointer; }
      `}</style>

      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', margin: '0 auto' }}>

        {/* Top badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <button onClick={() => setShowDashboard(true)} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#4ade80', cursor: 'pointer' }}>
              📊 View Dashboard
            </button>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px', fontSize: '11px', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '0.1em' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'blink 1.4s ease infinite' }} />
            PLAYWRIGHT · FASTAPI · REACT
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            <span style={{ color: '#f0fdf4' }}>Review </span>
            <span style={{ background: 'linear-gradient(135deg,#4ade80,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scraper</span>
          </h1>
          <p style={{ color: '#86efac', fontSize: '14px', opacity: 0.8, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Paste any BigBasket or Flipkart link — platform auto-detected · {ALL_COLUMNS.length} columns · Excel export
          </p>
        </div>

        {/* Main Card */}
        <div style={{ background: 'rgba(10,18,10,0.92)', border: `1px solid ${cardBorder}`, borderRadius: '24px', padding: '32px', backdropFilter: 'blur(24px)', boxShadow: `0 0 40px ${cardGlow}`, transition: 'border-color 0.3s,box-shadow 0.3s' }}>

          {/* Card header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#4ade80', opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              // SCRAPER CONFIG
            </div>
            <button onClick={() => setShowCols(v => !v)} style={{ cursor: 'pointer', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontFamily: 'monospace', color: '#4ade80', outline: 'none' }}>
              {ALL_COLUMNS.length} cols {showCols ? '▲' : '▼'}
            </button>
          </div>

          {/* Columns */}
          {showCols && (
            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px' }}>
              {ALL_COLUMNS.map((col, i) => (
                <div key={col.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${p?.badgeBorder || 'rgba(74,222,128,0.2)'}`, borderRadius: '6px', padding: '5px 8px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: p?.primary || '#4ade80', opacity: 0.4, minWidth: '16px', marginTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#f0fdf4' }}>{col.key}</div>
                    <div style={{ fontSize: '9px', color: p?.primary || '#4ade80', opacity: 0.55, fontFamily: 'monospace' }}>{col.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* URL label */}
          <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: p?.primary || '#4ade80', marginBottom: '8px', textTransform: 'uppercase' }}>
            PRODUCT URL <span style={{ opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>— paste BigBasket or Flipkart link</span>
          </label>

          {/* URL input */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>
              {platform === 'bb' ? '🛒' : platform === 'fk' ? '🏪' : '⏳'}
            </span>
            <input
              type="text"
              placeholder="https://www.bigbasket.com/...  or  https://www.flipkart.com/..."
              value={url}
              onChange={e => { setUrl(e.target.value); setError('') }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === 'Enter' && !isRunning && p && handleScrape()}
              disabled={isRunning}
              spellCheck={false}
              style={{ width: '100%', background: focused ? (p?.glow || 'rgba(74,222,128,0.06)') : 'rgba(255,255,255,0.04)', border: `1.5px solid ${focused ? (p?.primary || '#4ade80') : (p?.border || 'rgba(74,222,128,0.25)')}`, borderRadius: '12px', padding: '14px 14px 14px 44px', fontSize: '12px', fontFamily: 'monospace', color: '#f0fdf4', outline: 'none', transition: 'all 0.25s', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'text' }}
            />
          </div>

          {/* Platform badge */}
          {p && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: p.badge, border: `1px solid ${p.badgeBorder}`, borderRadius: '8px', padding: '8px 14px', marginBottom: '14px', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ background: p.glow, border: `1px solid ${p.badgeBorder}`, borderRadius: '6px', padding: '3px 8px', fontWeight: 800, fontSize: '13px', color: p.primary }}>{p.logoText}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: p.primary }}>{p.label} detected ✓</div>
                <div style={{ fontSize: '10px', color: p.primary, fontFamily: 'monospace', opacity: 0.7 }}>🖥️ Ready to scrape · Est. {p.estTime}</div>
              </div>
            </div>
          )}

          {/* Date label */}
          <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', color: p?.primary || '#4ade80', marginBottom: '8px', textTransform: 'uppercase' }}>
            SCRAPE UNTIL DATE <span style={{ opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>(optional — leave blank for all reviews)</span>
          </label>
          <input
            type="date"
            value={untilDate}
            onChange={e => setUntilDate(e.target.value)}
            disabled={isRunning}
            max={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${p?.border || 'rgba(74,222,128,0.25)'}`, borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: untilDate ? '#f0fdf4' : '#4ade8055', outline: 'none', marginBottom: '24px', opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'pointer' }}
          />

          {/* Scrape button */}
          <button
            onClick={handleScrape}
            disabled={isRunning || !p}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: (isRunning || !p) ? 'not-allowed' : 'pointer', background: p ? `linear-gradient(135deg,${p.primary},${p.dim})` : 'rgba(74,222,128,0.12)', color: p ? p.text : '#4ade8055', fontWeight: 700, fontSize: '14px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', opacity: isRunning ? 0.7 : 1 }}
          >
            {isRunning
              ? (<><div style={{ width: '16px', height: '16px', border: `2px solid ${p?.text || '#052e16'}44`, borderTopColor: p?.text || '#052e16', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />{status === 'validating' ? 'Validating...' : 'Scraping...'}</>)
              : p
                ? `${p.logoText} Scrape All ${p.label} Reviews`
                : '⏳ Paste a BigBasket or Flipkart URL to begin'
            }
          </button>

          {/* Download button */}
          {status === 'done' && result && (
            <button
              onClick={handleDownload}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '10px', background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', color: '#fff', fontWeight: 700, fontSize: '14px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
            >
              📥 Download Excel ({result.count ?? '?'} reviews — {ALL_COLUMNS.length} cols)
            </button>
          )}

          {/* Progress / logs */}
          {logs.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, flexShrink: 0, animation: isRunning ? 'blink 1.2s ease infinite' : 'none' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: statusColor, letterSpacing: '0.1em' }}>{statusLabel}</span>
                {isRunning && p && <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: p.primary, opacity: 0.5 }}>est. {p.estTime}</span>}
              </div>
              <div ref={logRef} style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${p?.logBorder || 'rgba(74,222,128,0.12)'}`, borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.8, maxHeight: '200px', overflowY: 'auto' }}>
                {logs.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#4ade8044', flexShrink: 0 }}>[{l.time}]</span>
                    <span style={{ color: platform === 'fk' ? '#fed7aa' : '#86efac' }}>{l.msg}</span>
                  </div>
                ))}
                {isRunning && <div style={{ color: '#4ade8066' }}>▌</div>}
              </div>
            </div>
          )}

          {/* Done summary */}
          {status === 'done' && result && (
            <div style={{ marginTop: '14px', background: p?.badge || 'rgba(74,222,128,0.1)', border: `1px solid ${p?.badgeBorder || 'rgba(74,222,128,0.3)'}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
                {[['Reviews', result.count ?? '?'], ['Columns', ALL_COLUMNS.length], ['Format', 'XLSX']].map(([k, v]) => (
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
            </div>
          )}

        </div>

        {/* Footer notes */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            ['BB', 'BigBasket: 5-strategy scraper (XHR + DOM + JS globals + script blobs + fetch) — est. 1-3 min'],
            ['FK', 'Flipkart: DOM card scraping — est. 5-15 min depending on review count'],
            ['14', `${ALL_COLUMNS.length} columns per review row in Excel`],
            ['💾', 'Each platform = separate Excel file (3 sheets: Reviews, Summary, Column Reference)'],
          ].map(([icon, tip]) => (
            <div key={tip} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#86efac55', fontFamily: 'monospace', lineHeight: 1.5 }}>
              <span style={{ color: '#4ade8044' }}>[{icon}]</span><span>{tip}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}