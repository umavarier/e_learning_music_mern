import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import AdminHeader from '../Header/AdminHeader';
import axios from '../../../utils/axios';
import './users.css';
import { adminDeleteUser, admingetAllusers, adminSearchUser } from '../../../utils/Constants';
import { useNavigate } from 'react-router-dom';
import './userManagement.css';
import Swal from 'sweetalert2';
import AdminSidebar from '../Header/AdminSidebar';
import ReactPaginate from 'react-paginate'; // Import the pagination component

function Usermanagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0); // State to track the current page number
  const usersPerPage = 10; // Number of users to display per page

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
          <input class="form-control mb-3 w-25 searchadmin" onChange={userSearch} name="query" type="search" placeholder="Search" aria-label="Search" />
          <button class=" addButtonAdmin" onClick={() => navigate('/adminAddUser')}>add</button>

          <table id="customers" className='text-dark'>
            <tr>
              <th class="w-5">No</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Action</th>
              <th>Action</th>
            </tr>

            {displayedUsers.map((obj, index) =>
              <tr>
                <td>{index + 1}</td>
                <td>{obj.userName}</td>
                <td>{obj.email}</td>
                <td>
                  <button className='edit1' onClick={() => navigate(`/updateUser/${obj._id}`)}>Edit</button>
                </td>
                <td>
                  <button className='delete1' onClick={() => deleteUser(obj._id)}>Delete</button>
                </td>
              </tr>
            )}
          </table>

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
      {/* <Footer /> */}
    </div>
  );
}

export default Usermanagement;
