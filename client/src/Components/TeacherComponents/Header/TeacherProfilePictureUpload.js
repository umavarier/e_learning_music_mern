import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../../Utils/axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import AdminHeader from "../Header/TeacherHeader";
import { setTeacherProfilePicture } from "../../../Redux/teacherSlice";

function TeacherProfilePictureUpload() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const fileInputRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProfilePhoto = async () => {
    try {
      const accessToken = Cookies.get("token");
      const decodedToken = jwt_decode(accessToken);
      const teacherId = decodedToken.id;

      const response = await axios.get(`/teachers/fetchProfilePhoto/${teacherId}`, {
        headers: {
          Authorization: ` ${Cookies.get("token")}`,
        },
      });
      setProfilePhotoURL(response.data.profilePhotoUrl);
      console.log("propic-t  " + JSON.stringify(response.data.profilePhotoUrl));
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  };

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    dispatch(setTeacherProfilePicture(URL.createObjectURL(file)));
    setProfilePhotoURL(URL.createObjectURL(file));
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", selectedFile);
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    const teacherId = decodedToken.id;
    formData.append("teacherId", teacherId);

    try {
      axios
        .post("/teachers/teacherUploadProfilePhoto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${accessToken}`,
          },
        })
        .then((response) => {
          toast.success("Profile picture uploaded successfully");
          closeModal();
          navigate("/teacherHome");
        })
        .catch((error) => {
          toast.error("Error uploading profile picture");
          console.error("Error uploading profile picture:", error);
        });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <>
     <AdminHeader />
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
     
      <Button variant="contained" onClick={openModal}>
        Upload Profile Picture
      </Button>

      <Modal open={modalOpen} onClose={closeModal} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ maxWidth: 400, textAlign: "center" }}>
          <CardHeader title="Teacher Profile Picture Upload" />
          <CardContent>
            <img
              src={profilePhotoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              alt="Profile Picture"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Profile Picture"
                style={{ maxWidth: "100%" }}
              />
            )}
            <Button variant="contained" onClick={uploadProfilePicture}>
              Upload
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </div>
    </>
  );
}


export default TeacherProfilePictureUpload;
