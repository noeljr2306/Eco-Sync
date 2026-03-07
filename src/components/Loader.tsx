import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

export function Loader() {
  const { progress, active } = useProgress();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef(null);
  const textRef = useRef(null);

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
        duration: 0.8,
        delay: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
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
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#FF6B6B",
            letterSpacing: 6,
            marginBottom: 8,
          }}
        >
          ECO SYNC
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#333",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Interactive Supply Chain Map
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 200 }}>
        <div
          style={{
            background: "#1a1a1f",
            borderRadius: 4,
            height: 2,
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              height: "100%",
              width: "0%",
              background: "linear-gradient(90deg, #FF6B6B88, #FF6B6B)",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          ref={textRef}
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 11,
            color: "#333",
            letterSpacing: 2,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
