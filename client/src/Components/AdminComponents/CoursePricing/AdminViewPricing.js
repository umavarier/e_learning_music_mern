import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Utils/axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditPricingModal from "./EditPricingModal";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const PricingDetails = () => {
  const [pricingDetails, setPricingDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pricingToEdit, setPricingToEdit] = useState(null);

  useEffect(() => {
    axios
      .get("/adminGetPricingDetails")
      .then((response) => {
        setPricingDetails(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pricing details:", error);
        setIsLoading(false);
      });
  }, []);

  const handleAddPricingClick = () => {
    navigate("/adminUpdateEnrollmentPricing");
  };

  const handleEditPricing = (pricing) => {
    setPricingToEdit(pricing);
    setEditModalOpen(true);
  };

  const handleDeletePricing = (pricing) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this pricing data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
      axios
        .delete(`/adminDeletePricing/${pricing._id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("pricing data deleted successfully ")
            fetchPricingData();
          } else {
            console.error("Error deleting pricing data:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error deleting pricing data:", error);
        });
    }
  })
};

  const fetchPricingData = () => {

    axios
      .get("/adminGetPricingDetails")
      .then((response) => {
        if (response.status === 200) {
          setPricingDetails(response.data);
        } else {
          console.error("Error fetching pricing data:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching pricing data:", error);
      });
  };

  const handlePricingUpdated = (updatedPricing) => {
    console.log("Updated Pricing Data:", updatedPricing);

    const updatedPricingDetails = pricingDetails.map((pricing) =>
      pricing._id === updatedPricing._id ? updatedPricing : pricing
    );

    setPricingDetails(updatedPricingDetails);
    setEditModalOpen(false);
  };

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPricingClick}
      >
        Add Pricing
      </Button>
      <h2>Pricing Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th style={{ fontSize: "24px"}}>Plan Number</th>
                <th style={{ fontSize: "24px"}}>Plan Name</th>
                <th style={{ fontSize: "24px"}}>Number of Classes</th>
                <th style={{ fontSize: "24px"}}>Price</th>
                <th style={{ fontSize: "24px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingDetails.map((pricing, index) => (
                <tr key={index}>
                  <td style={{ fontSize: "24px"}}>{pricing.planNumber}</td>
                  <td style={{ fontSize: "24px"}}>{pricing.planName}</td>
                  <td style={{ fontSize: "24px"}}>{pricing.numberOfClasses}</td>
                  <td style={{ fontSize: "24px"}}>{pricing.price}</td>
                  <td style={{marginRight:"10px"}}>
                    <EditIcon
                      color="primary"
                      onClick={() => handleEditPricing(pricing)}
                      style={{ cursor: "pointer" }}
                    />
                    <DeleteIcon
                      color="error"
                      onClick={() => handleDeletePricing(pricing)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <EditPricingModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        pricingToEdit={pricingToEdit}
        onPricingUpdated={handlePricingUpdated}
      />
    </div>
    </div>
    </div>
  );
};

export default PricingDetails;
