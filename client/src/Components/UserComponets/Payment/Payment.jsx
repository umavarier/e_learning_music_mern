import React, { useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import './payment.css'
import PayPal from "../PayPal/PayPal";
import axios from '../../../utils/axios'
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { selectedPricing } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); // Default payment method
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkout, setCheckout]= useState(false)
  const navigate = useNavigate();
 
  const handlePayment = () => {
    // setPaymentSuccess(true);
    // setCheckout(true)

    const handlePayment = async () => {
        try {
          // Send a request to backend to process the payment
          const response = await axios.post('/process-payment', {
            amount: selectedPricing.price,
            paymentMethod: paymentMethod,
          });
    
          // If payment is successful, set paymentSuccess to true
          if (response.data.success) {
            setPaymentSuccess(true);
          } else {
            // Handle payment failure
            console.error("Payment failed.");
          }
        } catch (error) {
          // Handle errors
          console.error("Error processing payment: ", error);
        }
      };
  };

  const enrollUser = async () => {
    try {
      
      const response = await axios.post('/enroll-user', {
        userId: selectedPricing.userId, 
        courseId: selectedPricing.courseId,
      });

      if (response.data.success) {
        // User has been successfully enrolled in the course
        alert("Payment successful. You are now enrolled in the course.");
        navigate('/'); 
      } else {
        // Handle enrollment failure
        console.error("Enrollment failed.");
      }
    } catch (error) {
      // Handle any errors that occur during the enrollment process
      console.error("Error enrolling user: ", error);
    }
  };
  useEffect(() => {
    if (paymentSuccess) {      
      enrollUser();
    }
  }, [paymentSuccess]);

  return (
    <div className="payment-container"> 
      <h2>Payment Page</h2>
      <div>
        <h3>Selected Pricing:</h3>
        <p className="pricing-info">Plan Name: {selectedPricing?.planName}</p>
        <p className="pricing-info">Number of Classes: {selectedPricing.numberOfClasses}</p>
        <p className="pricing-info">Price: ₹{selectedPricing.price}</p>
      </div>

      <h3>Select Payment Method:</h3>
      <div>
        {/* <label>
          <input
            type="radio"
            value="creditCard"
            checked={paymentMethod === "creditCard"}
            onChange={() => setPaymentMethod("creditCard")}
          />
          Credit Card
        </label>
        
        <label>
          <input
            type="radio"
            value="debitCard"
            checked={paymentMethod === "debitCard"}
            onChange={() => setPaymentMethod("debitCard")}
          />
          Debit Card
        </label> */}
        
        <label>
          <input
            type="radio"
            value="onlinePayemnt"
            checked={paymentMethod === "OnlinePayment"}
            onChange={() => setPaymentMethod("OnlinePayment")}
          />
          Online Payment
        </label>
        
        {/* Add more payment method options here (e.g., PayPal, etc.) */}
      </div>
        {checkout ? (
            <PayPal amount={selectedPricing.price} />
        ): (
      <button className="payment-button" onClick={handlePayment}>Pay Now</button>
      )}
      {paymentSuccess && (
        <div>
          <p>Payment Successful!</p>
         alert("payment success. enrolled")
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
