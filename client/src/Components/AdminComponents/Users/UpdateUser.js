import React, { useEffect, useState } from 'react'
import AdminHeader from '../Header/AdminHeader';
import axios from '../../../Utils/axios'
import './updateUser.css'
import { adminEditUser, adminUpdateUser } from '../../../Utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'

function UpdateUser() {
  const params=useParams();
  const navigate=useNavigate();
  const [userName,setUserName]= useState('');
  const [email,setEmail] = useState('');

  useEffect(()=>{
      axios.get(`${adminEditUser}/${params.id}`).then((res)=>{
          console.log(res.data.userData);
          setEmail(res.data.userData.email);
          setUserName(res.data.userData.userName);
      }).catch((err)=>{
        alert(err)
      })
  },[])


  const updateUserDetails=async(e)=>{
    const body={userName:userName,email:email}
    e.preventDefault(e);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',      
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if(body.email=="" || body.userName ==""){
          Swal.fire(
            'Please Fill the all the fields',
            'question'
          )
        }else{
          axios.put(`${adminUpdateUser}/${params.id}`,body, { headers: { "Content-Type": "application/json" } }).then((response)=>{
              console.log(response.data)
              if(response.data.userexists){
                Swal.fire({
                  title: 'USER ALREADY EXISTS',
                  text: "try again",
                  height: "5rem",
              })
              }else{  
                swalWithBootstrapButtons.fire(
                  'Updated!',
                  'User details has been Updated.',
                  'success'
                )
                navigate('/users')
              }
          }).catch((err)=>{
            Swal.fire({
              title: 'Oops...',
              text: "try again",
              height: "5rem",
          })
          })
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'User details is not updated:)',
          'error'
        )
      }
    })
  }
  
  return (
    <div style={{ backgroundColor: '#0b0c2a', minHeight: '100vh' }}>
      <AdminHeader />

      <form className='updateForm' onSubmit={(e)=>updateUserDetails(e)}>

        <div className="container1">
          <h1 className='text-light'>UPDATE USER</h1>

          <label for="username" className="text-light"><b>Username</b></label>
          <input
            type="text"
            placeholder="Enter username"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            id="username"
            required=""
          />

          <label for="email" className="text-light"><b>Email</b></label>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            id="email"
            required=""
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="submit" style={{ width: '100px' }}>
              Update
            </button>
          </div>
        </div>
              </form>
      
    </div>
  )
}

export default UpdateUser