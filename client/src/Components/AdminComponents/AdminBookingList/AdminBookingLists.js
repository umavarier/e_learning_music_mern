import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TablePagination,
} from "@mui/material";
import { format, isBefore, isAfter, isToday } from "date-fns";

const UserAppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/adminGetUserAppointments", {
          headers: {
            Authorization: `${Cookies.get("token")}`,
          },
        });
        console.log("app-res----" + JSON.stringify(response.data));
        const transformedAppointments = response.data.map((appointment) => ({
          appointmentId: appointment.appointmentId,
          studentName: appointment.studentName
            ? appointment.studentName
            : "N/A",
          teacherName: appointment.teacherName,
          courseName: appointment.courseName,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        }));
        setAppointments(transformedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle appointment cancellation
  const cancelAppointment = async (appointmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel the Booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const accessToken = Cookies.get("token");
        const decodedToken = jwt_decode(accessToken);
        console.log("Appid----" + appointmentId);
        try {
          axios.delete(`/adminCancelAppointment/${appointmentId}`, {
            headers: {
              Authorization: `${Cookies.get("token")}`,
            },
          });

          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );
          toast.success("appointment cancelled successfully");
        } catch (error) {
          console.error("Error canceling appointment:", error);
        }
      }
    });
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.teacherName || "")
      .toLowerCase()
      .includes((search || "").toLowerCase())
  );

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
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>User Appointments</h2>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "24px"}}>Appointment Date</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Student Name</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Teacher Name</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Course Name</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Start Time</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>End Time</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Status</TableCell>
                  <TableCell style={{ fontSize: "24px"}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell style={{ fontSize: "24px"}}>
                        {isValidDate(appointment.date)
                          ? format(new Date(appointment.date), "dd/MM/yyyy")
                          : "Invalid Date"}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{appointment.studentName}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{appointment.teacherName}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{appointment.courseName}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{appointment.startTime}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{appointment.endTime}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{getCurrentStatus(appointment)}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            cancelAppointment(appointment.appointmentId)
                          }
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAppointmentsTable;
