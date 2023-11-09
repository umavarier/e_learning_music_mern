import React, { useState } from "react";

function EditCourseTimingModal({ isOpen, onClose, onSubmit, defaultDay, defaultTime }) {
  const [day, setDay] = useState(defaultDay || "");
  const [time, setTime] = useState(defaultTime || "");

  const handleUpdate = () => {
    // Validate the input fields if needed

    // Call the onSubmit function with updated values
    onSubmit(day, time);
  };

  return (
    <div
      className="modal"
      style={{
        display: isOpen ? "block" : "none",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fefefe",
          margin: "15% auto",
          padding: "20px",
          border: "1px solid #888",
          width: "15%",
        }}
      >
        <span
          style={{
            display: "block",
            textAlign: "right",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          &times;
        </span>
        <h2>Edit Course Timing</h2>
        <form>
          <div>
            <label htmlFor="day">Day of the Week:</label>
            <input
              type="text"
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="time">Starting Time:</label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleUpdate} style={{ marginTop: "10px" }}>
            Update Timing
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourseTimingModal;
