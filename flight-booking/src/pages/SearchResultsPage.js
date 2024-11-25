import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [flights, setFlights] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/flights${location.search}`);
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, [location.search]);

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            <strong>{flight.airline}</strong> - {flight.from} to {flight.to} - ${flight.price}
            <button>Book Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
