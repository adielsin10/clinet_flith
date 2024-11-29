import React, { useState, useEffect } from 'react';
import axios from 'axios';

// פונקציה להמיר את התאריך לפורמט dd/mm/yyyy
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const HomePage = () => {
  const [flights, setFlights] = useState([]); // רשימת הטיסות
  const [expandedFlightId, setExpandedFlightId] = useState(null); // מזהה הטיסה המורחבת
  const [bookingData, setBookingData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
  }); // מידע להזמנה
  const [selectedFlightId, setSelectedFlightId] = useState(null); // הטיסה שנבחרה להזמנה
  const [bookingSuccess, setBookingSuccess] = useState(false); // האם ההזמנה הצליחה

  // פונקציה לחיפוש טיסות
  const fetchFlights = async (searchParams) => {
    try {
      const response = await axios.get('http://localhost:5000/api/flights', {
        params: searchParams,
      });
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  // ברירת מחדל הצגת כל הטיסות
  useEffect(() => {
    fetchFlights({}); // הצגת כל הטיסות כברירת מחדל
  }, []);

  // פונקציה לטיפול בחיפוש
  const handleSearch = (e) => {
    e.preventDefault();

    const from = e.target.departure ? e.target.departure.value : ''; // בדוק אם השדה קיים
    const to = e.target.destination ? e.target.destination.value : ''; // בדוק אם השדה קיים
    const departureDate = e.target.departureDate ? e.target.departureDate.value : ''; // בדוק אם השדה קיים
    const arrivalDate = e.target.arrivalDate ? e.target.arrivalDate.value : ''; // בדוק אם השדה קיים
    const maxPrice = e.target.maxPrice ? e.target.maxPrice.value : ''; // בדוק אם השדה קיים

    const searchParams = {
      from,
      to,
      departureDate,
      arrivalDate,
      maxPrice,
    };

    fetchFlights(searchParams); // קריאה לפונקציה שמבצעת את החיפוש
  };

  // פונקציה להרחבת פרטי טיסה
  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId((prevId) => (prevId === flightId ? null : flightId));
  };

  // פונקציה עדכון שדות טופס ההזמנה
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // פונקציה להזמנה
  const handleBookNow = async () => {
    // בדוק אם כל השדות מולאו
    if (!bookingData.name || !bookingData.lastName || !bookingData.phone || !bookingData.email || !selectedFlightId) {
      alert('All fields are required!');
      return;
    }

    try {
      // נתוני ההזמנה
      const reservationData = {
        flightId: selectedFlightId,  // ה-flightId הנבחר
        name: bookingData.name,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        email: bookingData.email,
      };

      // קריאה ל-API של ההזמנה
      const response = await axios.post('http://localhost:5000/api/reservations', reservationData);
      console.log('Reservation response:', response.data);  // הדפסת תשובה מהשרת
      setBookingSuccess(true);
      alert('Booking successful!');
      
      // איפוס הטופס
      setBookingData({ name: '', lastName: '', phone: '', email: '' });
      setSelectedFlightId(null);  // סגור את טופס ההזמנה אחרי הצלחה
    } catch (error) {
      console.error('Error booking flight:', error);
      alert('Booking failed');
    }
  };

  // פונקציה לפתיחת וסגירת פרטי ההזמנה
  const toggleBookingForm = (flightId) => {
    if (selectedFlightId === flightId) {
      setSelectedFlightId(null); // סגור את טופס ההזמנה אם נלחץ שוב על אותה טיסה
    } else {
      setSelectedFlightId(flightId); // פתח את טופס ההזמנה
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: '800px' }}>
      <h1 style={{ fontWeight: 'bold', color: '#28a745', textAlign: 'center' }}>Flight Booking</h1>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          Departure:
          <input type="text" name="departure" style={inputStyle} />
        </label>
        <label>
          Destination:
          <input type="text" name="destination" style={inputStyle} />
        </label>
        <label>
          Departure Date:
          <input type="date" name="departureDate" style={inputStyle} />
        </label>
        <label>
          Arrival Date:
          <input type="date" name="arrivalDate" style={inputStyle} />
        </label>
        <label>
          Max Price:
          <input type="number" name="maxPrice" placeholder="Enter max price" style={inputStyle} />
        </label>
        <button type="submit" style={buttonStyle}>Search Flights</button>
      </form>

      <h2 style={{ color: '#28a745', textAlign: 'center' }}>Available Flights</h2>
      
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {flights.map((flight) => (
          <li key={flight.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{flight.airline}</strong> - {flight.from_location} to {flight.to_location} (${flight.price})
              </div>
              <div>
                <button onClick={() => toggleFlightDetails(flight.id)} style={expandButtonStyle}>
                  {expandedFlightId === flight.id ? '➖' : '➕'}
                </button>
                <button onClick={() => toggleBookingForm(flight.id)} style={bookButtonStyle}>
                  Book Now
                </button>
              </div>
            </div>

            {expandedFlightId === flight.id && (
              <div style={{ marginTop: '10px' }}>
                <p><strong>Departure:</strong> {formatDate(flight.departure_date)} at {flight.departure_time}</p>
                <p><strong>Arrival:</strong> {formatDate(flight.arrival_date)} at {flight.arrival_time}</p>
                <p><strong>Baggage Allowance:</strong> {flight.baggage_allowance}</p>
                <p><strong>Duration:</strong> {flight.flight_duration}</p>
                <p><strong>Seat Type:</strong> {flight.seat_type}</p>
                <p><strong>Transit Stops:</strong> {flight.transit_stops}</p>
                <p><strong>In-Flight Meals:</strong> {flight.in_flight_meals}</p>
              </div>
            )}

            {selectedFlightId === flight.id && (
              <div style={{ marginTop: '10px' }}>
                <h3 style={{ color: '#28a745' }}>Enter your details to complete the booking:</h3>
                <form>
                  <label>
                    First Name:
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingInputChange}
                      style={inputStyle}
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      name="lastName"
                      value={bookingData.lastName}
                      onChange={handleBookingInputChange}
                      style={inputStyle}
                    />
                  </label>
                  <label>
                    Phone Number:
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingInputChange}
                      style={inputStyle}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleBookingInputChange}
                      style={inputStyle}
                    />
                  </label>
                  <button type="button" onClick={handleBookNow} style={buttonStyle}>
                    Confirm Booking
                  </button>
                  {bookingSuccess && <p style={{ color: 'green' }}>Booking successful!</p>}
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// עיצוב הכפתורים והשדות
const buttonStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
  borderRadius: '5px',
  marginTop: '10px',
};

const inputStyle = {
  padding: '8px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%',
  marginBottom: '10px',
};

const expandButtonStyle = {
  fontSize: '20px',
  backgroundColor: 'transparent',
  color: '#007bff',
  border: 'none',
  cursor: 'pointer',
};

const bookButtonStyle = {
  fontSize: '16px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 15px',
};

export default HomePage;
