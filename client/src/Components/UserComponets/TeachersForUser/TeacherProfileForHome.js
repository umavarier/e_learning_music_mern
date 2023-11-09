import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Header from "../Home/Header.js";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

function TeacherProfileForHome() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
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
          variant="h4"
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
              image={`http://localhost:4000/uploads/${teacher.profilePhoto}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                align="center"
                sx={{ fontSize: "24px" }}
              >
                {teacher.userName}
              </Typography>
              
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ fontSize: "30px" }}
              >
                Email: {teacher.email}
              </Typography>
            </CardContent>
          </Card>   
        </div>

        <Typography
          variant="h5"
          component="div"
          sx={{ marginTop: 2, textAlign: "center" }}
        >
          Courses
        </Typography>
        <Carousel autoPlay={false}>
          {teacher.courses.map((course, index) => (
            <div key={index}>
              <Card
                sx={{
                  borderRadius: "50%",
                  width: 100,
                  height: 100,
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{course}</Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </Carousel>

        <Typography
          variant="h5"
          component="div"
          sx={{ marginTop: 2, textAlign: "center" }}
        >
          Teacher's Videos
        </Typography>
        <Carousel autoPlay={false}>
          {teacher.videos.map((video, index) => (
            <div key={index}>
              <video width="560" height="315" controls>
                <source src={video} type="video/mp4" />
                Your browser does not support the video
              </video>
            </div>
          ))}
        </Carousel>
      </Container>
    </>
  );
}

export default TeacherProfileForHome;
