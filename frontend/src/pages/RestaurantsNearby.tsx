import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import RestaurantCard from '../components/RestaurantCard';
import Spinner from '../components/Spinner';
import { getRestaurants } from '../services/api';
import { Restaurant } from '../types/restaurant';

const RestaurantsNearby: React.FC = () => {
    const [lat, setLat] = useState<number>(43.245239);
    const [lng, setLng] = useState<number>(76.937296);
    const [radius, setRadius] = useState<number>(4500);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async (latitude: number, longitude: number, rad: number) => {
        setLoading(true);
        setError('');
        try {
            const data = await getRestaurants(latitude, longitude, rad);
            setRestaurants(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLng(longitude);
                    fetchData(latitude, longitude, radius);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    fetchData(lat, lng, radius);
                }
            );
        } else {
            fetchData(lat, lng, radius);
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Рестораны поблизости</h1>
            <SearchForm
                lat={lat}
                lng={lng}
                radius={radius}
                setLat={setLat}
                setLng={setLng}
                setRadius={setRadius}
                onSearch={() => fetchData(lat, lng, radius)}
            />
            {loading && <Spinner />}
            {error && <div className="text-red-500 mb-4">Ошибка: {error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {!loading && !error && restaurants.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        Рестораны не найдены. Попробуйте изменить параметры поиска.
                    </div>
                )}
                {restaurants.map((r) => (
                    <RestaurantCard key={r.place_id} restaurant={r} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantsNearby;