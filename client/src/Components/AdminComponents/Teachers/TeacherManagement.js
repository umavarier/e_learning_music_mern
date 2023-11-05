import React, { useEffect, useState } from "react";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import axios from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import "./TeacherManagement.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
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
    const accessToken = Cookies.get("token");
    console.log("aprv" + accessToken);
    const decodedToken = jwt_decode(accessToken);
    console.log("decd-admin  " + JSON.stringify(decodedToken));
    const approveFlag = !isTeacherApproved;

    axios
      .patch(
        `/adminApproveTeacher/${teacherId}`,
        {
          isTeacherApproved: approveFlag,
        },
        {
          headers: {
            Authorization: `${Cookies.get("token")}`, 
          },
        }
      )
      .then(() => {
        getTeacherList();
      })
      .catch((error) => {
        console.error("Error toggling teacher approval status:", error);
      });
  };

  const rejectTeacher = (teacherId) => {
    axios
      .patch(`/adminRejectTeacher/${teacherId}`)
      .then(() => {
        getTeacherList();
      })
      .catch((error) => {
        console.error("Error rejecting teacher:", error);
      });
  };

  return (
    <div className="teacher-management-container">
      <AdminHeader />
      <div className="teacher-management-content">
        <AdminSidebar />
        <div className="teacher-list">
          <h2>Teacher Management</h2>
          <button
            className="add-button"
            onClick={() => navigate("/adminAddTeacher")}
          >
            Add Teacher
          </button>
          <table className="teacher-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Teacher Name</th>
                <th>Email</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.userName}</td>
                  <td>{teacher.email}</td>
                  <td>
                    {teacher.isTeacherApproved ? (
                      <span className="approved">Approved ✓</span>
                    ) : teacher.isRejected ? (
                      <span className="rejected">Rejected ✗</span>
                    ) : (
                      <span className="pending">Pending !</span>
                    )}
                  </td>
                  <td>
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
                          onClick={() => rejectTeacher(teacher._id)}
                        >
                          Reject ✗
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherManagement;
