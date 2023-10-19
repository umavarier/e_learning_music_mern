import React, { useState } from "react";
import axios from "../../../utils/axios";
import "./AdminEnrollmentPricing.css";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Header/AdminSidebar";

function AdminEnrollmentPricing() {
  const [classPricing, setClassPricing] = useState([]);
  const [numberOfClasses, setNumberOfClasses] = useState("");
  const [classPrice, setClassPrice] = useState("");
  const [planName, setPlanName] = useState("");
  const [planNumber, setPlanNumber] = useState(1);

  const handleAddClassPricing = () => {
    if (numberOfClasses && classPrice && planName && planNumber) {
      const updatedClassPricing = [
        ...classPricing,
        {
          planNumber: parseInt(planNumber),
          planName:planName,
          numberOfClasses: parseInt(numberOfClasses),
          price: parseFloat(classPrice),
        },
      ];
      setClassPricing(updatedClassPricing);
      setPlanNumber(1);
      setPlanName("");
      setNumberOfClasses("");
      setClassPrice("");
    }
  };

  const handleSubmit = async () => {
    try {
      // Send a POST request to update enrollment pricing on the backend
      console.log("Class Pricing:");
      classPricing.forEach((item) => {
        console.log("Plan Number: " + item.planNumber);
        console.log("Name of Plan: " + item.planName);
        console.log("Number of Classes: " + item.numberOfClasses);
        console.log("Class Price: " + item.price);
      });

      await axios.post("/adminUpdateEnrollmentPricing", {
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
                  <br />
                  <div>
                    <label>
                      Plan Number:
                      <input
                        type="number"
                        value={planNumber}
                        onChange={(e) => setPlanNumber(e.target.value)}
                      />
                    </label>

                    <label>
                      Name of the Plan:
                      <input
                        type="string"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                      />
                    </label>

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
                      <li key={index}>
                        {`Plan ${item.planNumber}: ${item.PlanName}, ${item.numberOfClasses} classes - ${item.price} rupees`}
                      </li>
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
