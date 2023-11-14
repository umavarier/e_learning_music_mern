// TeacherAvailabilityTable.js
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TeacherHeader from "../Header/TeacherHeader";
import TeacherSidebar from "../Sidebar/TeacherSidebar";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import { format, isBefore, isAfter, isToday } from "date-fns";


const TeacherAvailabilityList = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const accessToken = Cookies.get("token");
  const decodedToken = jwt_decode(accessToken);
  const teacherId = decodedToken.id;

  useEffect(() => {
    // Fetch teacher availabilities from the backend
    axios.get(`/teachers/getTeacherAvailabilityList/${teacherId}`, {
        headers: {
          Authorization: ` ${Cookies.get("token")}`,
        },
      }).then((response) => {
        console.log(JSON.stringify(response.data))
      setAvailabilities(response.data);
    });
  }, []);

  const handleCancel = (availabilityId) => {
    console.log(`Cancel button clicked for availability ID: ${availabilityId}`);
    try {
        axios.delete(`/teachers/cancelTeacherAvailabilities/${availabilityId}`, {
            headers: {
              Authorization: ` ${Cookies.get("token")}`,
            },
          });
  
        setAvailabilities(availabilities.filter(availability => availability._id !== availabilityId));
          toast.success(`Availability cancelled successfully.`)
        console.log(`Availability with ID ${availabilityId} cancelled successfully.`);
      } catch (error) {
        console.error('Error canceling availability:', error);
      }
  };

  const isTimeOver = (endTime) => {
    const currentTime = new Date();
    const availabilityEndTime = new Date(endTime);
    console.log("av  "+availabilityEndTime)
    console.log("cur  "+endTime)
    return currentTime > availabilityEndTime;
  };


  return (
    <div>
      <TeacherHeader />
      <div style={{ display: "flex", margin: "30px" }}>
        <TeacherSidebar />
        <TableContainer component={Paper} sx={{ flexGrow: 1, p: 2 }}>
            <h3 className="text-center">Availability List</h3>
            {availabilities.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{fontSize : "24px"}}>Teacher Name</TableCell>
                <TableCell style={{fontSize : "24px"}}>Date</TableCell>
                <TableCell style={{fontSize : "24px"}}>Start Time</TableCell>
                <TableCell style={{fontSize : "24px"}}>End Time</TableCell>
                <TableCell style={{fontSize : "24px"}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availabilities.map((availability) => (
                <TableRow key={availability._id}>
                  <TableCell style={{fontSize : "24px"}}>{availability.teacher.userName}</TableCell>
                  <TableCell style={{fontSize : "24px"}}>{new Date(availability.date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell style={{fontSize : "24px"}}>{availability.startTime}</TableCell>
                  <TableCell style={{fontSize : "24px"}}>{availability.endTime}</TableCell>
                  <TableCell>
                    {isTimeOver(availability.endTime) || availability.canceled ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        disabled
                      >
                        Time Over
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancel(availability._id)}
                        disabled={isAfter(new Date(), new Date(availability.date))}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           ) : (
            <p>No availabilities added yet . Go to Profile page</p>
          )}
        </TableContainer>
      </div>
    </div>
  );
};

export default TeacherAvailabilityList;
