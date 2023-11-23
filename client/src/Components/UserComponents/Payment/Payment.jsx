import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./payment.css";
import PayPal from "../PayPal/PayPal";
import axios from "../../../Utils/axios";
import Header from "../Home/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import jwt_decode from "jwt-decode";

const PaymentPage = () => {
  const location = useLocation();
  const { pricingPlan } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectTeacherId, setSelectTeacherId] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState([]);
  const [teacherIdArray, setTeacherIdArray] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [enrollmentCompleted, setEnrollmentCompleted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();
  // const userId = useSelector((state) => state.user.userId);
  const [enrolledCourseName, setEnrolledCourseName] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userdbtoken");
    if (userToken) {
      const decodedToken = jwt_decode(userToken);
      console.log("decod " + JSON.stringify(decodedToken));
      if (decodedToken) {
        setUserId(decodedToken._id);
      }
    }
  }, []);

  useEffect(() => {
    axios.get("/viewCourses").then((response) => {
      if (response.data && response.data.length > 0) {
        setCourses(response.data);
        // setCourseId(response.data[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((course) => course._id === selectedCourse);
      const instructorIds = course?.instructorIds || [];
      console.log("Inst" + JSON.stringify(instructorIds));
      axios
        .get(`/teachers/fetchTeacherNamesForCourse/${selectedCourse}`)
        .then((response) => {         
          setTeachers(response.data.teachers);
          console.log("selectedTeachers:", response);
        })
        .catch((error) => {
          console.error(
            "Error fetching teachers for the selected course",
            error
          );
        });
    }
  }, [selectedCourse, courses]);

   
  // console.log("pricingplan " + JSON.stringify(pricingPlan));
  const price = pricingPlan.price;

  async function displayRazorpay(price) {
    // console.log("pppppppp" + price);
    const paymentMethod = "ONLINE PAYMENT";
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: "rzp_test_VdGdvprTKB8u1w",
      currency: "INR",
      amount: price * 100,
      name: "MELODY",
      description: "Thanks for purchasing",
      image:
        "https://mern-blog-akky.herokuapp.com/static/media/logo.8c649bfa.png",
      handler: async function (response) {
        // Handle successful payment response from Razorpay

        // Only proceed with order placement if payment is successful
        if (response.razorpay_payment_id) {
          axios
            .post("/process-payment", {
              amount: pricingPlan.price,
              paymentMethod: paymentMethod,
              userId: userId,
              purchasedCourse: selectedCourse,
              teacherId: selectedTeacher,
            })
            .then((response) => {
              if (response.data.success) {
                setPaymentSuccess(true);
              } else {
                console.error("Payment failed.");
              }
            })
            .catch((error) => {
              console.error("Error processing payment: ", error);
            });
        }
      },
      prefill: {
        name: "MELODY",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  // console.log(paymentSuccess + "  what???");
  const enrollUser = async () => {
    console.log("enrol" + selectedTeacher);
    try {
      const response = await axios.post("/courses/enroll-user", {
        userId: userId,
        courseId: selectedCourse,
        teacherId: selectedTeacher,
      });
      // console.log("enrolres" + JSON.stringify(response.data));
      if (response.data.success) {
        const enrolledCourse = selectedCourse;
        if (enrolledCourse) {
          setEnrolledCourseName(enrolledCourse.name);
        }
        setIsSuccessModalOpen(true);
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

  const customStyles = {
    content: {
      width: "30%",
      height: "20%",
      top: "20%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

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
        <label>Select a Teacher:</label>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Select a Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.userName}
            </option>
          ))}
        </select>


        {checkout ? (
          <button
            className="payment-button"
            onClick={() => displayRazorpay(price)} 
          >
            Pay Now
          </button>
        ) : (
          <button className="payment-button" onClick={() => setCheckout(true)}>
            Pay Now
          </button>
        )}

        {paymentSuccess && !enrollmentCompleted && (
          <p>Processing enrollment...</p>
        )}
        <Modal
          isOpen={isSuccessModalOpen}
          onRequestClose={() => setIsSuccessModalOpen(false)}
          contentLabel="Success Modal"
          style={customStyles}
        >
          <h2>Payment Successful!</h2>
          <p>You are now enrolled in the course  {enrolledCourseName}</p>
          <button style={{justifyContent:"center"}} onClick={() => navigate("/")}>Yaaayy!!!</button>
        </Modal>
      </div>
    </>
  );
};
export default PaymentPage;
