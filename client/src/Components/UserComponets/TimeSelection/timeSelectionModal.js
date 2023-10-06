import React, { useState } from 'react';
import moment from 'moment';
import './timeSelectionModal.css'; // You can create a CSS file for styling

function TimeSelectionModal({ isOpen, onRequestClose, onTimeSelected, handleScheduleDemo }) {
  const [selectedTime, setSelectedTime] = useState('');

  const availableTimes = ['7:52 PM', '2:00 PM', '4:00 PM', '7:00 PM']; // Example available times

  const handleTimeClick = (time) => {
    console.log("timenew   "+time)
    setSelectedTime(moment(time, 'HH:mm:ss').format());
  };

  const handleConfirm = () => {
    console.log(selectedTime+"+++selectedtime")
    onTimeSelected(selectedTime);
    onRequestClose();
    handleScheduleDemo();
  };

  return (
    <div className={`time-selection-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Select a Time for Your Free Demo</h2>
        <div className="time-options">
          {availableTimes.map((time) => (
            <button
              key={time}
              className={`time-option ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => handleTimeClick(time)}
            >
              {time}
            </button>
          ))}
        </div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeSelectionModal;
