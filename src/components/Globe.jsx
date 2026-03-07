import { forwardRef } from "react";
import GlobeGL from "react-globe.gl";
import data from "../data/supplyChain.json";
import { useMapStore } from "../store/useMapStore";

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

const arcs = data.routes.map((route) => {
  const from = data.suppliers.find((s) => s.id === route.from);
  const to = data.suppliers.find((s) => s.id === route.to);
  return {
    startLat: from.lat,
    startLng: from.lng,
    endLat: to.lat,
    endLng: to.lng,
    color: ROUTE_COLORS[route.type],
    type: route.type,
  };
});

export const Globe = forwardRef(function Globe(_, ref) {
  const setSelectedNode = useMapStore((s) => s.setSelectedNode);
  const activeFilter = useMapStore((s) => s.activeFilter);

  const filteredSuppliers =
    activeFilter === "all"
      ? data.suppliers
      : data.suppliers.filter((s) => s.level === activeFilter);

  return (
    <GlobeGL
      ref={ref}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      atmosphereColor="#1a6fff"
      atmosphereAltitude={0.18}
      showAtmosphere={true}
      pointsData={filteredSuppliers}
      pointLat={(s) => s.lat}
      pointLng={(s) => s.lng}
      pointColor={(s) => LEVEL_COLORS[s.level]}
      pointAltitude={0.01}
      pointRadius={0.5}
      pointResolution={16}
      pointLabel={(s) => `
        <div style="
          background: rgba(10,10,15,0.95);
          border: 1px solid ${LEVEL_COLORS[s.level]};
          border-radius: 8px;
          padding: 10px 14px;
          font-family: Segoe UI, sans-serif;
          color: #fff;
          font-size: 12px;
          min-width: 160px;
          box-shadow: 0 0 20px ${LEVEL_COLORS[s.level]}44;
          pointer-events: none;
        ">
          <div style="font-weight:700;font-size:13px;margin-bottom:6px">${s.name}</div>
          <div style="color:#aaa;margin-bottom:4px">📍 ${s.city}, ${s.country}</div>
          <div style="color:${LEVEL_COLORS[s.level]};font-weight:600">CO₂: ${s.emission}%</div>
          <div style="color:#555;font-size:10px;margin-top:4px;text-transform:uppercase;letter-spacing:1px">${s.level} emission</div>
        </div>
      `}
      onPointClick={(s) => setSelectedNode(s)}
      arcsData={arcs}
      arcStartLat={(a) => a.startLat}
      arcStartLng={(a) => a.startLng}
      arcEndLat={(a) => a.endLat}
      arcEndLng={(a) => a.endLng}
      arcColor={(a) => a.color}
      arcAltitude={0.25}
      arcStroke={0.5}
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashAnimateTime={2000}
      ringsData={filteredSuppliers}
      ringLat={(s) => s.lat}
      ringLng={(s) => s.lng}
      ringColor={(s) => LEVEL_COLORS[s.level]}
      ringMaxRadius={3}
      ringPropagationSpeed={2}
      ringRepeatPeriod={1000}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
});
