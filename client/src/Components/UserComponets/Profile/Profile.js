import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { imageUpload, verifyUserToken } from '../../../utils/Constants';
import { changeImage } from '../../../Redux/userimageReducer';
import { change } from '../../../Redux/usernameReducer';
import axios from '../../../utils/axios'
import Header from '../Home/Header';
import Swal from 'sweetalert2';
import './Profile.css'

function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState('')
    const [email, setemail] = useState('')
    const [image, setImage] = useState('')
    const [courses, setCourses] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    const userImage = useSelector((state) => {
        return state.userImage;
    })

    // useEffect(() => {
    //     const Token = localStorage.getItem('token');

    //     if (!Token) {
    //         navigate('/');
    //     } else {
    //         const body = JSON.stringify({ Token });
    //         axios.post(verifyUserToken, body, { headers: { "Content-Type": "application/json" } }).then((res) => {
    //                 setName(res.data.user.userName)
    //                 setemail(res.data.user.email)
    //                 setImage(res.data.user.image)
    //                 dispatch(change(res.data.user.userName))
    //                 dispatch(changeImage(res.data.user.image))               
    //         })
    //         axios.get('/viewCourses')
    //         .then((res) => {
    //           setCourses(res.data); // Assuming courses are stored in state
    //         })
    //         .catch((err) => {
    //           console.error("Error fetching courses:", err);
    //         })
    //     }
    // }, [navigate, dispatch]);

    const addImage = async () => {
        const { value: file } = await Swal.fire({
            title: 'Select image',
            input: 'file',

            inputAttributes: {
                'accept': 'image/*',
                'aria-label': 'Upload your profile picture'
            }
        })

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                Swal.fire({

                    title: "Your Image",
                    imageUrl: e.target.result,
                    imageHeight: 400,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    denyButtonText: `Change`,
                }).then((result) => {                    
                    if (result.isConfirmed) {
                        uploadimg(file)
                    } else if (result.isDenied) {
                        addImage()
                    }
                })
            }
            reader.readAsDataURL(file)
        }
        function uploadimg(file) {
            const Token2 = localStorage.getItem("token");
            let Stoken = JSON.stringify(Token2)
            let formData = new FormData();
            formData.append("image", file)
            axios.post(`${imageUpload}/${Stoken}`, formData,).then((res) => {
                setImage(res.data.image)
                dispatch(changeImage(res.data.image))
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    const enrollInCourse = (courseId) => {

    }
    const handleSearch = (e) => {
      if (e.target && e.target.value) {
        setSearchTerm(e.target.value);
      }
    };
    const filteredCourses = courses.filter((course) => {
      const courseTitle = course.title || ''; // Ensure course.title is defined
      const searchTermLowerCase = searchTerm.toLowerCase();
      return courseTitle.toLowerCase().includes(searchTermLowerCase);
    });
    

    return (
        <div>
          <Header />
          <div className="container mt-5">
            <div className="row">
             
              {/* Main Content */}
              <div className="col-md-5">
                <div className="card border-2 rounded shadow-sm">
                  <div className="card-body">
                    <h4 className="mb-4">Profile Settings</h4>
                    <div className="form-group">
                      <label className="labels">Name</label>
                      <input className="form-control" value={name} />
                    </div>
                    <div className="form-group">
                      <label className="labels">Email</label>
                      <input className="form-control" value={email} />
                    </div>
                   
                    <br />
                    
                  </div>
                </div>
              </div>
               {/* Sidebar */}
               <div className="col-md-3">
                <div className="card border-2 rounded shadow-sm">
                  <div className="card-body text-center">
                    <img
                      className="rounded-circle mt-3"
                      width={150}
                      src={userImage}
                      alt="profile photo"
                    />
                    <h5 className="mt-3 font-weight-bold">{name}</h5>
                    <p className="text-muted">{email}</p>
                    <button onClick={addImage} type="button" className="btn btn-primary">
                      Update Image
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
  <div className="card border-2 rounded shadow-sm">
    <div className="card-body">
      <h4 className="mb-4">Available Courses</h4>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search courses"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {courses.map((course) => (
          <li className="list-group-item" key={course.id}>
            <h5>{course.title}</h5>
            <p>Category: {course.name}</p>
            <p>Instructor: {course.instructor}</p>
            <p>Price: ${course.price}</p>
            <button onClick={() => enrollInCourse(course.id)} className="btn btn-primary">
              Enroll
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

            </div>
          </div>
        </div>
      );
}

export default Profile