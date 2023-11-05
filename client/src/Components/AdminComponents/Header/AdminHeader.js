import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LOGO from "../../UserComponets/Home/logo-black.png";
import Cookies from "js-cookie";

const headerStyle = {
  backgroundColor: "#3498db",
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 20px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
};

const melodyStyle = {
  height: "40px",
};

const profileStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#fff",
  color: "black",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
  transition: "background-color 0.3s, transform 0.2s",
};

const logoutButtonStyle = {
  backgroundColor: "#fff", 
};

function AdminHeader() {
  const navigate = useNavigate();
  const isLoggedIn = Cookies.get("token") && Cookies.get("refreshToken");

  const handleAdminLogout = () => {
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
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        navigate("/adminLogin");
      }
    });
  };

  return (
    <div style={headerStyle}>
      <img style={melodyStyle} alt="Melody" src={LOGO} />
      <div style={profileStyle}>ADMIN</div>
      <div style={{ display: "flex", gap: "10px" }}>
        {isLoggedIn ? (
          <button
            style={{ ...buttonStyle, ...logoutButtonStyle }}
            onClick={handleAdminLogout}
          >
            Logout
          </button>
        ) : (
          <button
            style={buttonStyle}
            onClick={() => navigate("/adminLogin")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminHeader;
