"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

const useMedia = (queries, values, defaultValue) => {
  // Start with default during SSR; update after mount
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const get = () => {
      const idx = queries.findIndex((q) => window.matchMedia(q).matches);
      return values[idx] ?? defaultValue;
    };

    // Set current value immediately after mount
    setValue(get());

    const handler = () => setValue(get());
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((mql) => mql.addEventListener("change", handler));
    return () => mqls.forEach((mql) => mql.removeEventListener("change", handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries.join("|")]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const loadImageDimensions = async (items) => {
  const promises = items.map(
    (item) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Calculate height based on aspect ratio and column width
          const aspectRatio = img.height / img.width;
          // Ensure aspect ratio is within reasonable bounds
          const clampedRatio = Math.max(0.3, Math.min(aspectRatio, 2.0));
          resolve({ ...item, aspectRatio: clampedRatio });
        };
        img.onerror = () => {
          // Fallback aspect ratio for failed images
          resolve({ ...item, aspectRatio: 0.75 });
        };
        img.src = item.img;
      })
  );
  
  return await Promise.all(promises);
};

const Masonry = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesWithDimensions, setImagesWithDimensions] = useState([]);
  const [imagesReady, setImagesReady] = useState(false);

  // Load image dimensions when items change
  useEffect(() => {
    if (items.length === 0) {
      setImagesWithDimensions([]);
      setImagesReady(true);
      return;
    }

    setImagesReady(false);
    loadImageDimensions(items).then((itemsWithDimensions) => {
      setImagesWithDimensions(itemsWithDimensions);
      setImagesReady(true);
    });
  }, [items]);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      direction = dirs[
        Math.floor(Math.random() * dirs.length)
      ];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: (typeof window !== "undefined" ? window.innerHeight : containerRect.height) + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: (typeof window !== "undefined" ? window.innerWidth : containerRect.width) + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  const grid = useMemo(() => {
    if (!width || !imagesReady || !imagesWithDimensions.length) return [];
    
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return imagesWithDimensions.map((child, index) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      
      // Calculate height using aspect ratio for automatic sizing with minimum height
      const calculatedHeight = Math.round(columnWidth * (child.aspectRatio || 0.75));
      const height = Math.max(calculatedHeight, 200); // Ensure minimum height of 200px
      const y = colHeights[col];

      colHeights[col] += height + gap;
      
      return { 
        ...child, 
        x, 
        y, 
        w: columnWidth, 
        h: height,
        renderOrder: index 
      };
    });
  }, [columns, imagesWithDimensions, width, imagesReady]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id, element) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id, element) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  // Adjust container height to fit positioned children
  useLayoutEffect(() => {
    if (!containerRef.current || !grid?.length) return;
    
    // Calculate the maximum bottom position of all items with proper gap
    const maxBottom = Math.max(
      ...grid.map((item) => {
        const y = Number.isFinite(item?.y) ? item.y : 0;
        const h = Number.isFinite(item?.h) && item.h > 0 ? item.h : 300;
        return y + h;
      })
    );
    
    // Add some bottom padding and ensure minimum height
    const containerHeight = Math.max(maxBottom + 32, 400);
    containerRef.current.style.height = `${Math.ceil(containerHeight)}px`;
  }, [grid]);

  return (
    <div ref={containerRef} className="relative w-full">
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{ 
            willChange: "transform, width, height, opacity", 
            zIndex: 1 // Consistent z-index for all items to prevent stacking issues
          }}
          onClick={() => item.url && window.open(item.url, "_blank", "noopener")}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative w-full h-full bg-cover bg-center rounded-xl shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.25)]"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 rounded-xl bg-gradient-to-tr from-sky-400/40 to-blue-500/40 opacity-0 pointer-events-none" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
