import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// E-commerce hero: same motion/palette as the TOONHUB spec,
// but with real commerce product imagery (sneaker, watch, bag, headphones).
const IMAGES = [
  {
    // warm sneaker — orange
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    bg: "#F4845F",
    panel: "#F79B7F",
    label: "SNEAKERS",
  },
  {
    // smartwatch — green
    src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    bg: "#6BBF7A",
    panel: "#85CC92",
    label: "SMART WATCH",
  },
  {
    // bag — pink
    src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    bg: "#E882B4",
    panel: "#ED9DC4",
    label: "HANDBAG",
  },
  {
    // headphones — blue
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
    label: "HEADPHONES",
  },
];

const EASE = "650ms cubic-bezier(0.4, 0, 0.2, 1)";
const TRANSITION = `transform ${EASE}, filter ${EASE}, opacity ${EASE}, left ${EASE}`;

const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.08"/></svg>`
)}")`;

const ToonHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    IMAGES.forEach((i) => {
      const img = new Image();
      img.src = i.src;
    });
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const navigate = (dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + (dir === "next" ? 1 : 3)) % 4);
    setTimeout(() => setIsAnimating(false), 650);
  };

  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;
  const back = (activeIndex + 2) % 4;

  const roleStyle = (index) => {
    if (index === center)
      return {
        zIndex: 20,
        left: "50%",
        bottom: isMobile ? "22%" : 0,
        height: isMobile ? "60%" : "92%",
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: "blur(0px)",
        opacity: 1,
      };
    if (index === left || index === right)
      return {
        zIndex: 10,
        bottom: isMobile ? "32%" : "12%",
        height: isMobile ? "16%" : "28%",
        left: index === left ? (isMobile ? "20%" : "30%") : isMobile ? "80%" : "70%",
        transform: "translateX(-50%) scale(1)",
        filter: "blur(2px)",
        opacity: 0.85,
      };
    return {
      zIndex: 5,
      left: "50%",
      bottom: isMobile ? "32%" : "12%",
      height: isMobile ? "13%" : "22%",
      transform: "translateX(-50%) scale(1)",
      filter: "blur(4px)",
      opacity: 1,
    };
  };

  const itemBase = { position: "absolute", aspectRatio: "0.6 / 1" };

  const btnHover = (e, on) => {
    e.currentTarget.style.transform = on ? "scale(1.08)" : "scale(1)";
    e.currentTarget.style.backgroundColor = on ? "rgba(255,255,255,0.12)" : "transparent";
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        overflow: "hidden",
        // outer rounding like the original premium hero — matches other sections
        borderRadius: "3rem",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", borderRadius: "3rem" }}>
        {/* grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: GRAIN_URL,
            backgroundSize: "200px 200px",
            borderRadius: "3rem",
          }}
        />

        {/* giant ghost text — now commerce */}
        <h1
          style={{
            position: "absolute",
            insetInline: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            top: "18%",
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(90px, 28vw, 380px)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          SHOP DROP
        </h1>

        {/* brand label */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: isMobile ? 16 : 32,
            zIndex: 60,
            fontSize: 12,
            fontWeight: 600,
            color: "#fff",
            opacity: 0.9,
            letterSpacing: "0.18em",
          }}
        >
          MINISHOP
        </div>

        {/* carousel — floating commerce products */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          {IMAGES.map((item, i) => (
            <div key={item.src} style={{ ...itemBase, ...roleStyle(i), transition: TRANSITION, willChange: "transform, filter, opacity" }}>
              <img
                src={item.src}
                alt={item.label}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  // soft white card + shadow so photo products float cleanly over the bright BG
                  background: "#fff",
                  borderRadius: 28,
                  boxShadow: i === center ? "0 20px 50px rgba(0,0,0,.18)" : "0 8px 20px rgba(0,0,0,.12)",
                  padding: isMobile ? 6 : 10,
                }}
              />
            </div>
          ))}
        </div>

        {/* bottom-left */}
        <div style={{ position: "absolute", bottom: isMobile ? 24 : 80, left: isMobile ? 16 : 96, zIndex: 60, maxWidth: 320, color: "#fff" }}>
          <p className="uppercase font-bold" style={{ fontSize: isMobile ? 16 : 22, opacity: 0.95, letterSpacing: "0.02em", margin: "0 0 8px", whiteSpace: "nowrap" }}>
            {IMAGES[activeIndex].label}
          </p>
          <p
            style={{
              display: isMobile ? "none" : "block",
              fontSize: 14,
              opacity: 0.85,
              lineHeight: 1.6,
              margin: "0 0 20px",
            }}
          >
            Curated for your lifestyle — premium quality, AI-picked for you. Free shipping, effortless returns. Discover your next favourite.
          </p>
          <div style={{ display: "flex", gap: isMobile ? 10 : 12, alignItems: "center" }}>
            {[ArrowLeft, ArrowRight].map((Icon, i) => (
              <button
                key={i}
                onClick={() => navigate(i === 0 ? "prev" : "next")}
                onMouseEnter={(e) => btnHover(e, true)}
                onMouseLeave={(e) => btnHover(e, false)}
                aria-label={i === 0 ? "Previous" : "Next"}
                style={{
                  width: isMobile ? 48 : 64,
                  height: isMobile ? 48 : 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "2px solid #fff",
                  borderRadius: 9999,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "transform 150ms, background-color 150ms",
                }}
              >
                <Icon size={26} strokeWidth={2.25} />
              </button>
            ))}
            <span
              style={{
                marginLeft: 6,
                fontFamily: "'Anton', sans-serif",
                fontSize: 11,
                letterSpacing: "0.14em",
                opacity: 0.85,
                whiteSpace: "nowrap",
              }}
            >
              {activeIndex + 1} / 4
            </span>
          </div>
        </div>

        {/* bottom-right — SHOP NOW */}
        <a
          href="#collection"
          onClick={(e) => {
            const el = document.querySelector("#collection");
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={{
            position: "absolute",
            bottom: isMobile ? 24 : 80,
            right: isMobile ? 16 : 40,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(20px, 4vw, 56px)",
            fontWeight: 400,
            color: "#fff",
            opacity: 0.95,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 200ms",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.95)}
        >
          SHOP NOW{" "}
          <ArrowRight strokeWidth={2.25} style={{ width: isMobile ? 20 : 32, height: isMobile ? 20 : 32 }} />
        </a>
      </div>
    </div>
  );
};

export default ToonHero;