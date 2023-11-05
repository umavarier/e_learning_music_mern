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
          dayOfWeek: appointment.dayOfWeek,
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
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Day of the Week</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell>{appointment.appointmentDate}</TableCell>
                      <TableCell>{appointment.studentName}</TableCell>
                      <TableCell>{appointment.teacherName}</TableCell>
                      <TableCell>{appointment.courseName}</TableCell>
                      <TableCell>{appointment.dayOfWeek}</TableCell>
                      <TableCell>{appointment.startTime}</TableCell>
                      <TableCell>{appointment.endTime}</TableCell>
                      <TableCell>
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
