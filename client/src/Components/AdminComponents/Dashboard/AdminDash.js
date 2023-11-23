import React, { Fragment, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Paper, Container, Typography } from '@mui/material';
import AdminHeader from '../Header/AdminHeader';
import AdminSidebar from '../Header/AdminSidebar';
import axios from '../../../Utils/axios';
import Cookies from 'js-cookie';

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

function AdminDash() {
  const [enrolledUsers, setEnrolledUsers] = useState([]);

  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      try {
        const response = await axios.get('/getEnrolledUsersList');
        // console.log(JSON.stringify(response.data))
        setEnrolledUsers(response.data);
      } catch (error) {
        console.error('Error fetching enrolled users:', error);
      }
    };

    fetchEnrolledUsers();
  }, []);

  const pieChartData = enrolledUsers.map((user) => ({
    name: user.userName,
    value:  user.enrolledCourses.length,
  }));

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF8C00'];

  return (
    <Fragment>
      <AdminHeader />
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div
              style={{
                minHeight: '100vh',
                color: 'black',
              }}
            >
              <Container>
                <Typography variant="h4" align="center" mt={4} mb={4}>
                  DASHBOARD
                </Typography>
                <Paper elevation={3} className="mb-4">
                  <Typography variant="h5" align="center" mb={3}>
                    Enrolles users
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Container>
            </div>
          </main>
        </div>
      </div>
   
    </Fragment>
  );
}

export default AdminDash;
