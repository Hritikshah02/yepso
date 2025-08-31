"use client";
import { useRef, useState, useEffect } from "react";

const categories = ["New Drops", "Inverter", "AIO Lithium", "AC Stabiliser"];

const CategoryNav = () => {
  const [selected, setSelected] = useState<string>(categories[0]); // "New Drops" selected by default

  // Container-level drag guard: if user pans horizontally, ignore click selection
  const draggingRef = useRef(false);
  const startRef = useRef<{x: number; y: number} | null>(null);
  const pressedRef = useRef<string | null>(null);

  const onBarPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = false;
  };
  const onBarPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const s = startRef.current;
    if (!s) return;
    if (Math.abs(e.clientX - s.x) > 8 || Math.abs(e.clientY - s.y) > 8) draggingRef.current = true;
  };
  // Global listeners so we finalize selection even if pointer leaves the bar
  // and ensure the initially pressed tab is selected (not what ends under the finger)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const s = startRef.current;
      if (!s) return;
      if (Math.abs(e.clientX - s.x) > 8 || Math.abs(e.clientY - s.y) > 8) draggingRef.current = true;
    };
    const onUp = () => {
      const s = startRef.current;
      const pressed = pressedRef.current;
      const dragged = draggingRef.current;
      // reset first
      startRef.current = null;
      pressedRef.current = null;
      setTimeout(() => { draggingRef.current = false; }, 50);
      if (!s) return;
      if (!dragged && pressed) setSelected(pressed);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-gray-100 justify-start whitespace-nowrap overflow-x-auto select-none"
      role="tablist"
      aria-label="Product categories"
      style={{ touchAction: 'pan-x' }}
      onPointerDown={onBarPointerDown}
      onPointerMove={onBarPointerMove}
    >
      {categories.map((category) => {
        const active = selected === category;
        const onBtnPointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
          pressedRef.current = category;
          // prevent text selection glitches
          e.preventDefault();
        };
        const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelected(category);
          }
        };
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            onPointerDown={onBtnPointerDown}
            onKeyDown={onKeyDown}
            className={`px-4 py-2 rounded-full transition-colors text-sm font-semibold focus:outline-none ${
              active ? "bg-red-600 text-white" : "text-black hover:text-gray-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryNav;
