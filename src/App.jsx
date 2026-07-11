import { Suspense, lazy, useMemo } from "react";
import { useMapStore } from "./store/useMapStore";
import { Route, Routes } from "react-router-dom";
import { Loader } from "./components/Loader";
import { DesktopGate } from "./components/DesktopGate";
import { theme } from "./utils/theme";

const MapPage = lazy(() => import("./pages/MapPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));

export default function App() {
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);

  const buttonStyle = useMemo(
    () => ({
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      background: theme.color.panel,
      border: `1px solid ${theme.color.borderStrong}`,
      color: theme.color.textSecondary,
      padding: "10px 20px",
      borderRadius: theme.radius.md,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: theme.font.family,
      boxShadow: theme.shadow.panel,
      zIndex: 120,
    }),
    [],
  );

  return (
    <DesktopGate>
      <div
        className="min-h-screen w-screen"
        style={{
          background: theme.color.bgDeep,
          color: theme.color.textPrimary,
          fontFamily: theme.font.family,
        }}
      >
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/finance" element={<FinancePage />} />
          </Routes>
        </Suspense>
        {selectedNode && (
          <button type="button" onClick={clearSelection} style={buttonStyle}>
            Reset view
          </button>
        )}
      </div>
    </DesktopGate>
  );
}
