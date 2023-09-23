import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminHeader.css';
import Swal from 'sweetalert2';
import LOGO from './LOGO.png'
function AdminHeader() {

  const navigate=useNavigate();

  const adminLogout=(e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Logout?',
        text: "Do you want to Logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout'
    }).then((result) => {
        if (result.isConfirmed) {            
            navigate('/admin')
                  }
    })
}
  return (
    // <nav class="navbar navbar-expand-lg adminHeadernav">
    // <div class="container-fluid">
    //   <a class="navbar-brand" href="/adminHome"  > ADMIN DASHBOARD</a>
    //   <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    //     <span class="navbar-toggler-icon"></span>
    //   </button>
    //   <div class="collapse navbar-collapse" id="navbarSupportedContent">
    //     <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    //       <li class="nav-item">
            
    //       </li>
    //       <li class="nav-item">
           
    //       </li>
    //       <li class="nav-item dropdown">
           
    //         <ul class="dropdown-menu">
             
    //         </ul>
    //       </li>
    //       <li class="nav-item">
            
    //       </li>
    //     </ul>
    //     <form class="d-flex" >

         <div className="nav-bar">
      <img className="melody" alt="Melody" src={LOGO} />
      <div className="overlap">
        <div className="nav-icons">
          <div className="profile">
            <div className="text-wrapper">Login</div>
            <div className="div">ADMIN</div>
          </div>
          {/* <div className="notification">
            <div className="ellipse" />
          </div>
          <div className="message">
            <div className="overlap-group">
              <img className="chat" alt="Chat" src="chat-134808-1.png" />
              <div className="ellipse-2" />
            </div>
          </div> */}
        </div>
        {/* <img className="parvathi-kumar" alt="Parvathi kumar" src="parvathi-kumar-4.png" />
        <img className="parvathi-kumar" alt="Parvathi kumar" src="parvathi-kumar-5.png" /> */}
      </div>
      {/* <img className="menu" alt="Menu" src="menu-4120096-1.png" /> */}
      <div className="search">
        <div className="overlap-2">
          <img className="img" alt="Search" src="search-3031293-1.png" />
          <input className="search-here" placeholder="Search Here" type="text" />
         
          {/* <button class="adminLogoutBtn" onClick={adminLogout} >Logout</button> */}
        
      </div>
    </div>
  </div>
  )
}

export default AdminHeader


// import React from "react";
// import "./style.css";

// export const NavBar = () => {
//   return (
//     <div className="nav-bar">
//       <img className="melody" alt="Melody" src="melody.png" />
//       <div className="overlap">
//         <div className="nav-icons">
//           <div className="profile">
//             <div className="text-wrapper">Login</div>
//             <div className="div">Pallavi</div>
//           </div>
//           <div className="notification">
//             <div className="ellipse" />
//           </div>
//           <div className="message">
//             <div className="overlap-group">
//               <img className="chat" alt="Chat" src="chat-134808-1.png" />
//               <div className="ellipse-2" />
//             </div>
//           </div>
//         </div>
//         <img className="parvathi-kumar" alt="Parvathi kumar" src="parvathi-kumar-4.png" />
//         <img className="parvathi-kumar" alt="Parvathi kumar" src="parvathi-kumar-5.png" />
//       </div>
//       <img className="menu" alt="Menu" src="menu-4120096-1.png" />
//       <div className="search">
//         <div className="overlap-2">
//           <img className="img" alt="Search" src="search-3031293-1.png" />
//           <input className="search-here" placeholder="Search Here" type="text" />
//         </div>
//       </div>
//     </div>
//   );
// };
