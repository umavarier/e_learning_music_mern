import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import Header from "../Home/Header.js";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { format, isBefore, isAfter, isToday } from "date-fns";

const UserDemoBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userdbtoken");
    axios
      .get("/getUserDemoBookings", {
        headers: {
          Authorization: `${userToken}`,
        },
      })
      .then((response) => {
        setAppointments(response.data);
        // console.log("getbook"+JSON.stringify(response.data))
      })
      .catch((error) => {
        console.error("Error fetching free demo bookings:", error);
      });
  }, []);

  const isJoinButtonEnabled = (appointment) => {
    const currentDateTime = new Date();
    const appointmentStartTime = new Date(appointment.date);
    const appointmentEndTime = new Date(appointment.date);

    // Extract hours and minutes from appointment.startTime and appointment.endTime
    const [hours, minutes] = appointment.startTime.split(":");
    appointmentStartTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    // Extract hours and minutes from appointment.endTime
    const [endHours, endMinutes] = appointment.endTime.split(":");
    appointmentEndTime.setHours(
      parseInt(endHours, 10),
      parseInt(endMinutes, 10)
    );

    const currentTime = new Date();

    return (
      isToday(appointmentStartTime) &&
      isAfter(currentTime, appointmentStartTime) &&
      isBefore(currentTime, appointmentEndTime)
    );
  };

  const handleJoinDemo = (appointmentId, teacherId) => {
    console.log(`Join clicked for teacherId: ${teacherId}`);
    console.log(`Join clicked for appointment ID: ${appointmentId}`);

    navigate(`/videoRoom/${appointmentId}`);
  };

  const handleCancelClick = (appointmentId) => {
    const userToken = localStorage.getItem("userdbtoken");

    axios
      .delete(`/cancelUserAppointment/${appointmentId}`, {
        headers: {
          Authorization: `${userToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAppointments((appointments) =>
            appointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );

          toast.success("Appointment canceled successfully!");
        } else {
          toast.error("Error canceling appointment. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
        toast.error("Error canceling appointment. Please try again later.");
      });
  };

  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const getCurrentStatus = (appointment) => {
    const currentDateTime = new Date();
    const appointmentStartTime = new Date(appointment.date);
    const appointmentEndTime = new Date(appointment.date);

    const [hours, minutes] = appointment.startTime.split(":");
    appointmentStartTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const [endHours, endMinutes] = appointment.endTime.split(":");
    appointmentEndTime.setHours(
      parseInt(endHours, 10),
      parseInt(endMinutes, 10)
    );

    if (isBefore(currentDateTime, appointmentStartTime)) {
      return "Scheduled";
    } else if (isAfter(currentDateTime, appointmentEndTime)) {
      return "Time Over";
    } else {
      return "In Progress";
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center" style={{fontSize:"30px"}}>Free Demo Bookings</h1>
      <TableContainer  style={{ margin: "50px", padding: "20px" ,marginRight : "50px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "24px" }}>Course Name</TableCell>
              <TableCell style={{ fontSize: "24px" }}>Teacher Name</TableCell>
              <TableCell style={{ fontSize: "24px" }}>Date</TableCell>
              <TableCell style={{ fontSize: "24px" }}>Start Time</TableCell>
              <TableCell style={{ fontSize: "24px" }}>End Time</TableCell>
              <TableCell style={{ fontSize: "24px" }}>Status</TableCell>
              <TableCell style={{ fontSize: "24px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell style={{ fontSize: "24px" }}>{appointment.courseId.name}</TableCell>
                <TableCell style={{ fontSize: "24px" }}>{appointment.teacherId.userName}</TableCell>
                <TableCell style={{ fontSize: "24px" }}>
                  {isValidDate(appointment.date)
                    ? format(new Date(appointment.date), "dd/MM/yyyy")
                    : "Invalid Date"}
                </TableCell>
                <TableCell style={{ fontSize: "24px" }}>{appointment.startTime}</TableCell>
                <TableCell style={{ fontSize: "24px" }}>{appointment.endTime}</TableCell>
                <TableCell style={{ fontSize: "24px" }}>{getCurrentStatus(appointment)}</TableCell>
                <TableCell style={{ fontSize: "24px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: "10px" }}
                    startIcon={<PlayArrowIcon />}
                    onClick={() =>
                      handleJoinDemo(appointment._id, appointment.teacherId._id)
                    }
                    disabled={!isJoinButtonEnabled(appointment)}
                  >
                    Join
                  </Button>
                  {getCurrentStatus(appointment) === "Time Over" ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      disabled
                    >
                      Time Over
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancelClick(appointment._id)}
                      disabled={isAfter(new Date(), new Date(appointment.date))}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserDemoBookings;
