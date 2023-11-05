import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../../utils/axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
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
    <div>
      <Button variant="contained" onClick={openModal}>
        Upload Profile Picture
      </Button>

      <Modal open={modalOpen} onClose={closeModal}>
        <Card>
          <CardHeader title="Upload Your Profile Picture" />
          <CardContent>
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
  );
}

export default TeacherProfilePictureUpload;
