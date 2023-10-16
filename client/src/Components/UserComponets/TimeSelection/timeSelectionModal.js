import React, { useState } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import "./timeSelectionModal.css";
import { DatePicker, TimePicker } from "antd";

function TimeSelectionModal({
  isOpen,
  onRequestClose,
  onTimeSelected,
  handleScheduleDemo,
  selectedDate,
  selectedTime,
  isTimePickerDisabled,
}) {
  const [selectedDateState, setSelectedDate] = useState(null);
  const [selectedTimeState, setSelectedTime] = useState(null);

  // const availableTimes = ["10:00 AM", "2:00 PM", "4:00 PM", "7:00 PM"]; // Example available times

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const handleConfirm = () => {
    if (!selectedDateState) {
      console.log("Please select a date.");
      return;
    }

    if (!selectedTimeState) {
      console.log("Please select a time.");
      return;
    }

    const formattedDateTime =
      moment(selectedDateState).format("DD-MM-YYYY") + " " + selectedTimeState;
      console.log("date "+selectedDateState)
    onTimeSelected(formattedDateTime);
    onRequestClose();
    handleScheduleDemo();
  };

  return (
    <div className={`time-selection-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>Select a Date and Time for Your Free Demo</h2>
        <div className="time-options">
          <DatePicker
            format="DD-MM-YYYY"
            onChange={(value) =>
              setSelectedDate(moment(value, "DD-MM-YYYY").format("DD-MM-YYYY"))
            }
            minDate={moment()} // Use moment() to set the minimum date
          />

          {/* <div className="time-buttons">
            {availableTimes.map((time) => (
              <button
                key={time}
                className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </button>
            ))}
          </div> */}
          {/* <TimePicker format ="HH:mm" onChange={(values) =>setSelectedTime(moment(values).format("HH.mm"))} /> */}
          <TimePicker
            format="HH:mm"
            onChange={(time, timeString) => setSelectedTime(timeString)}
          />
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
