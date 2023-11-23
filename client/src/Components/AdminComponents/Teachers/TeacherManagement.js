import React, { useEffect, useState } from "react";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import axios from "../../../Utils/axios";
import { useNavigate } from "react-router-dom";
import "./TeacherManagement.css";
import Cookies from "js-cookie";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination } from '@material-ui/core';

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

function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTeacherList();
  }, []);

  const getTeacherList = () => {
    axios
      .get("/adminGetTeachers")
      .then((response) => {
        console.log("respo  " + response.data);
        setTeachers(response.data.teachers);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };

  const deleteTeacher = (teacherId) => {
    axios
      .delete(`/adminDeleteTeacher/${teacherId}`)
      .then(() => {
        getTeacherList(); // Refresh the teacher list
      })
      .catch((error) => {
        console.error("Error deleting teacher:", error);
      });
  };

  const toggleBlockTeacher = (teacherId, isBlock) => {
    axios
      .patch(`/adminToggleBlockTeacher/${teacherId}`, { isBlock: !isBlock })
      .then(() => {
        getTeacherList();
      })
      .catch((error) => {
        console.error("Error toggling teacher block status:", error);
      });
  };

  const approveTeacher = (teacherId, isTeacherApproved) => {
    const approveFlag = !isTeacherApproved;

    axios
      .patch(
        `/adminApproveTeacher/${teacherId}`,
        {
          isTeacherApproved: approveFlag,
        }
      )
      .then(() => {
        getTeacherList();
      })
      .catch((error) => {
        console.error("Error toggling teacher approval status:", error);
      });
  };

  const rejectTeacher = (teacherId,isTeacherRejected) => {
    const approveFlag = !isTeacherRejected;
    axios
      .patch(`/adminRejectTeacher/${teacherId}`,
      {
        isTeacherApproved: approveFlag,
      })
      .then(() => {
        getTeacherList();
      })
      .catch((error) => {
        console.error("Error rejecting teacher:", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.userName.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase()) ||
      (teacher.isTeacherApproved ? "Approved" : teacher.isRejected ? "Rejected" : "Pending").toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="teacher-management-container">
      <AdminHeader />
      <div className="teacher-management-content">
        <AdminSidebar />
        <div className="teacher-list">
          <h2>Teacher Management</h2>
         
          <TextField
            label="Search"
            variant="outlined"
            // fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeachers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((teacher, index) => (
                    <TableRow key={teacher._id}>
                      <TableCell style={{fontSize : "24px"}}>{index + 1}</TableCell>
                      <TableCell style={{fontSize : "24px"}}>{teacher.userName}</TableCell>
                      <TableCell style={{fontSize : "24px"}}>{teacher.email}</TableCell>
                      <TableCell>
                        {teacher.isTeacherApproved ? (
                          <span className="approved" style={{fontSize : "24px"}}>Approved ✓</span>
                        ) : teacher.isRejected ? (
                          <span className="rejected" style={{fontSize : "24px"}}>Rejected ✗</span>
                        ) : (
                          <span className="pending" style={{fontSize : "24px"}}>Pending !</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {teacher.isTeacherApproved || teacher.isRejected ? (
                          <button
                            className="block-button"
                            onClick={() =>
                              toggleBlockTeacher(teacher._id, teacher.isBlock)
                            }
                          >
                            {teacher.isBlock ? "Unblock" : "Block"}
                          </button>
                        ) : (
                          <div>
                            <button
                              className="approve-button"
                              onClick={() =>
                                approveTeacher(
                                  teacher._id,
                                  teacher.isTeacherApproved
                                )
                              }
                            >
                              Approve ✓
                            </button>
                            <button
                              className="reject-button"
                              onClick={() => rejectTeacher(teacher._id,teacher.isTeacherRejected)}
                            >
                              Reject ✗
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTeachers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}

export default TeacherManagement;
