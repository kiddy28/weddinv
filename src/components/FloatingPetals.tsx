import React, { useEffect, useState } from "react";

interface LeafItem {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  initialRotate: number;
  variant: 0 | 1 | 2; // 0 = Eucalyptus Leaf, 1 = Olive Leaf, 2 = Floral Petal
  shade: 0 | 1; // Monokromatik Navy: 0 = Translucent Frost Navy, 1 = Translucent Midnight Navy
  animationType: 0 | 1 | 2;
  depthBlur: string;
}

const FloatingPetals: React.FC = () => {
  const [leaves, setLeaves] = useState<LeafItem[]>([]);

  useEffect(() => {
    // 20 helai daun & kelopak navy transparan melayang lembut & tenang
    const count = 20;
    const items: LeafItem[] = Array.from({ length: count }).map((_, i) => {
      const size = 14 + Math.random() * 16; // 14px - 30px
      return {
        id: i,
        left: `${(Math.random() * 94 + 1).toFixed(1)}%`,
        delay: `${(Math.random() * 14).toFixed(1)}s`,
        duration: `${(13 + Math.random() * 9).toFixed(1)}s`, // 13s - 22s melayang tenang
        size,
        initialRotate: Math.round(Math.random() * 360),
        variant: (i % 3) as 0 | 1 | 2,
        shade: (i % 2 === 0 ? 0 : 1) as 0 | 1,
        // Agak transparan (opacity 40% - 60%) agar menyatu anggun dengan background tanpa menutupi teks
        depthBlur:
          size < 16
            ? "blur-[0.8px] opacity-40"
            : size > 24
              ? "opacity-60"
              : "opacity-50",
        animationType: (i % 3) as 0 | 1 | 2,
      };
    });
    setLeaves(items);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[30] overflow-hidden select-none"
      style={{ perspective: "1000px" }}
    >
      {/* SVG GRADIENT DEFINITIONS (Sewarna Monokromatik Navy Transparan) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* 1. Translucent Frost Navy (Pantulan Bulan Dingin Halus) */}
          <linearGradient id="leafNavyFrost" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#60a5fa" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#0f2b4c" stopOpacity="0.18" />
          </linearGradient>

          {/* 2. Translucent Deep Midnight Navy (Biru Navy Gelap Transparan) */}
          <linearGradient id="leafNavyDeep" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.40" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0b1e36" stopOpacity="0.16" />
          </linearGradient>
        </defs>
      </svg>

      {leaves.map((leaf) => {
        const gradId = leaf.shade === 0 ? "url(#leafNavyFrost)" : "url(#leafNavyDeep)";

        const animClass =
          leaf.animationType === 0
            ? "anim-leaf-sway-left"
            : leaf.animationType === 1
              ? "anim-leaf-sway-right"
              : "anim-leaf-tumble";

        return (
          <div
            key={leaf.id}
            className={`absolute top-[-70px] ${leaf.depthBlur} ${animClass}`}
            style={{
              left: leaf.left,
              width: `${leaf.size}px`,
              height: `${leaf.size * 1.45}px`,
              animationDuration: leaf.duration,
              animationDelay: leaf.delay,
              transformStyle: "preserve-3d",
            }}
          >
            {/* VARIANT 0: Daun Eukaliptus Ramping Melengkung Alami */}
            {leaf.variant === 0 && (
              <svg viewBox="0 0 40 60" fill="none" className="h-full w-full">
                {/* Bentuk Daun Organik Luar Navy Transparan */}
                <path
                  d="M20 2 C 30 14, 38 30, 32 46 C 28 54, 23 58, 20 60 C 17 58, 12 54, 8 46 C 2 30, 10 14, 20 2 Z"
                  fill={gradId}
                />
                {/* Tulang Daun Utama Melengkung Halus & Transparan */}
                <path
                  d="M20 58 C 20.8 45, 19.4 28, 20 8"
                  stroke="rgba(215, 235, 255, 0.28)"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
                {/* Urat Daun Samping Tipis Lembut */}
                <path
                  d="M20 42 C 24 39, 27 40, 29 42"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
                <path
                  d="M20 38 C 16 35, 13 36, 11 38"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
                <path
                  d="M20 28 C 24 25, 27 27, 28 29"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
                <path
                  d="M20 24 C 16 21, 13 23, 12 25"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* VARIANT 1: Daun Zaitun Asimetris Tertiup Angin */}
            {leaf.variant === 1 && (
              <svg viewBox="0 0 44 60" fill="none" className="h-full w-full">
                <path
                  d="M22 2 C 35 15, 42 33, 35 49 C 29 57, 23 59, 20 60 C 14 56, 7 47, 9 33 C 11 19, 18 9, 22 2 Z"
                  fill={gradId}
                />
                <path
                  d="M20 58 C 21.2 44, 20.2 27, 22 8"
                  stroke="rgba(215, 235, 255, 0.28)"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
                <path
                  d="M20.5 44 C 26 41, 30 43, 33 46"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
                <path
                  d="M20.5 37 C 15 33, 11 35, 10 37"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
                <path
                  d="M21 28 C 26 24, 29 27, 31 30"
                  stroke="rgba(215, 235, 255, 0.16)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* VARIANT 2: Kelopak Bunga Lembut Cekung (Floral Petal) */}
            {leaf.variant === 2 && (
              <svg viewBox="0 0 46 54" fill="none" className="h-full w-full">
                <path
                  d="M23 3 C 36 5, 44 19, 42 36 C 40 48, 30 52, 23 54 C 16 52, 6 48, 4 36 C 2 19, 10 5, 23 3 Z"
                  fill={gradId}
                />
                {/* Lipatan & pantulan lengkung kelopak alami transparan */}
                <path
                  d="M23 51 C 23.6 37, 22.4 21, 23 10"
                  stroke="rgba(215, 235, 255, 0.22)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                />
                <path
                  d="M23 35 C 28 30, 34 32, 36 36"
                  stroke="rgba(215, 235, 255, 0.14)"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        );
      })}

      <style>{`
        /* ============================================================== */
        /* SIMULASI AERODINAMIKA 3D DAUN JATUH ALAMI (TUMBLING & SWAYING) */
        /* ============================================================== */

        .anim-leaf-sway-left {
          animation-name: leafFlutterLeft;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
        }

        @keyframes leafFlutterLeft {
          0% {
            transform: translate3d(0, -10vh, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          25% {
            transform: translate3d(-35px, 26vh, 25px) rotateX(55deg) rotateY(160deg) rotateZ(35deg);
          }
          50% {
            transform: translate3d(28px, 54vh, -15px) rotateX(175deg) rotateY(40deg) rotateZ(105deg);
          }
          75% {
            transform: translate3d(-24px, 80vh, 20px) rotateX(270deg) rotateY(200deg) rotateZ(175deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(30px, 115vh, 0) rotateX(360deg) rotateY(360deg) rotateZ(240deg);
            opacity: 0;
          }
        }

        .anim-leaf-sway-right {
          animation-name: leafFlutterRight;
          animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
          animation-iteration-count: infinite;
        }

        @keyframes leafFlutterRight {
          0% {
            transform: translate3d(0, -10vh, 0) rotateX(15deg) rotateY(0deg) rotateZ(10deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          30% {
            transform: translate3d(38px, 30vh, 30px) rotateX(-50deg) rotateY(170deg) rotateZ(-65deg);
          }
          55% {
            transform: translate3d(-30px, 58vh, -20px) rotateX(160deg) rotateY(-45deg) rotateZ(-140deg);
          }
          80% {
            transform: translate3d(25px, 85vh, 15px) rotateX(260deg) rotateY(160deg) rotateZ(-220deg);
          }
          92% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(-20px, 115vh, 0) rotateX(360deg) rotateY(360deg) rotateZ(-300deg);
            opacity: 0;
          }
        }

        .anim-leaf-tumble {
          animation-name: leafFlutterTumble;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes leafFlutterTumble {
          0% {
            transform: translate3d(0, -10vh, 0) rotateX(0deg) rotateY(20deg) rotateZ(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.8;
          }
          35% {
            transform: translate3d(20px, 36vh, 20px) rotateX(70deg) rotateY(120deg) rotateZ(80deg);
          }
          65% {
            transform: translate3d(-22px, 70vh, -15px) rotateX(190deg) rotateY(240deg) rotateZ(170deg);
          }
          88% {
            opacity: 0.7;
          }
          100% {
            transform: translate3d(15px, 115vh, 0) rotateX(360deg) rotateY(360deg) rotateZ(280deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingPetals;
