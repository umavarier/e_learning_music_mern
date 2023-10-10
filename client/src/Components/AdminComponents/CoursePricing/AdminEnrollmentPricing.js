import React, { useState } from "react";
import axios from "../../../utils/axios";
import "./AdminEnrollmentPricing.css";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";

function AdminEnrollmentPricing() {
  const [enrollmentFee, setEnrollmentFee] = useState(0);
  const [classPricing, setClassPricing] = useState([]);
  const [numberOfClasses, setNumberOfClasses] = useState("");
  const [classPrice, setClassPrice] = useState("");

  const handleAddClassPricing = () => {
    console.log("class " + classPrice);
    console.log("classNumber " + numberOfClasses);
    if (numberOfClasses && classPrice) {
      const updatedClassPricing = [
        ...classPricing,
        {
          numberOfClasses: parseInt(numberOfClasses),
          price: parseFloat(classPrice),
        },
      ];
      updatedClassPricing.forEach((item) => {
        console.log("numberOfClasses: " + item.numberOfClasses);
        console.log("classPrice: " + item.price);
      });
      setClassPricing(updatedClassPricing);
      setNumberOfClasses("");
      setClassPrice("");
    }
  };

  const handleSubmit = async () => {
    try {
      // Send a POST request to update enrollment pricing on the backend
      console.log("Class Pricing:");
      classPricing.forEach((item) => {
        console.log("Number of Classes: " + item.numberOfClasses);
        console.log("Class Price: " + item.price);
      });

      await axios.post("/adminUpdateEnrollmentPricing", {
        // enrollmentFee,
        classPricing,
      });
      alert("Enrollment pricing updated successfully");
    } catch (error) {
      console.error(error);
      alert("Error updating enrollment pricing");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="admin-enrollment-pricing-container">
              <div className="admin-enrollment-pricing">
                <h2>Admin Enrollment Pricing</h2>
                <form>
                  {/* <label>
          Enrollment Fee:
          <input type="number" value={enrollmentFee} onChange={(e) => setEnrollmentFee(e.target.value)} />
        </label> */}
                  <br />
                  <div>
                    <label>
                      Number of Classes:
                      <input
                        type="number"
                        value={numberOfClasses}
                        onChange={(e) => setNumberOfClasses(e.target.value)}
                      />
                    </label>
                    <label>
                      Class Price:
                      <input
                        type="number"
                        value={classPrice}
                        onChange={(e) => setClassPrice(e.target.value)}
                      />
                    </label>
                    <button type="button" onClick={handleAddClassPricing}>
                      Add Class Pricing
                    </button>
                  </div>
                  <br></br>
                  <ul>
                    {classPricing.map((item, index) => (
                      <li
                        key={index}
                      >{`${item.numberOfClasses} classes - ${item.price} rupees`}</li>
                    ))}
                  </ul>
                  <button type="button" onClick={handleSubmit}>
                    Update Pricing
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminEnrollmentPricing;
