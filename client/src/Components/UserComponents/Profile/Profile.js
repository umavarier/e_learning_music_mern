import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { imageUpload, verifyUserToken } from "../../../Utils/constants";
import { changeImage } from "../../../Redux/userSlice";
import { changeUsername } from "../../../Redux/userSlice";
// import { setUser } from "../../../Redux/userSlice";
import axios from "../../../Utils/axios";
import Header from "../Home/Header";
import Swal from "sweetalert2";
import Modal from "react-modal";
import jwt_decode from "jwt-decode";
import EnrolledCourses from "./EnrolledCourse";
import PaymentHistoryModal from "./PaymentHistoryModal";
import ProgressCard from "./ProgressCard";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatComponent from "../ChatComponent";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { Button as MUIButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";

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
  const [users, setUsers] = useState([]); // State to store the list of users
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserForChat, setSelectedUserForChat] = useState(null);
  const [chatWindows, setChatWindows] = useState([]);
  const [sortedChatList, setSortedChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // const userImage = useSelector((state) => state.userImage);

  // console.log("image from redux store : " + userImage);
  const userToken = localStorage.getItem("userdbtoken");
  const decodedToken = jwt_decode(userToken);
  const studentId = decodedToken._id;
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

  const handleBooking = () => {
    navigate("/UserDemoBookings");
  };
  // const filteredCourses = courses.filter((course) => {
  //   const courseTitle = course.title || ""; // Ensure course.title is defined
  //   const searchTermLowerCase = searchTerm.toLowerCase();
  //   return courseTitle.toLowerCase().includes(searchTermLowerCase);
  // });

  useEffect(() => {
    axios
      .get(`/getPaymentHistory/${userId}`)
      .then((response) => {
        setPaymentHistory(response.data);
        // console.log("paymenthistory    " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching payment history:", error);
      });
  }, [userId]);

  const openPaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(true);
  };

  const closePaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(false);
  };
  //   console.log("ph" +JSON.stringify(paymentHistory))
  // console.log("pc" +purchasedCourse)

  useEffect(() => {
    const token = localStorage.getItem("userdbtoken");
    const decodedToken = jwt_decode(token);
    console.log("ddddd   " + JSON.stringify(decodedToken));
    const studentId = decodedToken._id;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/GetAllTeachersList", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUsers(response.data);

        const unreadMessagesData = {};
        response.data.forEach((user) => {
          unreadMessagesData[user._id] = user.unreadMessages || 0;
        });
        setUnreadMessages(unreadMessagesData);

        const sortedUsers = response.data.sort((a, b) => {
          const latestMessageA = a.latestMessage
            ? new Date(a.latestMessage.timestamp)
            : new Date(0);
          const latestMessageB = b.latestMessage
            ? new Date(b.latestMessage.timestamp)
            : new Date(0);

          return latestMessageB - latestMessageA;
        });
        setSortedChatList(sortedUsers);
        console.log("chat? " + JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userToken]);

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };
  const handleChatIconClick = (user) => {
    setSelectedChat(user);
  };

  const handleCloseChat = (userId) => {
    setChatWindows((prevWindows) =>
      prevWindows.filter((window) => window.userId !== userId)
    );
  };

  const openChatList = (event) => {
    setAnchorEl(event.currentTarget);
    setIsChatListOpen(true);
  };

  const closeChatList = () => {
    setAnchorEl(null);
    setIsChatListOpen(false);
  };

  return (
    <>
      <div>
        <Header />
        <div className="row">
          <div className="col-md-2">
            <div className="card rounded " style={{ border: "none" ,backgroundColor:"#fff", marginTop : "10p"}}>
              <div className="card-body text-center">
                <img
                  className="rounded-circle mt-3"
                  width={250}
                  // src={`https://melodymusic.online/uploads/${profilePhoto}`}
                  src={`http://localhost:4000/uploads/${profilePhoto}`}
                  alt="profile photo"
                />
                <h5 className="mt-3 font-weight-bold text-dark"  style={{fontSize:"24px"}}>{userName}</h5>
                <p className="text-muted">{email}</p>
                <MUIButton
                  onClick={addImage}
                  variant="contained"
                  color="primary"
                  style={{ width: "300px", marginBottom: "8px" ,backgroundColor:"#fff", color:"black", fontSize:"24px"}}
                >
                  <EditIcon /> Update Image
                </MUIButton>
              </div>

              {/* Profile Icons */}
              <div className="profile-icons">
                <MUIButton
                  onClick={openPaymentHistoryModal}
                  variant="contained"
                  color="primary"
                  style={{ width: "300px", marginBottom: "8px" ,marginLeft : "25px",justifyContent:"center",backgroundColor:"#fff", color:"black", fontSize:"24px"}}
                >
                  <HistoryIcon /> Payment History
                </MUIButton>
                <MUIButton
                  onClick={handleBooking}
                  variant="contained"
                  color="primary"
                  style={{ width: "300px",justifyContent:"center",marginLeft : "25px", marginTop :"30px",backgroundColor:"#fff", color:"black", fontSize:"24px"}}
                  
                >
                  <EventIcon /> Your Bookings
                </MUIButton>
              </div>
           

            <Button
              onClick={openChatList}
              variant="contained"
              color="primary"
              style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                width: "200px",
              }}
            >
              Chat with Teacher
            </Button>
          </div>
          <Popover
            open={isChatListOpen}
            anchorEl={anchorEl}
            onClose={closeChatList}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div style={{ padding: 16 }}>
              <h3>Chat With Teacher</h3>
              {sortedChatList.map((user) => (
                <div key={user._id} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      backgroundColor: "primary",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleChatIconClick({
                        _id: user._id,
                        userName: user.userName,
                      })
                    }
                  >
                    <MUIButton
                      variant="contained"
                      color="primary"
                      style={{ width: "380px" }}
                    >
                      {user.userName}
                    </MUIButton>
                  </div>
                  {unreadMessages[user._id] > 0 && (
                    <span style={{ color: "red", marginLeft: "5px" }}>
                      {unreadMessages[user._id]}
                    </span>
                  )}
                  {selectedChat && selectedChat._id === user._id && (
                    <ChatComponent
                      userId={userId}
                      userType="user"
                      recipientId={selectedChat._id}
                      recipientType={selectedChat.type}
                      senderName={selectedChat.userName}
                    />
                  )}
                </div>
              ))}
            </div>
          </Popover>
        </div>

        {/* Right Side */}
        <div className="col-md-10">
          <div className="enroll-card">
            <div className="row">
              <div className="enroll-column col-md-12">
                <EnrolledCourses />
              </div>
            </div>
          </div>

          
          <PaymentHistoryModal
            isOpen={isPaymentHistoryModalOpen}
            onRequestClose={closePaymentHistoryModal}
            paymentHistory={paymentHistory}
            purchasedCourse={purchasedCourse}
          />
        </div>
      </div>
      </div>
    </>
  );
}

export default Profile;
