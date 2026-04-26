export type SeatingMode =
  | "general_admission"
  | "assigned_seating"
  | "zone_admission"
  | "zone_map"
  | "seat_map";

export interface ZonePolygon {
  id: string;
  points: [number, number][];
  seats?: SeatDefinition[];
}

export interface ZoneDefinition {
  id: string;
  tier_id: string;
  name: string;
  color: string;
  polygons: ZonePolygon[];
}

export interface SeatDefinition {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface SectionDefinition {
  id: string;
  tier_id: string;
  name: string;
  color: string;
  points: [number, number][];
  seats: SeatDefinition[];
}

export interface SeatingConfig {
  image_url: string | null;
  image_width: number;
  image_height: number;
  view_mode: "image_overlay" | "schematic";
  zones?: ZoneDefinition[];
  sections?: SectionDefinition[];
}
