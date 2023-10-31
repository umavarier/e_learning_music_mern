import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { imageUpload, verifyUserToken } from "../../../utils/Constants";
import { changeImage } from "../../../Redux/userSlice";
import { changeUsername } from "../../../Redux/userSlice";
// import { setUser } from "../../../Redux/userSlice";
import axios from "../../../utils/axios";
import Header from "../Home/Header";
import Swal from "sweetalert2";
import Modal from "react-modal";
import jwt_decode from "jwt-decode";
import EnrolledCourses from "./EnrolledCourse";
import PaymentHistoryModal from "./PaymentHistoryModal";
import ProgressCard from "./ProgressCard";


import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] =
    useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [purchasedCourse, setPurchasedCourse] = useState([]);
  const [totalHours] = useState(20); 
  const [videoCallCount, setVideoCallCount] = useState(0);

  // const userImage = useSelector((state) => state.userImage);

  // console.log("image from redux store : " + userImage);

  useEffect(() => {
    const userToken = localStorage.getItem("userdbtoken");
    if (userToken) {
      const decodedToken = jwt_decode(userToken);
      console.log("decod " + JSON.stringify(decodedToken));
      if (decodedToken) {
        setUserId(decodedToken._id);
        setUserName(decodedToken.userName);
        setEmail(decodedToken.email);
        // setProfilePhoto(decodedToken.image);
        // dispatch(changeImage(decodedToken.image));
      }
    }
  }, []);

  const addImage = async () => {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",

      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    });
    console.log("file " + file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Your Image",
          imageUrl: e.target.result,
          imageHeight: 400,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Update",
          denyButtonText: `Change`,
        }).then((result) => {
          if (result.isConfirmed) {
            uploadimg(file);
          } else if (result.isDenied) {
            addImage();
          }
        });
      };
      reader.readAsDataURL(file);
    }
    function uploadimg(file) {
      const Token = localStorage.getItem("userdbtoken");
      let formData = new FormData();
      formData.append("image", file);
      axios
        .post(`${imageUpload}/${userId}?token=${Token}`, formData)
        .then((res) => {
          setProfilePhoto(res.data.image);
          dispatch(changeImage(res.data.image));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  console.log("pro " + profilePhoto);
  const enrollInCourse = (courseId) => {};
  const handleSearch = (e) => {
    if (e.target && e.target.value) {
      setSearchTerm(e.target.value);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");

    const decodedToken = jwt_decode(token);
    const userId = decodedToken._id;
    axios
      .get(`/fetchUserProfilePhoto/${userId}`, {})
      .then((response) => {
        if (response.status === 200 && response.data.profilePhotoUrl) {
          console.log("url? " + response.data.profilePhotoUrl);
          setProfilePhoto(response.data.profilePhotoUrl);
          dispatch(changeImage(response.data.profilePhoto));
        }
      })
      .catch((error) => {
        console.error("Error fetching profile photo", error);
      });
  }, [userId]);

  // const filteredCourses = courses.filter((course) => {
  //   const courseTitle = course.title || ""; // Ensure course.title is defined
  //   const searchTermLowerCase = searchTerm.toLowerCase();
  //   return courseTitle.toLowerCase().includes(searchTermLowerCase);
  // });

  useEffect(() => {
    const storedPaymentHistory = localStorage.getItem('paymentHistory');
    if (storedPaymentHistory) {
      setPaymentHistory(JSON.parse(storedPaymentHistory));
    } else {
      axios.get(`/getPaymentHistory/${userId}`)
        .then((response) => {
          const data = response.data;
          setPaymentHistory(data);
          localStorage.setItem('paymentHistory', JSON.stringify(data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  
  const openPaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(true);
  };

  const closePaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(false);
  };
  console.log("ph" +paymentHistory)
console.log("pc" +purchasedCourse)

return (
  <div>
    <Header />
    <div className="row">
      <div className="col-md-2">
        {/* Left Sidebar */}
        <div className="card border-4 rounded shadow-sm">
          <div className="card-body text-center">
            <img
              className="rounded-circle mt-3"
              width={250}
              src={`http://localhost:4000/uploads/${profilePhoto}`}
              alt="profile photo"
            />
            <h5 className="mt-3 font-weight-bold">{userName}</h5>
            <p className="text-muted">{email}</p>
            <button
              onClick={addImage}
              type="button"
              className="btn btn-primary"
            >
              Update Image
            </button>
          </div>
          <div className="card border-2 rounded shadow-sm">
            <div className="card-body">
              <h4 className="mb-4">Profile Settings</h4>
              <div className="form-group">
                <label className="labels">Name</label>
                <input className="form-control" value={userName} />
              </div>
              <div className="form-group">
                <label className="labels">Email</label>
                <input className="form-control" value={email} />
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
      
      <div className="enroll-card col-md-10">
        {/* Right Content */}
        <div className="row">
          <div className="col-md-12">
            <EnrolledCourses />
          </div>
          <div className="col-md-12">
            <div className="card rounded shadow-sm">
              <ProgressCard totalHours={totalHours} videoCallCount={videoCallCount} />
            </div>
          </div>
        </div>
        <button onClick={openPaymentHistoryModal} className="btn btn-primary">
          Payment History
        </button>
        <PaymentHistoryModal
          isOpen={isPaymentHistoryModalOpen}
          onRequestClose={closePaymentHistoryModal}
          paymentHistory={paymentHistory}
          purchasedCourse={purchasedCourse}
        />
      </div>
    </div>
  </div>
);

}

export default Profile;
