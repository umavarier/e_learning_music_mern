import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";
import Swal from "sweetalert2";
import LOGO from "./LOGO.png";

function AdminHeader() {
  const navigate = useNavigate();

  const adminLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Logout?",
      text: "Do you want to Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin");
      }
    });
  };

  return (
    <div className="nav-bar">
      <img className="melody" alt="Melody" src={LOGO} />
      <div className="overlap">
        <div className="profile">
          {/* <div className="text-wrapper">Login</div> */}
          <div className="name11">ADMIN</div>
        </div>
      </div>
      <div className="search">
        <div className="overlap-2">
          {/* Move the logout button to the rightmost side */}
          <button className="adminLogoutBtn" onClick={adminLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
