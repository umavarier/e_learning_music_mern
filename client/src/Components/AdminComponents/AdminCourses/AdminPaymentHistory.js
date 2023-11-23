import React, { useEffect, useState } from "react";
import axios from "../../../Utils/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from "@material-ui/core";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
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

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("/getAdminPaymentList")
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredPayments = payments.filter(
    (payment) =>
      payment.userId?.userName.toLowerCase().includes(search.toLowerCase()) ||
      payment.purchasedCourse.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.teacherId?.userName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.amount.toString().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h2 style={{ fontSize: "24px" }}>Payment History</h2>
          <TextField
            label="Search for Payment"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "24px" }}>User Name</TableCell>
                  <TableCell style={{ fontSize: "24px" }}>
                    Course Name
                  </TableCell>
                  <TableCell style={{ fontSize: "24px" }}>
                    Teacher Name
                  </TableCell>
                  <TableCell style={{ fontSize: "24px" }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell style={{ fontSize: "24px" }}>
                        {payment.userId?.userName}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {payment.purchasedCourse.name}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {payment.teacherId?.userName}
                      </TableCell>
                      <TableCell style={{ fontSize: "24px" }}>
                        {payment.amount}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayments.length}
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

export default AdminPaymentHistory;
