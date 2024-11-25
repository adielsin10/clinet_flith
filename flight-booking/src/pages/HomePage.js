import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    const from = e.target.departure ? e.target.departure.value : '';
    const to = e.target.destination ? e.target.destination.value : '';
    const date = e.target.date ? e.target.date.value : '';
    const maxPrice = e.target.maxPrice ? e.target.maxPrice.value : '';

    const queryParams = new URLSearchParams({
      from,
      to,
      maxPrice,
    });

    navigate(`/results?${queryParams.toString()}`);
  };

  return (
    <div>
      <h1>Flight Booking</h1>
      <form onSubmit={handleSearch}>
        <label>
          Departure:
          <input type="text" name="departure" />
        </label>
        <label>
          Destination:
          <input type="text" name="destination" />
        </label>
        <label>
          Date:
          <input type="date" name="date" />
        </label>
        <label>
          Max Price:
          <input type="number" name="maxPrice" placeholder="Enter max price" />
        </label>
        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
};

export default HomePage;
