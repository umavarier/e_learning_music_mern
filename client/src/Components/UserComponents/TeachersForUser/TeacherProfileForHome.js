import React, { useEffect, useState } from "react";
import axios from "../../../Utils/axios";
import Header from "../Home/Header.js";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

function TeacherProfileForHome() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const userToken = localStorage.getItem("userdbtoken");

  useEffect(() => {
    console.log("teacherid-----" + teacherId);
    axios
      .get(`/getTeacherProfileForHome/${teacherId}`)
      .then((response) => {
        setTeacher(response.data);
        console.log("teach-res     " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching teacher's information:", error);
      });
  }, [teacherId]);

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <Typography
          variant="h3"
          component="div"
          sx={{ marginTop: 2, textAlign: "center" }}
        >
          Teacher Profile
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <Card>
            <CardMedia
              component="img"
              alt="Teacher's Profile"
              height="450"
              // image={`http://localhost:4000/uploads/${teacher.profilePhoto}`}
              image={`https://melodymusic.online/uploads/${teacher.profilePhoto}`}

            />
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                align="center"
                sx={{ fontSize: "30px" }}
              >
                {teacher.userName}
              </Typography>

              <Typography
                variant="subtitle2"
                align="center"
                sx={{ fontSize: "24px" }}
              >
                Email: {teacher.email}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <Typography
          variant="h2"
          component="div"
          sx={{ marginTop: "30px", marginBotton: "50px", textAlign: "center" }}
        ></Typography>
        <Carousel autoPlay={true}>
        {teacher.courses &&
          teacher.courses.length > 0 &&
          teacher.courses.map((course, index) => (
            <div key={index}>
               <Card
                sx={{
                  borderRadius: "10%",
                  width: 300,
                  height: 100,
                  textAlign: "center",
                  margin: "0 auto",
                  background: "#FFEDC5 ",
                }}
              >
                <CardContent>
                  <Typography variant="h4" style={{ alignItems: "center" }}>
                    {course}
                  </Typography>
                </CardContent>
              </Card>

            </div>
          ))}
      </Carousel>

      <Carousel autoPlay={true}>
        <div>
          <FormControl>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ minWidth: "150px", marginBottom: "20px" }}
            >
              {teacher.coursesWithIds &&
                teacher.coursesWithIds.length > 0 &&
                teacher.coursesWithIds.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          
          <div style={{ display: "flex", overflowX: "auto" }}>
            {teacher.videos &&
              teacher.videos.length > 0 &&
              teacher.videos
                .filter((video) => !selectedCourse || video.courseId === selectedCourse)
                .map((video, index) => (
                  <div key={index} style={{ marginRight: "10px" }}>
                    <video width="300" height="169" controls>
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video
                    </video>
                  </div>
                ))}
          </div>
        </div>
      </Carousel>
      </Container>
    </>
  );
}

export default TeacherProfileForHome;
