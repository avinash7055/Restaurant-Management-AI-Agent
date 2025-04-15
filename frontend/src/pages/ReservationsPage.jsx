import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ReservationsPageContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h1 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }

  p {
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const AvailabilitySection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  margin-top: 20px;
`;

const DateSelector = styled.div`
  margin-bottom: 20px;

  h3 {
    margin-bottom: 10px;
    color: var(--primary-color);
  }

  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: 'Poppins', sans-serif;
  }
`;

const TimeSlots = styled.div`
  h3 {
    margin-bottom: 10px;
    color: var(--primary-color);
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 15px;
`;

const TimeSlot = styled.div`
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  background-color: ${props => props.available ? '#e8f5e9' : '#f5f5f5'};
  color: ${props => props.available ? 'var(--primary-color)' : '#999'};
  border: 1px solid ${props => props.available ? 'var(--primary-color)' : '#ddd'};
  opacity: ${props => props.available ? 1 : 0.7};

  .time {
    font-weight: 600;
  }

  .availability {
    font-size: 0.8rem;
    margin-top: 5px;
  }
`;

const ReservationInfo = styled.div`
  margin-top: 30px;
  text-align: center;

  p {
    margin-bottom: 15px;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #d32f2f;

  button {
    margin-top: 15px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const ReservationsList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const ReservationsHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 20px;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const ReservationsContent = styled.div`
  padding: 20px;
`;

const ReservationItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 80px; /* Add space for the edit button */

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--primary-color);
  }

  span {
    font-weight: 500;
  }
`;

const ReservationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;

  .detail {
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;

    .label {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 5px;
    }

    .value {
      font-weight: 500;
      color: var(--text-color);
    }
  }
`;

const NoReservations = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;

  a {
    display: inline-block;
    margin-top: 15px;
    color: white;
    background-color: var(--primary-color);
    padding: 8px 15px;
    border-radius: 4px;
    text-decoration: none;

    &:hover {
      background-color: var(--secondary-color);
    }
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  z-index: 5; /* Ensure buttons appear above other content */
`;

const ActionButton = styled.button`
  background-color: ${props => props.danger ? '#f44336' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EditForm = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--text-color);
  }

  input, select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

function ReservationsPage() {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    date: '',
    time: '',
    party_size: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState({});

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const response = await axios.get('/api/availability');
      setAvailability(response.data);

      // Set the first date as selected by default
      if (Object.keys(response.data).length > 0) {
        setSelectedDate(Object.keys(response.data)[0]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability. Please try again later.');
    } finally {
      setLoadingAvailability(false);
    }
  };

  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const response = await axios.get('/api/reservations');
      setReservations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      // Don't set error here to avoid blocking the availability view
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchReservations();
  }, []);

  const formatDate = (dateString) => {
    return dateString;
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation.id);
    setEditFormData({
      customer_name: reservation.customer_name,
      date: reservation.date,
      time: reservation.time,
      party_size: reservation.party_size
    });

    // Load available times for the selected date
    if (availability[reservation.date]) {
      setAvailableTimes(availability[reservation.date]);
    }
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setEditFormData({
      customer_name: '',
      date: '',
      time: '',
      party_size: 1
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date' && value !== editFormData.date) {
      // If date changed, update available times
      if (availability[value]) {
        setAvailableTimes(availability[value]);
      } else {
        setAvailableTimes({});
      }
    }

    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'party_size' ? parseInt(value) : value
    }));
  };

  const handleSubmitEdit = async (reservationId) => {
    setSubmitting(true);
    try {
      const response = await axios.put(`/api/reservations/${reservationId}`, editFormData);

      if (response.data.success) {
        // Update the reservations list with the edited reservation
        setReservations(prevReservations =>
          prevReservations.map(reservation =>
            reservation.id === reservationId ? response.data.reservation : reservation
          )
        );

        // Refresh availability data
        fetchAvailability();

        setEditingReservation(null);
        toast.success('Reservation updated successfully!');
      } else {
        toast.error('Failed to update reservation.');
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
      toast.error('Error updating reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReservationsPageContainer>
      <PageHeader>
        <h1>Table Reservations</h1>
        <p>
          Reserve a table at Green Delight. Check availability and book your preferred time slot.
        </p>
      </PageHeader>

      {/* Availability Section */}
      {loadingAvailability ? (
        <LoadingMessage>Loading availability...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>
          {error}
          <div>
            <button onClick={fetchAvailability}>Try Again</button>
          </div>
        </ErrorMessage>
      ) : Object.keys(availability).length === 0 ? (
        <ErrorMessage>
          No availability information found. Please try again later.
        </ErrorMessage>
      ) : (
        <AvailabilitySection>
          <DateSelector>
            <h3>Select a Date</h3>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {Object.keys(availability).map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </DateSelector>

          <TimeSlots>
            <h3>Available Time Slots</h3>
            <TimeSlotGrid>
              {selectedDate && Object.entries(availability[selectedDate]).map(([time, data]) => (
                <TimeSlot key={time} available={data.available > 0}>
                  <div className="time">{time}</div>
                  <div className="availability">
                    {data.available > 0
                      ? `${data.available} tables available`
                      : 'Fully booked'}
                  </div>
                </TimeSlot>
              ))}
            </TimeSlotGrid>
          </TimeSlots>

          <ReservationInfo>
            <p>To make a reservation, please chat with our AI assistant on the <Link to="/">home page</Link>.</p>
          </ReservationInfo>
        </AvailabilitySection>
      )}

      {/* Your Reservations Section */}
      <ReservationsList>
        <ReservationsHeader>
          <h2>Your Reservations</h2>
        </ReservationsHeader>

        <ReservationsContent>
          {loadingReservations ? (
            <LoadingMessage>Loading your reservations...</LoadingMessage>
          ) : reservations.length === 0 ? (
            <NoReservations>
              You don't have any reservations yet.
              <div>
                <Link to="/">Make a Reservation</Link>
              </div>
            </NoReservations>
          ) : (
            reservations.map((reservation) => (
              <ReservationItem key={reservation.id}>
                <ReservationHeader>
                  <h3>Reservation #{reservation.id}</h3>
                  <span>{new Date(reservation.timestamp).toLocaleString()}</span>
                </ReservationHeader>

                <ActionButtons>
                  {editingReservation === reservation.id ? (
                    <ActionButton
                      onClick={() => handleCancelEdit()}
                      danger
                    >
                      Cancel
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => handleEditClick(reservation)}>
                      Edit
                    </ActionButton>
                  )}
                </ActionButtons>

                {editingReservation === reservation.id ? (
                  <EditForm>
                    <FormGroup>
                      <label>Customer Name</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={editFormData.customer_name}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Date</label>
                      <select
                        name="date"
                        value={editFormData.date}
                        onChange={handleInputChange}
                      >
                        {Object.keys(availability).map((date) => (
                          <option key={date} value={date}>{date}</option>
                        ))}
                      </select>
                    </FormGroup>

                    <FormGroup>
                      <label>Time</label>
                      <select
                        name="time"
                        value={editFormData.time}
                        onChange={handleInputChange}
                      >
                        {Object.entries(availableTimes).map(([time, data]) => (
                          <option
                            key={time}
                            value={time}
                            disabled={data.available === 0 && time !== editFormData.time}
                          >
                            {time} {data.available === 0 && time !== editFormData.time ? '(Fully Booked)' : ''}
                          </option>
                        ))}
                      </select>
                    </FormGroup>

                    <FormGroup>
                      <label>Party Size</label>
                      <input
                        type="number"
                        name="party_size"
                        min="1"
                        max="20"
                        value={editFormData.party_size}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    <FormActions>
                      <ActionButton
                        onClick={() => handleCancelEdit()}
                        danger
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleSubmitEdit(reservation.id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </ActionButton>
                    </FormActions>
                  </EditForm>
                ) : (
                  <ReservationDetails>
                    <div className="detail">
                      <div className="label">Date</div>
                      <div className="value">{formatDate(reservation.date)}</div>
                    </div>

                    <div className="detail">
                      <div className="label">Time</div>
                      <div className="value">{formatTime(reservation.time)}</div>
                    </div>

                    <div className="detail">
                      <div className="label">Party Size</div>
                      <div className="value">{reservation.party_size} people</div>
                    </div>

                    <div className="detail">
                      <div className="label">Name</div>
                      <div className="value">{reservation.customer_name}</div>
                    </div>
                  </ReservationDetails>
                )}
              </ReservationItem>
            ))
          )}
        </ReservationsContent>
      </ReservationsList>
    </ReservationsPageContainer>
  );
}

export default ReservationsPage;
