import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
} from "recharts";
import data from "../data/supplyChain.json";

gsap.registerPlugin(ScrollTrigger);

const suppliersWithKpi = data.suppliers.filter((s) => s.kpi);

const avgKpi = {
  perfectOrderRate: (
    (suppliersWithKpi.reduce((a, s) => a + s.kpi.perfectOrderRate, 0) /
      suppliersWithKpi.length) *
    100
  ).toFixed(1),
  cashToCashDays: Math.round(
    suppliersWithKpi.reduce((a, s) => a + s.kpi.cashToCachDays, 0) /
      suppliersWithKpi.length,
  ),
  inventoryTurnover: (
    suppliersWithKpi.reduce((a, s) => a + s.kpi.inventoryTurnover, 0) /
    suppliersWithKpi.length
  ).toFixed(1),
};

const radarData = suppliersWithKpi.map((s) => ({
  supplier: s.city,
  "Order Rate": Math.round(s.kpi.perfectOrderRate * 100),
  "Inv. Turn": Math.round(s.kpi.inventoryTurnover * 10),
  "C2C Speed": Math.round(100 - s.kpi.cashToCachDays),
}));

const scatterData = suppliersWithKpi.map((s) => ({
  name: s.name,
  x: s.kpi.cashToCachDays,
  y: Math.round(s.kpi.perfectOrderRate * 100),
  z: s.kpi.inventoryTurnover * 10,
  emission: s.emission,
}));

export default function FinancePage() {
  const navigate = useNavigate();
  const cardsRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      ".finance-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%" },
      },
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <_motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "Segoe UI, sans-serif",
        overflowY: "auto",
        paddingBottom: 80,
      }}
    >
      {/* Nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e1e24",
          padding: "16px clamp(20px, 4vw, 40px)",
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
          ECO SYNC — Finance View
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "1px solid #2a2a2e",
              borderRadius: 8,
              padding: "7px 14px",
              color: "#aaa",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ← Globe
          </button>
          <button
            onClick={() => navigate("/analytics")}
            style={{
              background: "none",
              border: "1px solid #2a2a2e",
              borderRadius: 8,
              padding: "7px 14px",
              color: "#aaa",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Analytics
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(24px,4vw,48px) clamp(16px,4vw,32px)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#555",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Financial Intelligence Layer
          </div>
          <h1
            style={{
              fontSize: "clamp(22px,4vw,32px)",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Supply Chain KPI Dashboard
          </h1>
          <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>
            Perfect Order Rate · Cash-to-Cash Cycle · Inventory Velocity
          </p>
        </div>

        {/* KPI Headline Cards */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Avg Perfect Order Rate",
              value: `${avgKpi.perfectOrderRate}%`,
              color: "#00FF88",
              desc: "Orders delivered perfect",
            },
            {
              label: "Avg Cash-to-Cash",
              value: `${avgKpi.cashToCashDays}d`,
              color: "#FFB347",
              desc: "Working capital cycle",
            },
            {
              label: "Avg Inventory Turns",
              value: avgKpi.inventoryTurnover,
              color: "#00aaff",
              desc: "Annual inventory cycles",
            },
            {
              label: "Suppliers Tracked",
              value: suppliersWithKpi.length,
              color: "#FF6B6B",
              desc: "With full KPI telemetry",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="finance-card"
              style={{
                background: "#18181c",
                border: `1px solid ${card.color}33`,
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#555",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>
                {card.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Radar + Scatter side by side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Radar */}
          <div
            style={{
              background: "#18181c",
              borderRadius: 12,
              padding: "24px",
              border: "1px solid #2a2a2e",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              Supplier Performance Radar
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
              Order rate · Inventory · C2C speed
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a2e" />
                <PolarAngleAxis
                  dataKey="supplier"
                  tick={{ fill: "#555", fontSize: 10 }}
                />
                <Radar
                  name="Order Rate"
                  dataKey="Order Rate"
                  stroke="#00FF88"
                  fill="#00FF88"
                  fillOpacity={0.15}
                />
                <Radar
                  name="Inv. Turn"
                  dataKey="Inv. Turn"
                  stroke="#00aaff"
                  fill="#00aaff"
                  fillOpacity={0.1}
                />
                <Radar
                  name="C2C Speed"
                  dataKey="C2C Speed"
                  stroke="#FFB347"
                  fill="#FFB347"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter — C2C vs Perfect Order Rate */}
          <div
            style={{
              background: "#18181c",
              borderRadius: 12,
              padding: "24px",
              border: "1px solid #2a2a2e",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              C2C Days vs Perfect Order Rate
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
              Bubble size = inventory turnover
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <XAxis
                  dataKey="x"
                  name="C2C Days"
                  tick={{ fill: "#555", fontSize: 10 }}
                  label={{
                    value: "C2C Days",
                    fill: "#555",
                    fontSize: 10,
                    position: "insideBottom",
                    offset: -2,
                  }}
                />
                <YAxis
                  dataKey="y"
                  name="Order Rate %"
                  tick={{ fill: "#555", fontSize: 10 }}
                  label={{
                    value: "Order Rate %",
                    fill: "#555",
                    fontSize: 10,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis dataKey="z" range={[40, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "#18181c",
                    border: "1px solid #2a2a2e",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(val, name) => [val, name]}
                />
                <Scatter data={scatterData} fill="#FF6B6B" fillOpacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-supplier KPI Table */}
        <div
          style={{
            background: "#18181c",
            borderRadius: 12,
            padding: "24px",
            border: "1px solid #2a2a2e",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Per-Supplier KPI Breakdown
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
            Full financial telemetry per node
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                minWidth: 600,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #2a2a2e" }}>
                  {[
                    "Supplier",
                    "Perfect Order",
                    "C2C Days",
                    "Inv. Turns",
                    "DPO",
                    "DSO",
                    "DIO",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "#555",
                        fontWeight: 600,
                        fontSize: 10,
                        letterSpacing: 1,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliersWithKpi.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: "1px solid #1a1a1f",
                      background: i % 2 === 0 ? "transparent" : "#0d0d0f",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: "#ccc",
                        fontWeight: 600,
                      }}
                    >
                      {s.city}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color:
                          s.kpi.perfectOrderRate >= 0.85
                            ? "#00FF88"
                            : s.kpi.perfectOrderRate >= 0.7
                              ? "#FFB347"
                              : "#FF6B6B",
                        fontWeight: 600,
                      }}
                    >
                      {Math.round(s.kpi.perfectOrderRate * 100)}%
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color:
                          s.kpi.cashToCachDays <= 35 ? "#00FF88" : "#FFB347",
                      }}
                    >
                      {s.kpi.cashToCachDays}d
                    </td>
                    <td style={{ padding: "12px", color: "#aaa" }}>
                      {s.kpi.inventoryTurnover}x
                    </td>
                    <td style={{ padding: "12px", color: "#aaa" }}>
                      {s.kpi.daysPayableOutstanding}d
                    </td>
                    <td style={{ padding: "12px", color: "#aaa" }}>
                      {s.kpi.daysSalesOutstanding}d
                    </td>
                    <td style={{ padding: "12px", color: "#aaa" }}>
                      {s.kpi.daysInventoryOutstanding}d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </_motion.div>
  );
}
