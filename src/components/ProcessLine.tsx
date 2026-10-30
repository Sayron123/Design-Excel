"use client";

// One continuous line that tells the four stages: it loops between two people talking, travels
// on and becomes a floor plan, then a cabinet on the saw bench, then loops again into the
// delivery truck. Only a window of the line is visible at a time; scrolling slides the window
// along it, so each drawing unravels into the next instead of cross-fading. While on screen each
// drawing also moves a little: the two people nod as the conversation loops pulse, the door
// swings, the saw spins as the panel feeds, and once the truck is drawn it drives.

import { useReducedMotion, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

/** A horizontal run of loops from (x0, y) to (x1, y), looping upwards with radius b. */
function coil(x0: number, y: number, x1: number, loops: number, b: number) {
  const a = (x1 - x0) / (2 * Math.PI * loops);
  const steps = loops * 24;
  let d = `M${x0} ${y}`;
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI * loops;
    d += ` L${(x0 + a * t - b * Math.sin(t)).toFixed(1)} ${(y - b * (1 - Math.cos(t))).toFixed(1)}`;
  }
  return d;
}

/** A saw blade outline starting and ending at its right-hand edge. */
function blade(cx: number, cy: number, r: number, tooth: number, teeth: number) {
  let d = `M${cx + r} ${cy}`;
  for (let k = 1; k <= teeth; k++) {
    const tip = ((k - 0.4) / teeth) * 2 * Math.PI;
    const gullet = (k / teeth) * 2 * Math.PI;
    d += ` L${(cx + (r + tooth) * Math.cos(tip)).toFixed(1)} ${(cy + (r + tooth) * Math.sin(tip)).toFixed(1)}`;
    d += ` L${(cx + r * Math.cos(gullet)).toFixed(1)} ${(cy + r * Math.sin(gullet)).toFixed(1)}`;
  }
  return d;
}

/** A full circle starting and ending at its right-hand edge. */
function ring(cx: number, cy: number, r: number) {
  return `M${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy}`;
}

const WHEELS = [
  { cx: 105, cy: 212 },
  { cx: 275, cy: 212 },
];

/** Strokes that move on their own; everything else stays where it is drawn. */
type Part = "still" | "tail" | "headA" | "headB" | "talk" | "door" | "chair" | "panel" | "blade" | "body" | "wheel0" | "wheel1";
type Stroke = [part: Part, d: string];

// Drawings and the connectors between them, in drawing order. Each stroke starts where the pen
// lands; within a drawing, consecutive strokes that touch read as one line.
const PIECES: Stroke[][] = [
  // Consultation: two people at a table, the conversation looping between them.
  [
    ["still", "M30 222 H50 C50 150 130 150 130 222 H270 C270 150 350 150 350 222 H370"],
    ["headA", "M110 138 A20 20 0 1 0 70 138 A20 20 0 1 0 110 138"],
    ["talk", coil(110, 138, 290, 5, 10)],
    ["headB", "M290 138 A20 20 0 1 1 330 138 A20 20 0 1 1 290 138"],
  ],
  [["still", "M290 138 C380 150 330 290 180 240"]],
  // AutoCAD layout: walls with a door swing, desks, meeting table, chairs and a dimension line.
  [
    ["still", "M180 240 H60 V50 H340 V240 H220"],
    ["door", "M220 240 V200 A40 40 0 0 0 180 240"],
    ["still", "M200 50 V140 H260"],
    ["still", "M90 78 H170 V112 H90 Z"],
    ["chair", ring(130, 128, 8)],
    ["still", "M230 78 H310 V112 H230 Z"],
    ["still", ring(250, 64, 8)],
    ["still", ring(290, 64, 8)],
    ["still", "M90 170 H160 V200 H90 Z"],
    ["still", "M250 170 H320 V200 H250 Z"],
    ["still", "M60 24 V36"],
    ["still", "M60 30 H340"],
    ["still", "M340 24 V36"],
  ],
  [["still", "M340 36 C330 80 120 50 80 92"]],
  // Manufacturing: a cabinet carcass on the bench, a panel running through the saw.
  [
    ["still", "M80 92 H180 V220 H80 Z"],
    ["still", "M80 134 H180"],
    ["still", "M80 176 H180"],
    ["still", "M40 220 H360"],
    ["still", "M64 220 V250"],
    ["still", "M336 220 V250"],
    ["panel", "M215 220 V206 H355 V220"],
    ["blade", blade(285, 166, 38, 7, 22)],
    ["blade", ring(285, 166, 6)],
  ],
  [["still", "M291 166 C240 290 20 270 20 150"]],
  // Delivery and install: the line loops again and becomes the truck on the road.
  [
    // The loops are the line winding itself into the truck; they unwind once the truck is drawn.
    ["tail", coil(20, 150, 60, 3, 8)],
    ["body", "M60 150 V100 H230 V205 H60 V150"],
    ["body", "M230 130 H280 L318 168 V205 H230"],
    ["body", "M240 140 H276 L300 166 H240 Z"],
    ["wheel0", ring(WHEELS[0].cx, WHEELS[0].cy, 18)],
    ["wheel0", `M${WHEELS[0].cx} ${WHEELS[0].cy - 13} V${WHEELS[0].cy + 13}`],
    ["wheel0", `M${WHEELS[0].cx - 13} ${WHEELS[0].cy} H${WHEELS[0].cx + 13}`],
    ["wheel1", ring(WHEELS[1].cx, WHEELS[1].cy, 18)],
    ["wheel1", `M${WHEELS[1].cx} ${WHEELS[1].cy - 13} V${WHEELS[1].cy + 13}`],
    ["wheel1", `M${WHEELS[1].cx - 13} ${WHEELS[1].cy} H${WHEELS[1].cx + 13}`],
    ["still", "M20 240 H380"],
  ],
];

