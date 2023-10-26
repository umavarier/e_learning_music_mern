import React, { useState, useEffect } from "react";
import "./TeacherAvailability.css";
import axios from "../../../utils/axios";

function TeacherAvailabilityPage() {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem("token");

    // const headers = {
    //   'Authorization':`Bearer ${token}`,
    //   'Content-Type': 'application/json',
    // };

    e.preventDefault();

  //   axios
  //     .post("/teachers/addAvailability", formData, token)
  //       // headers: {
  //       //   Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       // },
      
  //     .then((response) => {
  //       setAvailabilityData([...availabilityData, response.data]);
  //       console.log("respo.data " + response.data);
  //       setFormData({
  //         dayOfWeek: "",
  //         startTime: "",
  //         endTime: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
   };

  const handleDelete = (id) => {
    // Send a request to the server to delete the availability data with the specified ID
    // You can use Axios or another library for making API requests
    // After a successful request, update the local state to remove the deleted data
    // For example:
    // axios.delete(`/api/availability/${id}`)
    //   .then(() => {
    //     setAvailabilityData(availabilityData.filter(item => item._id !== id));
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
  };

  useEffect(() => {
    // Fetch the teacher's availability data from the server when the component loads
    // For example:
    // axios.get('/api/availability')
    //   .then((response) => {
    //     setAvailabilityData(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
  }, []);

  return (
    <div className="time-container">
      <h2>Manage Availability</h2>
      <form className="av-form" onSubmit={handleSubmit}>
        <div>
          <label className="av-label" htmlFor="dayOfWeek">Day of the week:</label>
          <select
            name="dayOfWeek"
            id="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="1">Tuesday</option>
            <option value="1">Wednesday</option>
            <option value="1">Thursday</option>
            <option value="1">Friday</option>
            <option value="1">Saturday</option>
            {/* Add options for other days of the week */}
          </select>
        </div>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Availability</button>
      </form>
      <table className="av-table">
        <thead>
          <tr>
            <th>Day of the Week</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availabilityData.map((item) => (
            <tr key={item._id}>
              <td>{item.dayOfWeek}</td>
              <td>{item.startTime}</td>
              <td>{item.endTime}</td>
              <td>
                <button className="av-button"onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherAvailabilityPage;
