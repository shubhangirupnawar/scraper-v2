import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => { fetchReviews(); }, [page, platform, ratingFilter, search]);

  async function fetchReviews() {
    setLoading(true);
    let query = supabase.from("reviews").select("*", { count: "exact" })
      .order("date", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (platform !== "all") query = query.eq("platform", platform);
    if (ratingFilter !== "all") query = query.eq("rating", parseInt(ratingFilter));
    if (search) query = query.ilike("review_text", `%${search}%`);
    const { data, count, error } = await query;
    if (!error) { setReviews(data || []); setTotal(count || 0); }
    setLoading(false);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const avgRating = reviews.filter(r => r.rating).length
    ? (reviews.reduce((s, r) => s + (parseFloat(r.rating) || 0), 0) / reviews.filter(r => r.rating).length).toFixed(1)
    : "0";
  const starColor = (r) => r >= 4 ? "#4ade80" : r >= 3 ? "#facc15" : "#f87171";

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#e5e5e5", fontFamily:"monospace", padding:"24px" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"#4ade80", margin:0 }}>📊 Reviews Dashboard</h1>
        <p style={{ color:"#666", margin:"4px 0 0" }}>Supabase · Live Data · {total} reviews</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[["TOTAL REVIEWS", total], ["AVG RATING", avgRating], ["PLATFORMS", "BB + FK"]].map(([label, value]) => (
          <div key={label} style={{ background:"#111", border:"1px solid #222", borderRadius:8, padding:"16px 20px" }}>
            <div style={{ fontSize:11, color:"#666", marginBottom:6 }}>{label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:"#4ade80" }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <input placeholder="Search reviews..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex:1, minWidth:200, background:"#111", border:"1px solid #333", borderRadius:6, padding:"8px 12px", color:"#e5e5e5", fontSize:13 }} />
        <select value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
          style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"8px 12px", color:"#e5e5e5" }}>
          <option value="all">All Platforms</option>
          <option value="bigbasket">BigBasket</option>
          <option value="flipkart">Flipkart</option>
        </select>
        <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"8px 12px", color:"#e5e5e5" }}>
          <option value="all">All Ratings</option>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star</option>)}
        </select>
      </div>
      <div style={{ background:"#111", border:"1px solid #222", borderRadius:8, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#1a1a1a", borderBottom:"1px solid #222" }}>
              {["Rating","Header","Review","Product","Date","Platform"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", color:"#666", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:40, color:"#666" }}>Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:40, color:"#666" }}>No reviews found</td></tr>
            ) : reviews.map((r, i) => (
              <tr key={r.id || i} style={{ borderBottom:"1px solid #1a1a1a", background: i%2===0 ? "#111" : "#0f0f0f" }}>
                <td style={{ padding:"10px 16px" }}>
                  <span style={{ color:starColor(r.rating), fontWeight:700, fontSize:15 }}>{r.rating || "—"}</span>
                </td>
                <td style={{ padding:"10px 16px", maxWidth:150, color:"#ccc" }}>{(r.review_header||"").slice(0,40)||"—"}</td>
                <td style={{ padding:"10px 16px", maxWidth:300, color:"#aaa", lineHeight:1.4 }}>
                  {(r.review_text||"").slice(0,100)}{(r.review_text||"").length>100?"...":""}
                </td>
                <td style={{ padding:"10px 16px", color:"#888" }}>{(r.product_name||"").slice(0,25)||"—"}</td>
                <td style={{ padding:"10px 16px", color:"#666", whiteSpace:"nowrap" }}>{r.date?r.date.slice(0,10):"—"}</td>
                <td style={{ padding:"10px 16px" }}>
                  <span style={{ background:r.platform==="bigbasket"?"#14532d":"#3b0764", color:r.platform==="bigbasket"?"#4ade80":"#a78bfa", borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                    {r.platform==="bigbasket"?"BB":"FK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20, alignItems:"center" }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"6px 16px", color:"#e5e5e5", cursor:"pointer" }}>← Prev</button>
          <span style={{ color:"#666", fontSize:13 }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ background:"#111", border:"1px solid #333", borderRadius:6, padding:"6px 16px", color:"#e5e5e5", cursor:"pointer" }}>Next →</button>
        </div>
      )}
    </div>
  );
}