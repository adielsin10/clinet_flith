/*import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [flights, setFlights] = useState([]);
  const [expandedFlightId, setExpandedFlightId] = useState(null); // מזהה טיסה מורחבת
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

  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId((prevId) => (prevId === flightId ? null : flightId));
  };

  const handleBookNow = (flight) => {
    alert(`Booking flight: ${flight.airline} from ${flight.from} to ${flight.to}`);
    // כאן אפשר להוסיף לוגיקה להזמנה בפועל
  };

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id} style={{ marginBottom: '10px' }}>
            <strong>{flight.airline}</strong> - {flight.from} to {flight.to} - ${flight.price}
            <button onClick={() => toggleFlightDetails(flight.id)}>
              {expandedFlightId === flight.id ? '-' : '+'}
            </button>
            <button onClick={() => handleBookNow(flight)} style={{ marginLeft: '10px' }}>
              Book Now
            </button>
            {expandedFlightId === flight.id && (
              <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <p><strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}</p>
                <p><strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}</p>
                <p><strong>Baggage Allowance:</strong> {flight.baggageAllowance}</p>
                <p><strong>Duration:</strong> {flight.flightDuration}</p>
                <p><strong>Seat Type:</strong> {flight.seatType}</p>
                <p><strong>Transit Stops:</strong> {flight.transitStops}</p>
                <p><strong>In-Flight Meals:</strong> {flight.inFlightMeals}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
*/