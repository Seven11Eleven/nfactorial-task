import React from 'react';
import RestaurantsNearby from './pages/RestaurantsNearby';
import './index.css';

const App: React.FC = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <RestaurantsNearby />
      </div>
  );
};

export default App;