// Browsers restart a dash pattern at every "M", so each stroke is its own <path> and the visible
// window is cut out of each one by its position along the whole line.
const STROKES = PIECES.flatMap((strokes, piece) => strokes.map(([part, d]) => ({ part, d, piece })));
const MOVING: Exclude<Part, "still" | "tail">[] = ["headA", "headB", "talk", "door", "chair", "panel", "blade", "body", "wheel0", "wheel1"];

/** Start and end of each drawing along the line, from the measured stroke lengths. */
function sceneBounds(lengths: number[]) {
  const pieceLengths = PIECES.map((_, piece) =>
    STROKES.reduce((sum, s, i) => (s.piece === piece ? sum + lengths[i] : sum), 0),
  );
  const bounds: { start: number; end: number }[] = [];
  let at = 0;
  pieceLengths.forEach((len, i) => {
    if (i % 2 === 0) bounds.push({ start: at, end: at + len });
    at += len;
  });
  return bounds;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Piecewise interpolation through [progress, value] keys, eased between each pair. */
function through(p: number, keys: [number, number][]) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, v1] = keys[i];
    if (p <= p1) {
      const [p0, v0] = keys[i - 1];
      return v0 + (v1 - v0) * smooth((p - p0) / (p1 - p0));
    }
  }
  return keys[keys.length - 1][1];
}

type Bounds = ReturnType<typeof sceneBounds>;

/** Each drawing holds, then unravels into the next, in step with the four quarters of progress. */
function storyWindow(p: number, s: Bounds, tailEnd: number) {
  const end = through(p, [
    [0, 0],
    [0.1, s[0].end],
    [0.22, s[0].end],
    [0.35, s[1].end],
    [0.47, s[1].end],
    [0.6, s[2].end],
    [0.72, s[2].end],
    [0.85, s[3].end],
  ]);
  const start = through(p, [
    [0.25, 0],
    [0.35, s[1].start],
    [0.5, s[1].start],
    [0.6, s[2].start],
    [0.75, s[2].start],
    [0.85, s[3].start],
    [0.92, tailEnd],
  ]);
  return { start: Math.min(start, end), end };
}

/** The truck starts driving once it is fully drawn. */
const DRIVE_FROM = 0.88;

/** Where each moving part sits `s` seconds into its loop. */
function pose(part: Exclude<Part, "still" | "tail">, s: number, driving: boolean) {
  switch (part) {
    case "headA":
      return `translate(0 ${(-Math.abs(Math.sin(s * 2.6)) * 3).toFixed(2)})`;
    case "headB":
      return `translate(0 ${(-Math.abs(Math.sin(s * 2.6 + 1.3)) * 3).toFixed(2)})`;
    case "talk": {
      const k = 1 + Math.sin(s * 5) * 0.22;
      return `translate(0 138) scale(1 ${k.toFixed(3)}) translate(0 -138)`;
    }
    case "door":
      return `rotate(${(-(1 - Math.cos(s * 1.4)) * 14).toFixed(2)} 220 240)`;
    case "chair":
      return `translate(${(Math.sin(s * 1.1) * 5).toFixed(2)} 0)`;
    case "panel":
      return `translate(${(Math.sin(s * 0.9) * 10).toFixed(2)} 0)`;
    case "blade":
      return `rotate(${((s * 540) % 360).toFixed(1)} 285 166)`;
    case "body":
      return driving ? `translate(0 ${(Math.sin(s * 18) * 0.9).toFixed(2)})` : "";
    case "wheel0":
    case "wheel1": {
      const w = WHEELS[part === "wheel0" ? 0 : 1];
      return driving ? `rotate(${((s * 420) % 360).toFixed(1)} ${w.cx} ${w.cy})` : "";
    }
  }
}

