import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import data from "../data/supplyChain.json";

gsap.registerPlugin(ScrollTrigger);

const LEVEL_COLORS = {
  eco: "#00FF88",
  moderate: "#FFB347",
  high: "#FF6B6B",
};

const ROUTE_COLORS = {
  sea: "#00aaff",
  air: "#FF6B6B",
  land: "#00FF88",
};

// Build chart data from supplyChain.json
const emissionData = data.suppliers.map((s) => ({
  name: s.city,
  emission: s.emission,
  color: LEVEL_COLORS[s.level],
}));

const routeTypeData = [
  { type: "Sea", count: data.routes.filter((r) => r.type === "sea").length },
  { type: "Air", count: data.routes.filter((r) => r.type === "air").length },
  { type: "Land", count: data.routes.filter((r) => r.type === "land").length },
];

// Custom bar color per supplier
function CustomBar(props) {
  const { x, y, width, height, index } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={emissionData[index].color}
      fillOpacity={0.85}
      rx={3}
    />
  );
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const headerRef = useRef();
  const chart1Ref = useRef();
  const chart2Ref = useRef();
  const tableRef = useRef();

  useEffect(() => {
    // Scroll-triggered reveals
    const els = [chart1Ref.current, chart2Ref.current, tableRef.current];
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <_motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "Segoe UI, sans-serif",
        overflowY: "auto",
        padding: "0 0 80px",
      }}
    >
      {/* Top nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e1e24",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#FF6B6B",
            letterSpacing: 1,
          }}
        >
          ECO SYNC
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "1px solid #2a2a2e",
            borderRadius: 8,
            padding: "7px 16px",
            color: "#aaa",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ← Globe View
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#555",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Supply Chain Intelligence
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            Emissions Analytics
          </h1>
          <p style={{ color: "#555", marginTop: 8, fontSize: 14 }}>
            Real-time overview of supplier emission scores and route
            distribution.
          </p>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            {
              label: "Total Suppliers",
              value: data.suppliers.length,
              color: "#FF6B6B",
            },
            {
              label: "Active Routes",
              value: data.routes.length,
              color: "#00aaff",
            },
            {
              label: "Avg Emission",
              value:
                Math.round(
                  data.suppliers.reduce((a, s) => a + s.emission, 0) /
                    data.suppliers.length,
                ) + "%",
              color: "#FFB347",
            },
          ].map((card) => (
            <_motion.div
              key={card.label}
              whileHover={{ scale: 1.02 }}
              style={{
                background: "#18181c",
                border: `1px solid ${card.color}33`,
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#555",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
            </_motion.div>
          ))}
        </div>

        {/* Emission Bar Chart */}
        <div
          ref={chart1Ref}
          style={{
            background: "#18181c",
            borderRadius: 12,
            padding: "28px 24px",
            marginBottom: 24,
            border: "1px solid #2a2a2e",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Emission Score by Supplier
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>
            CO₂ emission rating out of 100
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={emissionData} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181c",
                  border: "1px solid #2a2a2e",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="emission" shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Type Chart */}
        <div
          ref={chart2Ref}
          style={{
            background: "#18181c",
            borderRadius: 12,
            padding: "28px 24px",
            marginBottom: 24,
            border: "1px solid #2a2a2e",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Routes by Transport Type
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>
            Distribution of sea, air, and land routes
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={routeTypeData} barSize={48}>
              <XAxis
                dataKey="type"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181c",
                  border: "1px solid #2a2a2e",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Table */}
        <div
          ref={tableRef}
          style={{
            background: "#18181c",
            borderRadius: 12,
            padding: "28px 24px",
            border: "1px solid #2a2a2e",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            All Routes
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>
            Full breakdown of active supply routes
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2a2e" }}>
                {["Route", "From", "To", "Type", "Emission Delta"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      color: "#555",
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: 1,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.routes.map((route, i) => {
                const from = data.suppliers.find((s) => s.id === route.from);
                const to = data.suppliers.find((s) => s.id === route.to);
                const delta = to.emission - from.emission;
                const color = ROUTE_COLORS[route.type];
                return (
                  <tr
                    key={route.id}
                    style={{
                      borderBottom: "1px solid #1a1a1f",
                      background: i % 2 === 0 ? "transparent" : "#0d0d0f",
                    }}
                  >
                    <td
                      style={{ padding: "12px", color: "#666", fontSize: 11 }}
                    >
                      {route.id.toUpperCase()}
                    </td>
                    <td style={{ padding: "12px", color: "#ccc" }}>
                      {from.city}
                    </td>
                    <td style={{ padding: "12px", color: "#ccc" }}>
                      {to.city}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          background: `${color}22`,
                          border: `1px solid ${color}44`,
                          borderRadius: 4,
                          padding: "3px 8px",
                          color,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {route.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: delta > 0 ? "#FF6B6B" : "#00FF88",
                        fontWeight: 600,
                      }}
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </_motion.div>
  );
}
