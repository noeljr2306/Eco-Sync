import { useMapStore } from "./store/useMapStore";
import {Sidebar} from "./ui/Sidebar";
import { FilterBar } from "./ui/FilterBar";
import { Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import AnalyticsPage from "./pages/AnalyticPage"

export default function App() {
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);

  return (
    <div className="h-screen w-screen bg-[#0a0a0f]">
      <Routes>
        <Route path="/" element={<MapPage/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
      </Routes>
      <FilterBar />
      <Sidebar />
      {selectedNode && (
        <button
          onClick={clearSelection}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,10,15,0.85)",
            border: "1px solid #FF6B6B",
            color: "#FF6B6B",
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          ← RESET VIEW
        </button>
      )}
    </div>
  );
}
