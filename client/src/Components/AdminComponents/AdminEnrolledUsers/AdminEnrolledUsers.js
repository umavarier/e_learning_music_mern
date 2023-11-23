import React, { useState, useEffect } from "react";
import axios from "../../../Utils/axios";
import TableContainer from "@mui/material/TableContainer";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import AdminHeader from "../Header/AdminHeader.js";
import AdminSidebar from "../Header/AdminSidebar.js";
import Cookies from "js-cookie";
import AdminPaymentHistory from "../AdminCourses/AdminPaymentHistory.js";

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const EnrolledUsersList = () => {
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("/getEnrolledUsersList")
      .then((response) => {
        setEnrolledUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrolled users:", error);
      });
  }, []);

  const filteredUsers = enrolledUsers.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayValueOrNotAssigned = (value) => {
    return value ? value : "Not Assigned";
  };

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h2 style={{ fontSize: "24px" }}>Enrolled Users List</h2>
          <TextField
            label="Search User"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/adminPaymentHistory" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              color="primary"
              style={{ float: "right", background:"primary" ,margin : "10px"}}
            >
              Payment History
            </Button>
          </Link>

          <TableContainer component={Paper}>
            <Table style={{ border: "1px solid" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "24px", border: "none" }}>
                    Name
                  </TableCell>
                  <TableCell style={{ fontSize: "24px", border: "none" }}>
                    Email
                  </TableCell>
                  <TableCell style={{ fontSize: "24px", border: "none" }}>
                    Enrolled Courses
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user._id} style={{ border: "none" }}>
                      <TableCell
                        style={{ fontSize: "24px", border: "2px solid" }}
                      >
                        {displayValueOrNotAssigned(user?.userName)}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "24px", border: "2px solid" }}
                      >
                        {displayValueOrNotAssigned(user.email)}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "24px", border: "2px solid" }}
                      >
                        {user.enrolledCourses.map((course, index) => (
                        
                          <TableContent
                            key={index}
                            course={course}
                            displayValueOrNotAssigned={
                              displayValueOrNotAssigned
                            }
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

const TableContent = ({ course, displayValueOrNotAssigned }) => {
  return (
    <TableRow style={{ border: "none" }}>
      <TableCell style={{ fontSize: "20px", border: "none" }}>
        <strong>Course:</strong>{" "}
        {displayValueOrNotAssigned(course.course?.name)}
      </TableCell>
      <TableCell style={{ fontSize: "20px", border: "none" }}>
        <strong>Instructor:</strong>{" "}
        {displayValueOrNotAssigned(course.instructorId?.userName)}
      </TableCell>
      <TableCell style={{ fontSize: "20px", border: "none" }}>
        <strong>Day:</strong> {displayValueOrNotAssigned(course.day)}
      </TableCell>
      <TableCell style={{ fontSize: "20px", border: "none" }}>
        <strong>Time:</strong> {displayValueOrNotAssigned(course.time)}
      </TableCell>
    </TableRow>
  );
};

export default EnrolledUsersList;
