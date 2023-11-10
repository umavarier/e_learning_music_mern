import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import AdminHeader from '../Header/AdminHeader';
import AdminSidebar from '../Header/AdminSidebar';
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const accessToken = Cookies.get("token");

  useEffect(() => {
    axios.get('/getAdminPaymentList', {
        headers: {
          Authorization: `${accessToken}`,
        },
      })
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching payment data:', error);
      });
  }, []);

  

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "20px" }}>
          <h2 style={{ fontSize: "24px" }}>Payment History</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "24px"}}>User Name</TableCell>
              <TableCell style={{ fontSize: "24px"}}>Course Name</TableCell>
              <TableCell style={{ fontSize: "24px"}}>Teacher Name</TableCell>
              <TableCell style={{ fontSize: "24px"}}>Amount</TableCell>
              {/* <TableCell>Pricing Plan</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell style={{ fontSize: "24px"}}>{payment.userId.userName}</TableCell>
                    <TableCell style={{ fontSize: "24px"}}>{payment.purchasedCourse.name}</TableCell>
                    <TableCell style={{ fontSize: "24px"}}>{payment.teacherId.userName}</TableCell> 
                    <TableCell style={{ fontSize: "24px"}}>{payment.amount}</TableCell>
                    {/* <TableCell>{getPricingPlan(payment.amount)}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
        </Table>
      </TableContainer>
      </div></div>
    </div>
  );
};

export default AdminPaymentHistory;
