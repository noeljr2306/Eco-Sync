import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import { theme } from "../utils/theme";
import { APP_COPY } from "../utils/constants";

const MIN_WIDTH = 1024;

export function DesktopGate({ children }) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window === "undefined" ? true : window.innerWidth >= MIN_WIDTH,
  );

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= MIN_WIDTH);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) return children;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: theme.color.bgDeep,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        textAlign: "center",
        fontFamily: theme.font.family,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 18,
          fontWeight: 700,
          color: theme.color.textPrimary,
          letterSpacing: 2,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            background: theme.color.industrialBlue,
            borderRadius: 1,
            display: "inline-block",
          }}
        />
        {APP_COPY.title.toUpperCase()}
      </div>

      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.color.border}`,
          background: theme.color.panel,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Monitor
          size={22}
          color={theme.color.industrialBlueLight}
          strokeWidth={1.75}
        />
      </div>

      <h1
        style={{
          fontSize: 19,
          fontWeight: 700,
          color: theme.color.textPrimary,
          margin: "0 0 10px",
          maxWidth: 320,
          lineHeight: 1.4,
        }}
      >
        Optimized for desktop
      </h1>
      <p
        style={{
          fontSize: 13.5,
          color: theme.color.textSecondary,
          lineHeight: 1.7,
          maxWidth: 320,
          margin: 0,
        }}
      >
        This is a simulated 3D visualization of a global supply network. Please
        revisit on a larger screen, at least {MIN_WIDTH}px wide for the full
        experience.
      </p>
    </div>
  );
}
