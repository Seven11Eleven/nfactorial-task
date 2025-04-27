export interface Location {
    lat: number;
    lng: number;
}

export interface OpeningHours {
    open_now: boolean;
}

export interface Restaurant {
    place_id: string;
    name: string;
    rating: number;
    user_ratings_total?: number;
    vicinity: string;
    types: string[];
    icon?: string;
    opening_hours?: OpeningHours;
    geometry?: { location: Location };
}