"use client";

import type { SeatingConfig } from "@/lib/seatmap-types";

interface MiniSeatmapProps {
  seatingConfig: SeatingConfig;
  seatingType: "zone_map" | "seat_map";
  seatLabel: string;
  className?: string;
}

/**
 * Build an SVG polygon `points` attribute from coordinate pairs.
 * Coordinates are scaled from the original image dimensions to the
 * rendered container size via a viewBox, so we can use them directly.
 */
function toSvgPoints(points: [number, number][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function MiniSeatmap({
  seatingConfig,
  seatingType,
  seatLabel,
  className = "",
}: MiniSeatmapProps) {
  const { image_url, image_width, image_height, zones, sections } =
    seatingConfig;

  // Fallback: if no image or no config data, show a simple text badge
  if (!image_url || (!zones?.length && !sections?.length)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
        {seatingType === "zone_map" ? "Zone" : "Seat"}: {seatLabel}
      </span>
    );
  }

  const viewBox = `0 0 ${image_width} ${image_height}`;

  // ---------- zone_map mode ----------
  if (seatingType === "zone_map" && zones?.length) {
    // Find the matching zone — match by zone name against the seat_label
    // (for zone_map, seat_label stores the zone name the user purchased)
    const matchedZone = zones.find((z) => z.name === seatLabel);

    // If no zone matched, fall back to text badge
    if (!matchedZone) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
          Zone: {seatLabel}
        </span>
      );
    }

    return (
      <div
        className={`relative inline-block overflow-hidden rounded-lg border border-gray-200 ${className}`}
        style={{ width: 200 }}
      >
        <svg
          viewBox={viewBox}
          className="block w-full h-auto"
          style={{ background: `url(${image_url}) center/cover no-repeat` }}
        >
          {/* Dim overlay for non-matching zones */}
          {zones.map((zone) => {
            const isMatch = zone.id === matchedZone.id;
            return zone.polygons.map((poly) => (
              <polygon
                key={poly.id}
                points={toSvgPoints(poly.points)}
                fill={isMatch ? matchedZone.color : "#000"}
                fillOpacity={isMatch ? 0.4 : 0.5}
                stroke={isMatch ? matchedZone.color : "transparent"}
                strokeWidth={isMatch ? 3 : 0}
              />
            ));
          })}
        </svg>
        {/* Zone name label */}
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {matchedZone.name}
        </span>
      </div>
    );
  }

  // ---------- seat_map mode ----------
  if (seatingType === "seat_map") {
    // Seats can live inside zones.polygons.seats or sections.seats
    let matchedSeat: { x: number; y: number; label: string } | null = null;
    const allSeats: { x: number; y: number; label: string; isMatch: boolean }[] = [];

    // Collect seats from zones (zone_map with per-seat)
    if (zones?.length) {
      for (const zone of zones) {
        for (const poly of zone.polygons) {
          if (poly.seats) {
            for (const seat of poly.seats) {
              const isMatch = seat.label === seatLabel;
              allSeats.push({ x: seat.x, y: seat.y, label: seat.label, isMatch });
              if (isMatch) matchedSeat = seat;
            }
          }
        }
      }
    }

    // Collect seats from sections
    if (sections?.length) {
      for (const section of sections) {
        for (const seat of section.seats) {
          const isMatch = seat.label === seatLabel;
          allSeats.push({ x: seat.x, y: seat.y, label: seat.label, isMatch });
          if (isMatch) matchedSeat = seat;
        }
      }
    }

    // If no seat matched, fall back to text badge
    if (!matchedSeat) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
          Seat: {seatLabel}
        </span>
      );
    }

    // Compute the seat dot radius relative to image size
    const seatRadius = Math.max(image_width, image_height) * 0.012;
    const highlightRadius = seatRadius * 2;

    return (
      <div
        className={`relative inline-block overflow-hidden rounded-lg border border-gray-200 ${className}`}
        style={{ width: 200 }}
      >
        <svg
          viewBox={viewBox}
          className="block w-full h-auto"
          style={{ background: `url(${image_url}) center/cover no-repeat` }}
        >
          {/* Render all seats as dots */}
          {allSeats.map((seat, i) =>
            seat.isMatch ? (
              <g key={i}>
                {/* Pulsing highlight ring */}
                <circle
                  cx={seat.x}
                  cy={seat.y}
                  r={highlightRadius}
                  fill="rgba(99, 102, 241, 0.25)"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
                {/* Seat dot */}
                <circle
                  cx={seat.x}
                  cy={seat.y}
                  r={seatRadius}
                  fill="#6366f1"
                />
              </g>
            ) : (
              <circle
                key={i}
                cx={seat.x}
                cy={seat.y}
                r={seatRadius}
                fill="#9ca3af"
                fillOpacity={0.4}
              />
            )
          )}
        </svg>
        {/* Seat label */}
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Seat {seatLabel}
        </span>
      </div>
    );
  }

  // Fallback for unexpected cases
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
      {seatLabel}
    </span>
  );
}
