import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Card, CardContent } from '../components/ui/Card';

interface Props {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ restaurant }) => (
    <Card className="h-full">
        <CardContent>
            <div className="flex items-center mb-2">
                {restaurant.icon && (
                    <img src={restaurant.icon} alt="icon" className="w-6 h-6 mr-2" />
                )}
                <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            </div>
            <p className="flex items-center mb-1">
                {Array.from({ length: Math.round(restaurant.rating) }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500" />
                ))}
                <span className="ml-2">{restaurant.rating}</span>
                {restaurant.user_ratings_total && (
                    <span className="ml-1 text-sm text-gray-500">({restaurant.user_ratings_total})</span>
                )}
            </p>
            <p className="mb-1">{restaurant.vicinity}</p>
            {restaurant.opening_hours && (
                <p className={
                    restaurant.opening_hours.open_now ? 'text-green-600 font-bold' : 'text-red-600'
                }>
                    {restaurant.opening_hours.open_now ? 'Открыто' : 'Закрыто'}
                </p>
            )}
            <div className="mt-2 flex flex-wrap">
                {restaurant.types.map(type => (
                    <span key={type} className="text-xs bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2">
            {type}
          </span>
                ))}
            </div>
            {restaurant.geometry && (
                <p className="text-sm text-blue-500 mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <a
                        href={`https://2gis.kz/almaty/search/${restaurant.geometry.location.lat}%2C${restaurant.geometry.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {restaurant.geometry.location.lat.toFixed(5)}, {restaurant.geometry.location.lng.toFixed(5)}
                    </a>
                </p>
            )}
        </CardContent>
    </Card>
);

export default RestaurantCard;