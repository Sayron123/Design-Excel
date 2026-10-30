"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ADDRESS, SHOWROOM_LAT, SHOWROOM_LNG } from "@/lib/site";
import { buttonClass } from "@/components/ui/button";

type Mode = "driving" | "transit" | "walking";
type LatLng = { lat: number; lng: number };

const MODES: { id: Mode; label: string }[] = [
  { id: "driving", label: "Drive" },
  { id: "transit", label: "Commute" },
  { id: "walking", label: "Walk" },
];

const SHOWROOM: LatLng = { lat: SHOWROOM_LAT, lng: SHOWROOM_LNG };
const MY_LOCATION = "My location";

// Esri dark grey basemap: no API key needed for a demo. Before launch, use it under an ArcGIS account
// or swap in a licensed provider (Google Maps, Mapbox, MapTiler) with your own key.
const TILE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";

const PIN_HTML = `
  <div class="flex flex-col items-center">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink ring-4 ring-accent/30">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7z"/></svg>
    </div>
    <div class="mt-1.5 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[14px] font-semibold text-white">Design Excellence</div>
  </div>`;

/** Straight-line distance in kilometres (haversine). */
function distanceKm(a: LatLng, b: LatLng) {
  const r = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink/90 text-white ring-1 ring-white/15 transition-colors hover:bg-primary"
    >
      {children}
    </button>
  );
}

export function ShowroomMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const routeLayer = useRef<Leaflet.LayerGroup | null>(null);

  const [mode, setMode] = useState<Mode>("driving");
  const [origin, setOrigin] = useState("");
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied">("idle");

  // Leaflet panes use z-index 400–1000; "isolate" on the card keeps them below the sticky navbar.
  // Create the map once, on the client only (Leaflet needs window).
  useEffect(() => {
    let cancelled = false;
    let map: Leaflet.Map | null = null;

    (async () => {
      const mod = await import("leaflet");
      const L = ("default" in mod ? (mod as unknown as { default: typeof Leaflet }).default : mod) as typeof Leaflet;
      if (cancelled || !mapEl.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map = L.map(mapEl.current, {
        center: [SHOWROOM.lat, SHOWROOM.lng],
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: false, // the page keeps the wheel; zoom with the buttons or pinch
        zoomAnimation: !reduce,
        fadeAnimation: !reduce,
        markerZoomAnimation: !reduce,
      });
      L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxNativeZoom: 16, maxZoom: 18 }).addTo(map);
      L.marker([SHOWROOM.lat, SHOWROOM.lng], {
        icon: L.divIcon({ className: "", html: PIN_HTML, iconSize: [140, 76], iconAnchor: [70, 20] }),
        keyboard: false,
        title: `Design Excellence showroom, ${ADDRESS}`,
      }).addTo(map);
      routeLayer.current = L.layerGroup().addTo(map);

      leafletRef.current = L;
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw the visitor's position and a straight dashed line to the showroom.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = routeLayer.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    if (!userPos) return;

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim();
    const locateColour = css.getPropertyValue("--locate").trim();

    L.polyline(
      [
        [userPos.lat, userPos.lng],
        [SHOWROOM.lat, SHOWROOM.lng],
      ],
      { color: accent, weight: 3, dashArray: "6 8", opacity: 0.9 },
    ).addTo(layer);
    L.circleMarker([userPos.lat, userPos.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 3,
      fillColor: locateColour,
      fillOpacity: 1,
    }).addTo(layer);
    map.fitBounds(
      L.latLngBounds([userPos.lat, userPos.lng], [SHOWROOM.lat, SHOWROOM.lng]),
      { padding: [60, 60], maxZoom: 16 },
    );
  }, [userPos]);

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOrigin(MY_LOCATION);
        setStatus("idle");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  function recenter() {
    mapRef.current?.setView([SHOWROOM.lat, SHOWROOM.lng], 16);
  }

  const originParam =
    origin === MY_LOCATION && userPos ? `${userPos.lat},${userPos.lng}` : origin.trim();
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM.lat},${SHOWROOM.lng}&travelmode=${mode}` +
    (originParam ? `&origin=${encodeURIComponent(originParam)}` : "");

  const km = userPos ? distanceKm(userPos, SHOWROOM) : null;

  return (
    <div data-ui className="isolate overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
      {/* From / to */}
      <div className="grid gap-2 p-3 sm:grid-cols-2 md:p-4">
        <label className="flex h-12 items-center gap-3 rounded-lg bg-ink px-4 ring-1 ring-white/10 focus-within:ring-accent">
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-locate" />
          <span className="sr-only">Starting point</span>
          <input
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              if (userPos) setUserPos(null);
            }}
            placeholder="Your area or address"
            className="w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
          />
        </label>
        <div className="flex h-12 items-center gap-3 rounded-lg bg-ink px-4 ring-1 ring-white/10">
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          <span className="truncate text-base font-semibold text-white">Design Excellence, Manresa, QC</span>
        </div>
      </div>

      {/* Travel mode */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 pb-3 md:px-4">
        <div role="group" aria-label="Travel mode" className="flex gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`h-9 rounded-lg px-3.5 text-[14px] font-semibold transition-colors ${
                mode === m.id ? "bg-bg text-primary" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={locate}
          className={buttonClass("glass", "sm", "h-9")}
        >
          {status === "locating" ? "Locating…" : "Use my location"}
        </button>
      </div>

      {/* Map */}
      <div className="relative">
        <div
          ref={mapEl}
          className="h-72 w-full bg-ink md:h-80 lg:h-[22rem]"
          role="region"
          aria-label={`Map showing the Design Excellence showroom at ${ADDRESS}`}
        />
        <div className="absolute right-3 top-3 z-500 flex flex-col gap-2">
          <MapButton label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </MapButton>
          <MapButton label="Zoom out" onClick={() => mapRef.current?.zoomOut()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M5 12h14" />
            </svg>
          </MapButton>
          <MapButton label="Centre on showroom" onClick={recenter}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </MapButton>
        </div>
      </div>

      {/* Summary + action */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">
            {km !== null ? `About ${km < 10 ? km.toFixed(1) : Math.round(km)} km away` : "Our showroom"}
          </p>
          <p className="text-[14px] text-white/80">
            {status === "denied"
              ? "Location is off. Type your area instead."
              : km !== null
                ? "Straight-line distance. Get directions for the real route and time."
                : ADDRESS}
          </p>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-bg px-5 text-base font-semibold text-primary transition-colors hover:bg-white"
        >
          Get directions
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
