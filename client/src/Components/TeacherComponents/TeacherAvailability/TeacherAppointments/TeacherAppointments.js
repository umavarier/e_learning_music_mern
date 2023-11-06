import React, { useEffect, useState } from "react";
import TeacherHeader from "../../Header/TeacherHeader";
import TeacherSidebar from "../../Sidebar/TeacherSidebar";
import axios from "../../../../utils/axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { format, isBefore, isAfter, isToday } from "date-fns";

const TeacherAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken.id;
    axios
      .get(`/teachers/getTeacherAppointments/${teacherId}`, {
        headers: {
          Authorization: ` ${Cookies.get("token")}`,
        },
      })

      .then((response) => {
        console.log("book---" + JSON.stringify(response.data));
        setAppointments(response.data);
      });
  }, []);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const isJoinButtonEnabled = (appointment) => {
    const currentDateTime = new Date();
    const appointmentStartTime = new Date(appointment.date);
    const appointmentEndTime = new Date(appointment.date);
    
    // Extract hours and minutes from appointment.startTime and appointment.endTime
    const [hours, minutes] = appointment.startTime.split(":");
    appointmentStartTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  
    // Extract hours and minutes from appointment.endTime
    const [endHours, endMinutes] = appointment.endTime.split(":");
    appointmentEndTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
  
    const currentTime = new Date();
    
    return (
      isToday(appointmentStartTime) &&
      isAfter(currentTime, appointmentStartTime) &&
      isBefore(currentTime, appointmentEndTime)
    );
  };
  
  
  const handleJoinClick = (appointmentId) => {
    console.log(`Join clicked for appointment ID: ${appointmentId}`);
  };

  const handleCancelClick = (appointmentId) => {
    console.log(`Cancel clicked for appointment ID: ${appointmentId}`);
  };
  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  return (
    <>
      <TeacherHeader />
      <div className="container-fluid">
        <div className="row">
          <TeacherSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <h2>Appointments List</h2>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment?.studentId.userName}</TableCell>
                      <TableCell>{appointment.courseId?.name}</TableCell>
                      <TableCell>
                        {isValidDate(appointment.date)
                          ? format(new Date(appointment.date), "dd/MM/yyyy")
                          : "Invalid Date"}
                      </TableCell>
                      <TableCell>{appointment.startTime}</TableCell>
                      <TableCell>{appointment.endTime}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ margin: "10px" }}
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleJoinClick(appointment._id)}
                          disabled={!isJoinButtonEnabled(appointment)}
                        >
                          Join
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{ margin: "10px" }}
                          startIcon={<DeleteIcon />}
                          onClick={() => handleCancelClick(appointment._id)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </main>
        </div>
      </div>
    </>
  );
};

export default TeacherAppointmentsList;
