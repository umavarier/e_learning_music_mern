import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const AdminEditPricing = ({
  open,
  onClose,
  pricingToEdit,
  onPricingUpdated,
}) => {
  const [editedPricing, setEditedPricing] = useState({ ...pricingToEdit });

  useEffect(() => {
    setEditedPricing({ ...pricingToEdit });
  }, [pricingToEdit]);

  const handleUpdatePricing = () => {
    const accessToken = Cookies.get("token");
    const decodedToken = jwt_decode(accessToken);
    axios
      .put(`/adminEditPricing/${editedPricing._id}`, editedPricing, {
        headers: {
          Authorization: `${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          onPricingUpdated(editedPricing);
          onClose();
          toast.success("Pricing data updated successfully")
        } else {
          console.error("Error updating pricing data:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating pricing data:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedPricing({
      ...editedPricing,
      [name]: value,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6">Edit Pricing Detail</Typography>
        <TextField
          label="Plan Number"
          name="planNumber"
          style={{ fontSize: "24px"}}
          value={editedPricing.planNumber}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Plan Name"
          name="planName"
          style={{ fontSize: "24px"}}
          value={editedPricing.planName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Number of Classes"
          name="numberOfClasses"
          style={{ fontSize: "24px"}}
          value={editedPricing.numberOfClasses}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Price"
          name="price"
          style={{ fontSize: "24px"}}
          value={editedPricing.price}
          onChange={handleChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdatePricing}
        >
          Update Pricing
        </Button>
      </Box>
    </Modal>
  );
};

export default AdminEditPricing;
