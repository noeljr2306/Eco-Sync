import GlobeGL from "react-globe.gl";
import data from "../data/supplyChain.json";
import { useMapStore } from "../store/useMapStore";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { LEVEL_COLORS, ROUTE_COLORS } from "../utils/constants";
import { theme } from "../utils/theme";

const supplierIndex = new Map(data.suppliers.map((s) => [s.id, s]));

const arcs = data.routes
  .filter((route) => supplierIndex.get(route.from) && supplierIndex.get(route.to))
  .map((route) => {
    const from = supplierIndex.get(route.from);
    const to = supplierIndex.get(route.to);
    return {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
      color: ROUTE_COLORS[route.type] ?? theme.color.industrialBlue,
      type: route.type,
      fromCity: from.city,
      toCity: to.city,
    };
  });

export const Globe = forwardRef(function Globe(_, ref) {
  const setSelectedNode = useMapStore((s) => s.setSelectedNode);
  const activeFilter = useMapStore((s) => s.activeFilter);

  // Track whether rotation was running before a hover began, so we
  // resume correctly instead of always forcing rotation back on.
  const wasRotatingRef = useRef(false);

  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (activeFilter === "all") return data.suppliers;
    return data.suppliers.filter((s) => s.level === activeFilter);
  }, [activeFilter]);

  function pauseRotation() {
    const controls = ref?.current?.controls?.();
    if (!controls) return;
    wasRotatingRef.current = controls.autoRotate;
    controls.autoRotate = false;
  }

  function resumeRotation() {
    const controls = ref?.current?.controls?.();
    if (!controls) return;
    controls.autoRotate = wasRotatingRef.current;
  }

  function handlePointHover(point) {
    if (point) {
      pauseRotation();
    } else {
      resumeRotation();
    }
  }

  function handleArcHover(arc) {
    if (arc) {
      pauseRotation();
    } else {
      resumeRotation();
    }
  }

  return (
    <GlobeGL
      ref={ref}
      backgroundColor={theme.color.bgDeep}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      showGraticules={true}
      showAtmosphere={true}
      atmosphereColor={theme.color.steel}
      atmosphereAltitude={0.1}
      pointsData={filteredSuppliers}
      pointLat={(s) => s.lat}
      pointLng={(s) => s.lng}
      pointColor={(s) => LEVEL_COLORS[s.level]}
      pointAltitude={0.01}
      pointRadius={0.42}
      pointResolution={16}
      pointLabel={(s) => `
        <div style="
          background: ${theme.color.panel};
          border: 1px solid ${LEVEL_COLORS[s.level]}55;
          border-left: 3px solid ${LEVEL_COLORS[s.level]};
          border-radius: 6px;
          padding: 10px 12px;
          font-family: ${theme.font.family};
          color: ${theme.color.textPrimary};
          font-size: 12px;
          min-width: 170px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          pointer-events: none;
        ">
          <div style="font-weight:700;font-size:13px;margin-bottom:6px">${s.name}</div>
          <div style="color:${theme.color.textMuted};margin-bottom:4px">${s.city}, ${s.country}</div>
          <div style="color:${LEVEL_COLORS[s.level]};font-weight:600">CO₂ Score: ${s.emission}%</div>
          <div style="color:${theme.color.textMuted};font-size:10px;margin-top:4px;text-transform:uppercase;letter-spacing:1px">${s.level} emission</div>
        </div>
      `}
      onPointClick={(s) => setSelectedNode(s)}
      onPointHover={handlePointHover}
      arcsData={arcs}
      arcStartLat={(a) => a.startLat}
      arcStartLng={(a) => a.startLng}
      arcEndLat={(a) => a.endLat}
      arcEndLng={(a) => a.endLng}
      arcColor={(a) => a.color}
      arcAltitude={0.2}
      arcStroke={0.35}
      arcDashLength={0.4}
      arcDashGap={0.22}
      arcDashAnimateTime={2600}
      arcLabel={(a) => `
        <div style="
          background: ${theme.color.panel};
          border: 1px solid ${a.color}55;
          border-left: 3px solid ${a.color};
          border-radius: 6px;
          padding: 10px 12px;
          font-family: ${theme.font.family};
          color: ${theme.color.textPrimary};
          font-size: 12px;
          min-width: 160px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          pointer-events: none;
        ">
          <div style="font-weight:700;font-size:13px;margin-bottom:6px">${a.fromCity} → ${a.toCity}</div>
          <div style="color:${a.color};font-weight:600;text-transform:uppercase;font-size:10px;letter-spacing:1px">${a.type} route</div>
        </div>
      `}
      onArcHover={handleArcHover}
      ringsData={filteredSuppliers}
      ringLat={(s) => s.lat}
      ringLng={(s) => s.lng}
      ringColor={(s) => LEVEL_COLORS[s.level]}
      ringMaxRadius={2.2}
      ringPropagationSpeed={1.3}
      ringRepeatPeriod={1800}
      width={viewport.width}
      height={viewport.height}
    />
  );
});