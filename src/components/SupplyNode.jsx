import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { geoToVector3 } from "../utils/geoToVector3";
import { useMapStore } from "../store/useMapStore";

const LEVEL_COLORS = {
  eco: "#00FF88",
  moderate: "#FFB347",
  high: "#FF6B6B",
};

export function SupplyNode({ supplier, onNodeClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { setSelectedNode, setHoveredNode } = useMapStore();

  const position = geoToVector3(supplier.lat, supplier.lng);
  const color = LEVEL_COLORS[supplier.level];

  const activeFilter = useMapStore((s) => s.activeFilter);

  if (activeFilter !== "all" && supplier.level !== activeFilter) {
    return null;
  }
  return (
    <group ref={groupRef} position={position}>
      <mesh
        onPointerOver={() => {
          setHovered(true);
          setHoveredNode(supplier);
          if (groupRef.current) groupRef.current.scale.setScalar(1.6);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredNode(null);
          if (groupRef.current) groupRef.current.scale.setScalar(1);
        }}
        onClick={() => {
          setSelectedNode(supplier);
          if (onNodeClick) onNodeClick(supplier);
        }}
      >
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1.5}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.022, 0.035, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.6 : 0.2}
          side={2}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={4} center>
          <div
            style={{
              background: "rgba(10,10,15,0.85)",
              border: `1px solid ${color}`,
              borderRadius: 6,
              padding: "6px 10px",
              color: "#fff",
              fontSize: 11,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 700 }}>{supplier.name}</div>
            <div style={{ color: "#aaa" }}>
              {supplier.city}, {supplier.country}
            </div>
            <div style={{ color, marginTop: 2 }}>CO₂: {supplier.emission}%</div>
          </div>
        </Html>
      )}
    </group>
  );
}
