import React, { useState, useEffect, Fragment } from "react";
import axios from "../../../utils/axios";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import {
  Modal,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function AdminCourseManagement() {
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    name: "",
    duration: "",
    level: "",
    description: "",
    image: "",
  });

  const [editCourse, setEditCourse] = useState(null);

  const openAddCourseModal = () => {
    setAddCourseModalOpen(true);
  };

  const closeAddCourseModal = () => {
    setAddCourseModalOpen(false);
  };

  const openEditCourseModal = (course) => {
    console.log("courseedt " + course);
    setEditCourse(course);
    setEditCourseModalOpen(true);
  };

  const closeEditCourseModal = () => {
    setEditCourse(null);
    setEditCourseModalOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCourse({ ...editCourse, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setCourse({ ...course, image: imageFile });
  };
  const handleDelete = (courseId) => {
    axios
      .delete(`/adminDeleteCourse/${courseId}`)
      .then(() => {
        console.log("Course deleted successfully.");
        toast.success("Course deleted successfully");
        setCourses(courses.filter((course) => course._id !== courseId));
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };
  const handleEdit = (course) => {
    console.log("handleedit " + course);
    openEditCourseModal(course);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/courses/addCourse", course)
      .then((response) => {
        toast.success("course added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Course added successfully:", response.data);
        setCourse({
          name: "",
          duration: "",
          level: "",
          description: "",
          image: "",
        });

        setCourses([...courses, response.data.course]);
        closeAddCourseModal();
      })
      .catch((error) => {
        console.error("Error adding course:", error);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/adminEditCourse/${editCourse._id}`, editCourse)
      .then((response) => {
        toast.success("Course edited siccessfully ");
        console.log("Course edited successfully:", response.data);

        setCourses(
          courses.map((course) =>
            course._id === response.data.course._id
              ? response.data.course
              : course
          )
        );
        closeEditCourseModal();
      })
      .catch((error) => {
        console.error("Error editing course:", error);
      });
  };

  useEffect(() => {
    axios
      .get("/adminGetCourseList")
      .then((response) => {
        const coursesData = response.data.courses || [];
        // console.log("coursedata "+JSON.stringify(coursesData))
        setCourses(coursesData);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);
  return (
    <Fragment>
      <AdminHeader />
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <div className="col">
            <h1 className="text-center">Course Management</h1>
            <Button
              variant="contained"
              color="primary"
              style={{marginBottom:"20px"}}
              onClick={openAddCourseModal}
            >
              Add New Course
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: "24px"}}>Name</TableCell>
                    <TableCell style={{ fontSize: "24px"}}>Duration</TableCell>
                    <TableCell style={{ fontSize: "24px"}}>Level</TableCell>
                    <TableCell style={{ fontSize: "24px"}}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course?._id}>
                      <TableCell style={{ fontSize: "24px"}}>{course?.name}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{course?.duration}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>{course?.level}</TableCell>
                      <TableCell style={{ fontSize: "24px"}}>
                        <IconButton
                          color="primary"
                          style={{margin:"10px"}}
                          onClick={() => handleEdit(course)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(course._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      {/* Add Course Modal */}
      <Modal open={isAddCourseModalOpen} onClose={closeAddCourseModal}>
        <Paper style={{ width: "50%", margin: "0 auto", padding: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Course Name"
              name="name"
              value={course.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <TextField
              label="Duration in hours"
              name="duration"
              value={course.duration}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <TextField
              label="Level"
              name="level"
              value={course.level}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Course
            </Button>
          </form>
        </Paper>
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={isEditCourseModalOpen} onClose={closeEditCourseModal}>
        <Paper style={{ width: "50%", margin: "0 auto", padding: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Edit Course
          </Typography>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Course Name"
              name="name"
              value={editCourse?.name}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <TextField
              label="Duration"
              name="duration"
              value={editCourse?.duration}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <TextField
              label="Level"
              name="level"
              value={editCourse?.level}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
              inputProps={{ style: { color: "black" } }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </form>
        </Paper>
      </Modal>
    </Fragment>
  );
}
export default AdminCourseManagement;