export function LineStory({ progress, label, className = "" }: { progress: MotionValue<number>; label: string; className?: string }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGCircleElement>(null);
  const laneRef = useRef<SVGLineElement>(null);
  const groupRefs = useRef<Partial<Record<Part, SVGGElement | null>>>({});
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);

  // Drawn imperatively from the scroll value, so scrolling never re-renders React.
  useEffect(() => {
    const svg = svgRef.current;
    const pen = penRef.current;
    const lane = laneRef.current;
    // A snapshot: the elements stay usable even if a re-render briefly clears the ref slots.
    const paths = strokeRefs.current.slice(0, STROKES.length);
    const groups = groupRefs.current;
    if (!svg || !pen || !lane || paths.length < STROKES.length || paths.some((p) => !p)) return;
    const lengths = paths.map((p) => p!.getTotalLength());
    const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
    const bounds = sceneBounds(lengths);
    const tail = STROKES.findIndex((s) => s.part === "tail");
    const tailEnd = offsets[tail] + lengths[tail];

    // The small movements run on their own clock, only while the panel is on screen.
    let onScreen = false;
    let driving = false;
    let frame = 0;
    const startedAt = performance.now();

    function loop(now: number) {
      const s = (now - startedAt) / 1000;
      for (const part of MOVING) groups[part]?.setAttribute("transform", pose(part, s, driving));
      lane!.style.strokeDashoffset = `${(s * 160).toFixed(1)}`;
      frame = requestAnimationFrame(loop);
    }

    function setLooping(on: boolean) {
      if (on === (frame !== 0)) return;
      if (on) frame = requestAnimationFrame(loop);
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function draw(raw: number) {
      const p = Math.min(1, Math.max(0, raw));
      const current = Math.min(bounds.length - 1, Math.floor(p * bounds.length));
      const { start, end } = reduce ? bounds[current] : storyWindow(p, bounds, tailEnd);

      paths.forEach((path, i) => {
        const from = Math.max(start, offsets[i]);
        const to = Math.min(end, offsets[i] + lengths[i]);
        path!.style.opacity = to - from > 0.5 ? "1" : "0";
        path!.style.strokeDasharray = `${Math.max(0, to - from)} ${lengths[i] + 1}`;
        path!.style.strokeDashoffset = `${offsets[i] - from}`;
      });

      // The pen sits on the leading end of the line.
      const at = offsets.findLastIndex((o) => o <= end);
      const tip = paths[at]!.getPointAtLength(Math.min(lengths[at], end - offsets[at]));
      pen!.setAttribute("cx", tip.x.toFixed(1));
      pen!.setAttribute("cy", tip.y.toFixed(1));

      driving = !reduce && p >= DRIVE_FROM;
      lane!.style.opacity = driving ? "1" : "0";
      pen!.style.opacity = driving ? "0" : "1";
      setLooping(!reduce && onScreen);
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      draw(progress.get());
    });
    observer.observe(svg);
    draw(progress.get());
    const unsubscribe = progress.on("change", draw);
    return () => {
      unsubscribe();
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [progress, reduce]);

  const strokesOf = (part: Part) =>
    STROKES.map((s, i) =>
      s.part === part ? (
        <path
          key={i}
          d={s.d}
          style={{ opacity: 0 }}
          ref={(el) => {
            strokeRefs.current[i] = el;
          }}
        />
      ) : null,
    );

  return (
    <svg ref={svgRef} viewBox="0 0 400 270" className={`overflow-visible ${className}`} role="img" aria-label={label}>
      <line
        ref={laneRef}
        x1="20"
        y1="254"
        x2="380"
        y2="254"
        className="stroke-accent"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 22"
        style={{ opacity: 0, transition: "opacity 0.4s" }}
      />
      <g fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {strokesOf("still")}
        {strokesOf("tail")}
        {MOVING.map((part) => (
          <g
            key={part}
            ref={(el) => {
              groupRefs.current[part] = el;
            }}
          >
            {strokesOf(part)}
          </g>
        ))}
      </g>
      <circle ref={penRef} cx="30" cy="222" r="5" className="fill-accent" />
    </svg>
  );
}
