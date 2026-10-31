import type { CabinetTypeId } from "@/lib/builder";

// A front elevation of the cabinet, drawn to scale (90px to the metre) the way a shop drawing
// shows it: floor line, carcass, doors and drawers, and a dimension line for the width.

const S = 90; // px per metre
const VIEW_W = 600;
const GROUND = 248;
const EDGE = "rgba(28,31,38,0.55)";

/** Dark handles on light finishes, light handles on dark ones. */
function handleColour(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.55 ? "rgba(28,31,38,0.7)" : "rgba(255,255,255,0.75)";
}

const fillTransition = { transition: "fill 420ms cubic-bezier(0.22, 1, 0.36, 1)" };

function y(m: number) {
  return GROUND - m * S;
}

function Kitchen({ x0, w, finish, counter }: { x0: number; w: number; finish: string; counter: string }) {
  const n = Math.max(2, Math.round(w / 0.6));
  const mw = (w * S) / n;
  const handle = handleColour(finish);
  const panel = { fill: finish, stroke: EDGE, strokeWidth: 1.25, style: fillTransition };
  // The range hood replaces the middle wall cabinet once there are four or more bays.
  const hood = n >= 4 ? Math.floor(n / 2) : -1;

  return (
    <g>
      {/* backsplash in the countertop material */}
      <rect x={x0} y={y(1.45)} width={w * S} height={y(0.9) - y(1.45)} style={{ fill: counter, opacity: 0.45, ...fillTransition }} />
      {/* plinth */}
      <rect x={x0 + 4} y={y(0.1)} width={w * S - 8} height={0.1 * S} fill="rgba(28,31,38,0.22)" />
      {/* base cabinets */}
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * mw;
        const top = y(0.86);
        const h = y(0.1) - top;
        if (i === 0) {
          // a drawer stack at the left end
          return (
            <g key={i}>
              {[0, 1, 2].map((d) => (
                <g key={d}>
                  <rect x={x + 1.5} y={top + (d * h) / 3 + 1.5} width={mw - 3} height={h / 3 - 3} {...panel} />
                  <rect x={x + mw / 2 - 12} y={top + (d * h) / 3 + 9} width={24} height={3} rx={1.5} fill={handle} />
                </g>
              ))}
            </g>
          );
        }
        return (
          <g key={i}>
            <rect x={x + 1.5} y={top + 1.5} width={mw - 3} height={h - 3} {...panel} />
            <rect x={x + mw / 2 - 12} y={top + 10} width={24} height={3} rx={1.5} fill={handle} />
          </g>
        );
      })}
      {/* countertop, overhanging a little */}
      <rect x={x0 - 4} y={y(0.92)} width={w * S + 8} height={y(0.86) - y(0.92)} stroke={EDGE} strokeWidth={1.25} style={{ fill: counter, ...fillTransition }} />
      {/* wall cabinets */}
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * mw;
        if (i === hood) {
          return (
            <path
              key={i}
              d={`M${x + mw * 0.3} ${y(2.15)} H${x + mw * 0.7} V${y(1.75)} L${x + mw - 4} ${y(1.62)} H${x + 4} L${x + mw * 0.3} ${y(1.75)} Z`}
              fill="rgba(28,31,38,0.16)"
              stroke={EDGE}
              strokeWidth={1.25}
            />
          );
        }
        return (
          <g key={i}>
            <rect x={x + 1.5} y={y(2.15) + 1.5} width={mw - 3} height={y(1.45) - y(2.15) - 3} {...panel} />
            <rect x={x + mw / 2 - 12} y={y(1.45) - 12} width={24} height={3} rx={1.5} fill={handle} />
          </g>
        );
      })}
    </g>
  );
}

function Wardrobe({ x0, w, finish }: { x0: number; w: number; finish: string }) {
  const n = Math.max(2, Math.round(w / 0.45));
  const dw = (w * S) / n;
  const handle = handleColour(finish);
  const panel = { fill: finish, stroke: EDGE, strokeWidth: 1.25, style: fillTransition };
  return (
    <g>
      <rect x={x0 + 4} y={y(0.1)} width={w * S - 8} height={0.1 * S} fill="rgba(28,31,38,0.22)" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * dw;
        // Doors open in pairs, so handles sit where two doors meet.
        const hx = i % 2 === 0 ? x + dw - 10 : x + 7;
        return (
          <g key={i}>
            <rect x={x + 1.5} y={y(2.4) + 1.5} width={dw - 3} height={y(2.0) - y(2.4) - 3} {...panel} />
            <rect x={x + 1.5} y={y(2.0) + 1.5} width={dw - 3} height={y(0.1) - y(2.0) - 3} {...panel} />
            <rect x={hx} y={y(1.25)} width={3} height={36} rx={1.5} fill={handle} />
          </g>
        );
      })}
    </g>
  );
}

