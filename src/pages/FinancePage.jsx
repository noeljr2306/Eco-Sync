import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, LineChart } from "lucide-react";
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
import { APP_COPY } from "../utils/constants";
import { theme } from "../utils/theme";

gsap.registerPlugin(ScrollTrigger);

const suppliersWithKpi = data.suppliers.filter((s) => s.kpi);

const avgKpi = {
  perfectOrderRate: (
    (suppliersWithKpi.reduce((a, s) => a + s.kpi.perfectOrderRate, 0) /
      suppliersWithKpi.length) *
    100
  ).toFixed(1),
  cashToCashDays: Math.round(
    suppliersWithKpi.reduce((a, s) => a + s.kpi.cashToCashDays, 0) /
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
  "C2C Speed": Math.round(100 - s.kpi.cashToCashDays),
}));

const scatterData = suppliersWithKpi.map((s) => ({
  name: s.name,
  x: s.kpi.cashToCashDays,
  y: Math.round(s.kpi.perfectOrderRate * 100),
  z: s.kpi.inventoryTurnover * 10,
}));

const navButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: theme.color.panel,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.md,
  padding: "8px 16px",
  color: theme.color.textSecondary,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: theme.font.family,
};

const panelStyle = {
  background: theme.color.panel,
  borderRadius: theme.radius.md,
  padding: 24,
  border: `1px solid ${theme.color.border}`,
};

export default function FinancePage() {
  const navigate = useNavigate();
  const cardsRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      ".finance-card",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.6,
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
        height: "100vh",
        background: theme.color.bgDeep,
        color: theme.color.textPrimary,
        fontFamily: theme.font.family,
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
          background: theme.color.bg,
          borderBottom: `1px solid ${theme.color.border}`,
          padding: "16px clamp(20px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: theme.color.industrialBlue,
              borderRadius: 1,
            }}
          />
          {APP_COPY.title.toUpperCase()} — Finance View
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={navButtonStyle}
          >
            <ArrowLeft size={13} /> Globe
          </button>
          <button
            type="button"
            onClick={() => navigate("/analytics")}
            style={navButtonStyle}
          >
            <LineChart size={13} /> Analytics
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
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2.5,
              color: theme.color.industrialBlueLight,
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Financial Intelligence Layer
          </div>
          <h1
            style={{
              fontSize: "clamp(22px,4vw,28px)",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Supply Chain KPI Dashboard
          </h1>
          <p
            style={{
              color: theme.color.textSecondary,
              fontSize: 13,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Perfect Order Rate · Cash-to-Cash Cycle · Inventory Velocity
          </p>
        </div>

        {/* KPI Cards */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {[
            {
              label: "Avg Perfect Order Rate",
              value: `${avgKpi.perfectOrderRate}%`,
              color: theme.color.emerald,
              desc: "Orders delivered perfect",
            },
            {
              label: "Avg Cash-to-Cash",
              value: `${avgKpi.cashToCashDays}d`,
              color: theme.color.safetyYellow,
              desc: "Working capital cycle",
            },
            {
              label: "Avg Inventory Turns",
              value: avgKpi.inventoryTurnover,
              color: theme.color.industrialBlueLight,
              desc: "Annual inventory cycles",
            },
            {
              label: "Suppliers Tracked",
              value: suppliersWithKpi.length,
              color: theme.color.steel,
              desc: "With full KPI telemetry",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="finance-card"
              style={{
                background: theme.color.panel,
                border: `1px solid ${theme.color.border}`,
                borderTop: `2px solid ${card.color}`,
                borderRadius: theme.radius.md,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: theme.color.textMuted,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.color.textPrimary,
                  fontFamily: theme.font.mono,
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.color.textMuted,
                  marginTop: 4,
                }}
              >
                {card.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Radar + Scatter */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={panelStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              Supplier Performance Radar
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.color.textMuted,
                marginBottom: 20,
              }}
            >
              Order rate · Inventory · C2C speed
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={theme.color.border} />
                <PolarAngleAxis
                  dataKey="supplier"
                  tick={{ fill: theme.color.textMuted, fontSize: 10 }}
                />
                <Radar
                  name="Order Rate"
                  dataKey="Order Rate"
                  stroke={theme.color.emerald}
                  fill={theme.color.emerald}
                  fillOpacity={0.15}
                />
                <Radar
                  name="Inv. Turn"
                  dataKey="Inv. Turn"
                  stroke={theme.color.industrialBlueLight}
                  fill={theme.color.industrialBlueLight}
                  fillOpacity={0.1}
                />
                <Radar
                  name="C2C Speed"
                  dataKey="C2C Speed"
                  stroke={theme.color.safetyYellow}
                  fill={theme.color.safetyYellow}
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={panelStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              C2C Days vs Perfect Order Rate
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.color.textMuted,
                marginBottom: 20,
              }}
            >
              Bubble size = inventory turnover
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <XAxis
                  dataKey="x"
                  name="C2C Days"
                  tick={{ fill: theme.color.textMuted, fontSize: 10 }}
                  label={{
                    value: "C2C Days",
                    fill: theme.color.textMuted,
                    fontSize: 10,
                    position: "insideBottom",
                    offset: -2,
                  }}
                />
                <YAxis
                  dataKey="y"
                  name="Order Rate %"
                  tick={{ fill: theme.color.textMuted, fontSize: 10 }}
                  label={{
                    value: "Order Rate %",
                    fill: theme.color.textMuted,
                    fontSize: 10,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis dataKey="z" range={[40, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: theme.color.panelAlt,
                    border: `1px solid ${theme.color.border}`,
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  formatter={(val, name) => [val, name]}
                />
                <Scatter
                  data={scatterData}
                  fill={theme.color.industrialBlueLight}
                  fillOpacity={0.85}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Table */}
        <div style={panelStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Per-Supplier KPI Breakdown
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.color.textMuted,
              marginBottom: 20,
            }}
          >
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
                <tr style={{ borderBottom: `1px solid ${theme.color.border}` }}>
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
                        color: theme.color.textMuted,
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
                      borderBottom: `1px solid ${theme.color.border}`,
                      background:
                        i % 2 === 0 ? "transparent" : theme.color.panelAlt,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
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
                            ? theme.color.emerald
                            : s.kpi.perfectOrderRate >= 0.7
                              ? theme.color.safetyYellow
                              : theme.color.containerRed,
                        fontWeight: 600,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {Math.round(s.kpi.perfectOrderRate * 100)}%
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color:
                          s.kpi.cashToCashDays <= 35
                            ? theme.color.emerald
                            : theme.color.safetyYellow,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {s.kpi.cashToCashDays}d
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {s.kpi.inventoryTurnover}x
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {s.kpi.daysPayableOutstanding}d
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {s.kpi.daysSalesOutstanding}d
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                        fontFamily: theme.font.mono,
                      }}
                    >
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
