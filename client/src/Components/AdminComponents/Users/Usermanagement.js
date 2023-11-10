import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import AdminHeader from '../Header/AdminHeader';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { adminDeleteUser, admingetAllusers, adminSearchUser } from '../../../utils/Constants';
import Swal from 'sweetalert2';
import AdminSidebar from '../Header/AdminSidebar';
import ReactPaginate from 'react-paginate'; 


function Usermanagement() {
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0); // State to track the current page number
  const usersPerPage = 10; // Number of users to display per page
  const navigate = useNavigate();

  useEffect(() => {
    getUserLists();
  }, []);

  // Function to fetch users based on the current page number
  const getUserLists = () => {
    axios.get(admingetAllusers).then((response) => {
      setUsers(response.data.users);
    }).catch((err) => {
      console.log("err");
    });
  }

  const userSearch = (e) => {
    let userr = e.target.value;
    console.log(userr);
    if (!userr) {
      getUserLists();
    } else {
      axios.get(`${adminSearchUser}/${userr}`).then((res) => {
        setUsers(res.data.users);
      });
    }
  }

  const deleteUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${adminDeleteUser}/${id}`).then((res) => {
          getUserLists();
        });
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        );
      }
    });
  }

  const blockUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to block this user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, block it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`/adminBlockUser/${id}`).then((res) => {
          getUserLists();
        });
        Swal.fire(
          'Blocked!',
          'User has been blocked.',
          'success'
        );
      }
    });
  }

  // Calculate the total number of pages based on the number of users and users per page
  const pageCount = Math.ceil(users.length / usersPerPage);

  // Function to handle page change
  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Calculate the users to display on the current page
  const displayedUsers = users.slice(pageNumber * usersPerPage, (pageNumber + 1) * usersPerPage);

  return (
    <div style={{ backgroundColor: '#fffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <AdminSidebar />
        <div style={{ flex: 1 }}>
          <br />
          <br />
          <TextField
            className="searchadmin"
            onChange={userSearch}
            label="Search"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* <Button
            variant="contained"
            className="addButtonAdmin"
            startIcon={<AddIcon />}
            onClick={() => navigate('/adminAddUser')}
          >
            Add
          </Button> */}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontSize : "24px"}}>No</TableCell>
                  <TableCell style={{fontSize : "24px"}}>User Name</TableCell>
                  <TableCell style={{fontSize : "24px"}}>Email</TableCell>
                  {/* <TableCell>Action</TableCell>                  */}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedUsers.map((obj, index) =>
                  <TableRow key={index + 1}>
                    <TableCell style={{fontSize : "24px"}}>{index + 1}</TableCell>
                    <TableCell style={{fontSize : "24px"}}>{obj.userName}</TableCell>
                    <TableCell style={{fontSize : "24px"}}>{obj.email}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                       
                        onClick={() => blockUser(obj._id)}
                      >
                        Block
                      </Button>
                    </TableCell> */}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add pagination component */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </div>
    </div>
  );
}

export default Usermanagement;