/** Clothes on a rail: narrow soft shapes spaced across one bay. */
function garments(x: number, bw: number, top: number, height: number, fill: string) {
  const n = Math.max(3, Math.floor(bw / 14));
  return Array.from({ length: n }, (_, k) => (
    <rect key={k} x={x + 10 + (k * (bw - 26)) / n} y={top} width={10} height={height} rx={3} fill={fill} />
  ));
}

function WalkIn({ x0, w, finish }: { x0: number; w: number; finish: string }) {
  const n = Math.max(2, Math.round(w / 0.9));
  const bw = (w * S) / n;
  const handle = handleColour(finish);
  const board = { fill: finish, stroke: EDGE, strokeWidth: 1, style: fillTransition };
  const cloth = "rgba(31,58,95,0.18)";

  return (
    <g>
      {/* back wall of the bays */}
      <rect x={x0} y={y(2.4)} width={w * S} height={2.4 * S} fill="rgba(28,31,38,0.05)" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * bw;
        const kind = i % 3; // long hang, shelves, double hang
        return (
          <g key={i}>
            {kind === 0 && (
              <>
                <rect x={x + 4} y={y(2.15)} width={bw - 8} height={5} {...board} />
                <line x1={x + 6} x2={x + bw - 6} y1={y(2.02)} y2={y(2.02)} stroke={EDGE} strokeWidth={2.5} />
                {garments(x, bw, y(1.98), 1.25 * S, cloth)}
                {[0, 1, 2].map((d) => (
                  <g key={d}>
                    <rect x={x + 4} y={y(0.6) + d * 0.17 * S + 2} width={bw - 8} height={0.17 * S - 3} {...board} />
                    <rect x={x + bw / 2 - 10} y={y(0.6) + d * 0.17 * S + 8} width={20} height={3} rx={1.5} fill={handle} />
                  </g>
                ))}
              </>
            )}
            {kind === 1 &&
              [0.1, 0.5, 0.9, 1.3, 1.7, 2.1].map((h, k) => (
                <g key={h}>
                  <rect x={x + 4} y={y(h)} width={bw - 8} height={5} {...board} />
                  {k < 5 && <rect x={x + 12 + (k % 2) * 10} y={y(h) - 18} width={bw * 0.45} height={18} rx={2} fill={cloth} />}
                </g>
              ))}
            {kind === 2 &&
              [2.15, 1.15].map((h) => (
                <g key={h}>
                  <rect x={x + 4} y={y(h)} width={bw - 8} height={5} {...board} />
                  <line x1={x + 6} x2={x + bw - 6} y1={y(h - 0.12)} y2={y(h - 0.12)} stroke={EDGE} strokeWidth={2.5} />
                  {garments(x, bw, y(h - 0.16), 0.75 * S, cloth)}
                </g>
              ))}
            {/* side panel on the left of every bay */}
            <rect x={x - 2} y={y(2.4)} width={4} height={2.4 * S} {...board} />
          </g>
        );
      })}
      <rect x={x0 + w * S - 2} y={y(2.4)} width={4} height={2.4 * S} {...board} />
      <rect x={x0 - 2} y={y(2.4) - 5} width={w * S + 4} height={6} {...board} />
      <rect x={x0 + 2} y={y(0.1)} width={w * S - 4} height={0.1 * S} {...board} />
    </g>
  );
}

export function CabinetElevation({
  type,
  width,
  finish,
  counter,
  label,
}: {
  type: CabinetTypeId;
  width: number;
  finish: string;
  counter: string;
  label: string;
}) {
  const x0 = (VIEW_W - width * S) / 2;
  const x1 = x0 + width * S;
  const dimY = GROUND + 26;

  return (
    <svg viewBox={`0 0 ${VIEW_W} 300`} className="h-auto w-full" role="img" aria-label={label}>
      {type === "kitchen" && <Kitchen x0={x0} w={width} finish={finish} counter={counter} />}
      {type === "wardrobe" && <Wardrobe x0={x0} w={width} finish={finish} />}
      {type === "walk-in" && <WalkIn x0={x0} w={width} finish={finish} />}

      {/* floor */}
      <line x1={12} x2={VIEW_W - 12} y1={GROUND} y2={GROUND} stroke="var(--ink)" strokeWidth={2} />

      {/* width dimension */}
      <g stroke="var(--primary)" strokeWidth={1.25}>
        <line x1={x0} x2={x1} y1={dimY} y2={dimY} />
        <line x1={x0} x2={x0} y1={dimY - 7} y2={dimY + 7} />
        <line x1={x1} x2={x1} y1={dimY - 7} y2={dimY + 7} />
      </g>
      <text x={(x0 + x1) / 2} y={dimY + 20} textAnchor="middle" className="fill-primary text-[24px] font-semibold sm:text-[15px]">
        {width.toFixed(1)} m
      </text>
    </svg>
  );
}
