import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#16a34a"];

export default function Dashboard() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("scraped_at", { ascending: false });
      setReviews(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const total   = reviews.length;
  const bbCount = reviews.filter(r => r.platform === "bigbasket").length;
  const fkCount = reviews.filter(r => r.platform === "flipkart").length;
  const avgRating = total
    ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total).toFixed(2)
    : 0;

  const ratingDist = [1,2,3,4,5].map(star => ({
    name: `${star}★`,
    count: reviews.filter(r => Number(r.rating) === star).length
  }));

  const platformData = [
    { name: "BigBasket", value: bbCount },
    { name: "Flipkart",  value: fkCount }
  ];

  const filtered = reviews.filter(r =>
    (r.product_name || r.product_url || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.review_text || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{color:"#4ade80",textAlign:"center",padding:"4rem",fontFamily:"monospace"}}>
      Loading dashboard...
    </div>
  );

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",padding:"2rem",fontFamily:"monospace",color:"#e5e5e5"}}>
      <h1 style={{color:"#4ade80",fontSize:"2rem",marginBottom:"0.5rem"}}>📊 Reviews Dashboard</h1>
      <p style={{color:"#6b7280",marginBottom:"2rem"}}>Supabase मधून live data</p>

      {/* Stats Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"2rem"}}>
        {[
          { label:"Total Reviews", value: total,     color:"#4ade80" },
          { label:"BigBasket",     value: bbCount,   color:"#22c55e" },
          { label:"Flipkart",      value: fkCount,   color:"#f97316" },
          { label:"Avg Rating",    value: avgRating, color:"#eab308" },
        ].map(c => (
          <div key={c.label} style={{background:"#111",border:"1px solid #222",borderRadius:"8px",padding:"1.5rem"}}>
            <div style={{color:"#6b7280",fontSize:"0.75rem",marginBottom:"0.5rem"}}>{c.label}</div>
            <div style={{color:c.color,fontSize:"2rem",fontWeight:"bold"}}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"1rem",marginBottom:"2rem"}}>
        <div style={{background:"#111",border:"1px solid #222",borderRadius:"8px",padding:"1.5rem"}}>
          <h3 style={{color:"#4ade80",marginBottom:"1rem"}}>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingDist}>
              <XAxis dataKey="name" stroke="#6b7280"/>
              <YAxis stroke="#6b7280"/>
              <Tooltip contentStyle={{background:"#111",border:"1px solid #333"}}/>
              <Bar dataKey="count" fill="#4ade80" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#111",border:"1px solid #222",borderRadius:"8px",padding:"1.5rem"}}>
          <h3 style={{color:"#4ade80",marginBottom:"1rem"}}>Platform Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {platformData.map((_, i) => <Cell key={i} fill={["#22c55e","#f97316"][i]}/>)}
              </Pie>
              <Legend/>
              <Tooltip contentStyle={{background:"#111",border:"1px solid #333"}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search + Table */}
      <div style={{background:"#111",border:"1px solid #222",borderRadius:"8px",padding:"1.5rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h3 style={{color:"#4ade80"}}>Recent Reviews</h3>
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:"6px",padding:"0.5rem 1rem",color:"#e5e5e5",outline:"none"}}
          />
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #333"}}>
                {["Platform","Rating","Product","Review","Date"].map(h => (
                  <th key={h} style={{padding:"0.75rem",textAlign:"left",color:"#6b7280"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,50).map((r,i) => (
                <tr key={i} style={{borderBottom:"1px solid #1a1a1a"}}>
                  <td style={{padding:"0.75rem"}}>
                    <span style={{background: r.platform==="bigbasket"?"#14532d":"#431407",color: r.platform==="bigbasket"?"#4ade80":"#f97316",padding:"2px 8px",borderRadius:"4px",fontSize:"0.7rem"}}>
                      {r.platform}
                    </span>
                  </td>
                  <td style={{padding:"0.75rem",color:"#eab308",fontWeight:"bold"}}>{r.rating}★</td>
                  <td style={{padding:"0.75rem",color:"#9ca3af",maxWidth:"150px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.product_name || "-"}</td>
                  <td style={{padding:"0.75rem",maxWidth:"300px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.review_text || r.review_header || "-"}</td>
                  <td style={{padding:"0.75rem",color:"#6b7280"}}>{r.date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{textAlign:"center",color:"#6b7280",padding:"2rem"}}>No reviews found</p>}
        </div>
      </div>
    </div>
  );
}
