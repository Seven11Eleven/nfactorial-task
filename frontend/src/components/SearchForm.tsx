import React from 'react';
import Label from './ui/Label';
import Input  from './ui/Input';
import Button  from './ui/Button';

interface Props {
    lat: number;
    lng: number;
    radius: number;
    setLat: (lat: number) => void;
    setLng: (lng: number) => void;
    setRadius: (radius: number) => void;
    onSearch: () => void;
}

const SearchForm: React.FC<Props> = ({ lat, lng, radius, setLat, setLng, setRadius, onSearch }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
            <Label htmlFor="latitude">Широта:</Label>
            <Input
                id="latitude"
                type="number"
                value={lat}
                onChange={e => setLat(parseFloat(e.target.value))}
            />
        </div>
        <div>
            <Label htmlFor="longitude">Долгота:</Label>
            <Input
                id="longitude"
                type="number"
                value={lng}
                onChange={e => setLng(parseFloat(e.target.value))}
            />
        </div>
        <div>
            <Label htmlFor="radius">Радиус (метры):</Label>
            <Input
                id="radius"
                type="number"
                value={radius}
                onChange={e => setRadius(parseInt(e.target.value, 10))}
            />
        </div>
        <div className="sm:col-span-3">
            <Button onClick={onSearch}>Найти рестораны</Button>
        </div>
    </div>
);

export default SearchForm;