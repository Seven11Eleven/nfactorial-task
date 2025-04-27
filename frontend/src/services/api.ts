import { Restaurant } from '../types/restaurant';

const API_URL =
    process.env.NODE_ENV === 'development'
        ? 'https://276c96f8e6c10fec351427b0101c6048.serveo.net/restaurants'
        : '/restaurants';

export async function getRestaurants(
    lat: number,
    lng: number,
    radius: number
): Promise<Restaurant[]> {
    const res = await fetch(`${API_URL}?lat=${lat}&lng=${lng}&radius=${radius}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
}