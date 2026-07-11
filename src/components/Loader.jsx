import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei/core/Progress";
import gsap from "gsap";
import { theme } from "../utils/theme";
import { APP_COPY } from "../utils/constants";

export function Loader() {
  const { progress, active } = useProgress();
  const containerRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [progress]);

  useEffect(() => {
    if (!active && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        },
      });
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: theme.color.bgDeep,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        fontFamily: theme.font.family,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 20,
            fontWeight: 700,
            color: theme.color.textPrimary,
            letterSpacing: 3,
            marginBottom: 10,
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
            fontSize: 10.5,
            color: theme.color.textMuted,
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          Global Network Map
        </div>
      </div>

      <div style={{ width: 200 }}>
        <div
          style={{
            background: theme.color.panel,
            borderRadius: 2,
            height: 2,
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              height: "100%",
              width: "0%",
              background: theme.color.industrialBlue,
            }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 10.5,
            color: theme.color.textMuted,
            letterSpacing: 1.5,
            fontFamily: theme.font.mono,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
