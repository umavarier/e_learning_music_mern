import React, { useEffect, useState } from "react";
import TeacherHeader from "../../Header/TeacherHeader";
import TeacherSidebar from "../../Sidebar/TeacherSidebar";
import axios from "../../../../Utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import axiosWithBlockCheck from "../../../../Utils/axiosWithBlockCheck";

const TeacherAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const accessToken = Cookies.get("token");
  const decodedToken = jwt_decode(accessToken);
  const teacherId = decodedToken.id;

  useEffect(() => {
    axiosWithBlockCheck
      .get(`/teachers/getTeacherAppointments/${teacherId}`, {
        headers: {
          Authorization: ` ${accessToken}`,
        },
      })

      .then((response) => {
        console.log("book---" + JSON.stringify(response.data));
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("error fetching teacher appointments", error)
      })
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
    console.log(`Cancel clicked for appointment ID: ${appointmentId}`);

    axios
      .delete(`/teachers/cancelTeacherAppointment/${appointmentId}`, {
        headers: {
          Authorization: ` ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("Appointment canceled successfully:", response.data);
        if (response.status === 200) {
          setAppointments((appointments) =>
            appointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );
        }
        toast.success("Appointment cancelled successfullly!!");
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
        toast.error("Error cancelling!! Please try again later");
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
                    <TableCell style={{ fontSize: "24px" }}>
                      Student Name
                    </TableCell>
                    <TableCell style={{ fontSize: "24px" }}>
                      Course Name
                    </TableCell>
                    <TableCell style={{ fontSize: "24px" }}>Date</TableCell>
                    <TableCell style={{ fontSize: "24px" }}>
                      Start Time
                    </TableCell>
                    <TableCell style={{ fontSize: "24px" }}>End Time</TableCell>
                    <TableCell style={{ fontSize: "24px" }}>Status</TableCell>
                    <TableCell style={{ fontSize: "24px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell style={{ fontSize: "24px" }}>
                        {appointment?.studentId.userName}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {appointment.courseId?.name}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {isValidDate(appointment.date)
                          ? format(new Date(appointment.date), "dd/MM/yyyy")
                          : "Invalid Date"}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {appointment.startTime}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {appointment.endTime}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {getCurrentStatus(appointment)}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ margin: "10px" }}
                          startIcon={<PlayArrowIcon />}
                          onClick={() =>
                            handleJoinDemo(appointment._id, teacherId)
                          }
                          disabled={!isJoinButtonEnabled(appointment)}
                        >
                          Join
                        </Button>
                        {getCurrentStatus(appointment) === "Time Over" ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            style={{ margin: "10px" }}
                            startIcon={<DeleteIcon />}
                            disabled
                          >
                            Time Over
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            style={{ margin: "10px" }}
                            startIcon={<DeleteIcon />}
                            onClick={() => handleCancelClick(appointment._id)}
                          >
                            {isAfter(new Date(), new Date(appointment.endTime))
                              ? "Time Over"
                              : "Cancel"}
                          </Button>
                        )}
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
