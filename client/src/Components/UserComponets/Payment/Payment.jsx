import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./payment.css";
import PayPal from "../PayPal/PayPal";
import axios from "../../../utils/axios";
import Header from "../Home/Header"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const location = useLocation();
  const { pricingPlan } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); 
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId,setCourseId] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [enrollmentCompleted, setEnrollmentCompleted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {    
    axios.get("/viewCourses").then((response) => {
     
      if (response.data && response.data.length > 0) {
        setCourses(response.data);
        setCourseId(response.data[0]._id);
      }
    });
  }, []);

  const handlePayment =async () => {
    try {
      console.log("pricingplan " + JSON.stringify(pricingPlan));
      console.log("pricingPlan.price"+pricingPlan.price)
      console.log("paymentMethod "+paymentMethod)
      console.log("userId"+userId)
      const response = await axios.post("/process-payment", {
        amount: pricingPlan.price,
        paymentMethod: paymentMethod,
        userId: userId,
      });
      console.log(response.data +" paymentres")
      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        console.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  }
  console.log(paymentSuccess+"  what???")
  const enrollUser = async () => {
    console.log("enrol")
    try {
      console.log("pricingPlan.courseId "+courseId)
      console.log("pricingPlan.userId "+userId)
      const response = await axios.post("/courses/enroll-user", {
        userId: userId,
        courseId: courseId,
      });
      console.log("enrolres" + JSON.stringify(response.data))
      if (response.data.success) {
        alert("Payment successful. You are now enrolled in the course.");
        navigate("/"); 
      } else {
        console.error("Enrollment failed.");
      }
    } catch (error) {
      console.error("Error enrolling user: ", error);
    }
  };
  
  useEffect(() => {
    if (paymentSuccess) {
      enrollUser();
    }
  }, [paymentSuccess]);

  return (
    <>
    <Header />
    <div className="payment-container">
      <h2>Payment Page</h2>
      {pricingPlan && (
        <div>
          <h3>Selected Pricing:</h3>
          <p className="pricing-info">Plan Name: {pricingPlan?.planName}</p>
          <p className="pricing-info">
            Number of Classes: {pricingPlan.numberOfClasses}
          </p>
          <p className="pricing-info">Price: ₹{pricingPlan.price}</p>
        </div>
      )}
      <h3>Select Payment Method:</h3>
      <div>
        <label>
          <input
            type="radio"
            value="onlinePayment"
            checked={paymentMethod === "onlinePayment"}
            onChange={() => setPaymentMethod("onlinePayment")}
          />
          Online Payment
        </label>
      </div>
      <h3>Select Course:</h3>
      <div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {checkout ? (
        <PayPal amount={pricingPlan.price} onSuccess={handlePayment} />
      ) : (
        <button
          className="payment-button"
          onClick={() => setCheckout(true)} 
        >
          Pay Now
        </button>
      )}
      {paymentSuccess && !enrollmentCompleted && (
        <p>Processing enrollment...</p>
      )}
      {enrollmentCompleted && (
        <p>Enrollment Successful! You are now enrolled in the course.</p>
      )}
    </div>
    </>
  );
};
export default PaymentPage;
