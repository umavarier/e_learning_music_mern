import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Utils/axios";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { TablePagination } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

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

function AdminEnrollmentPricing() {
  const [classPricing, setClassPricing] = useState([]);
  const [numberOfClasses, setNumberOfClasses] = useState("");
  const [classPrice, setClassPrice] = useState("");
  const [planName, setPlanName] = useState("");
  const [planNumber, setPlanNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  const handleAddClassPricing = () => {
    if (numberOfClasses && classPrice && planName && planNumber) {
      const updatedClassPricing = [
        ...classPricing,
        {
          planNumber: parseInt(planNumber),
          planName: planName,
          numberOfClasses: parseInt(numberOfClasses),
          price: parseFloat(classPrice),
        },
      ];
      setClassPricing(updatedClassPricing);
      setPlanNumber(1);
      setPlanName("");
      setNumberOfClasses("");
      setClassPrice("");
    }
  };

  const handleRemoveClassPricing = (index) => {
    const updatedClassPricing = [...classPricing];
    updatedClassPricing.splice(index, 1);
    setClassPricing(updatedClassPricing);
  };

  const handleSubmit = async () => {
    try {
      // Send a POST request to update enrollment pricing on the backend
      console.log("Class Pricing:");
      classPricing.forEach((item) => {
        console.log("Plan Number: " + item.planNumber);
        console.log("Name of Plan: " + item.planName);
        console.log("Number of Classes: " + item.numberOfClasses);
        console.log("Class Price: " + item.price);
      });
      await axios.post("/adminUpdateEnrollmentPricing", {classPricing});
      toast.success("Enrollment pricing updated successfully");
      navigate("/adminGetPricingDetails");
    } catch (error) {
      console.error(error);
      alert("Error updating enrollment pricing");
    }
  };

  const filteredClassPricing = classPricing.filter((item) =>
    item.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div>
        <AdminHeader />
        <div style={{ display: "flex" }}>
          <AdminSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="admin-enrollment-pricing-container">
              <div className="admin-enrollment-pricing">
                <Typography variant="h4">Admin Enrollment Pricing</Typography>
                <Box mb={3}>
                  <TextField
                    label="Search Plan Name"
                    variant="outlined"
                    margin="20px"
                    style={{fontSize : "24px"}}
                    // fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    label="Plan Number"
                    type="number"
                    margin="10px"
                    style={{fontSize : "24px"}}
                    fullWidth
                    value={planNumber}
                    onChange={(e) => setPlanNumber(e.target.value)}
                  />
                  <TextField
                    label="Plan Name"
                    style={{fontSize : "24px"}}
                    fullWidth
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                  <TextField
                    label="Number of Classes"
                    type="number"
                    style={{fontSize : "24px"}}
                    fullWidth
                    value={numberOfClasses}
                    onChange={(e) => setNumberOfClasses(e.target.value)}
                  />
                  <TextField
                    label="Class Price"
                    type="number"
                    style={{fontSize : "24px"}}
                    fullWidth
                    value={classPrice}
                    onChange={(e) => setClassPrice(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddClassPricing}
                  endIcon={<AddCircle />}
                >
                  Add Class Pricing
                </Button>
                <Box mt={2}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{fontSize : "24px"}}>Plan Number</TableCell>
                          <TableCell style={{fontSize : "24px"}}>Plan Name</TableCell>
                          <TableCell style={{fontSize : "24px"}}>Number of Classes</TableCell>
                          <TableCell style={{fontSize : "24px"}}>Class Price</TableCell>
                          <TableCell style={{fontSize : "24px"}}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredClassPricing
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item, index) => (
                            <TableRow key={index}>
                              <TableCell style={{fontSize : "24px"}}>{item.planNumber}</TableCell>
                              <TableCell style={{fontSize : "24px"}}>{item.planName}</TableCell>
                              <TableCell style={{fontSize : "24px"}}>{item.numberOfClasses}</TableCell>
                              <TableCell style={{fontSize : "24px"}}>{item.price}</TableCell>
                              <TableCell>
                                <IconButton
                                  color="secondary"
                                  onClick={() =>
                                    handleRemoveClassPricing(index)
                                  }
                                >
                                  Remove
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredClassPricing.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Update Pricing
                  </Button>
                </Box>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminEnrollmentPricing;
