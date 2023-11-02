import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import "./Pricing.css"; // Import your CSS file for styling
import Header from "../UserComponets/Home/Header";

const Pricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pricing data from the backend API
    axios
      .get("/getPricing")
      .then((response) => {
        setPricingData(response.data[0]?.classPricing || []);
        console.log("pricingdata " + JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching pricing data:", error);
      });
  }, []);
  const handleGetStartedClick = (pricingPlan) => {
    console.log("pd "+JSON.stringify(pricingData))
    navigate(`/payment`, { state: { pricingPlan } });
  };

  return (
    <>
      <Header />
      <div className="pricing-container">
        {/* <Header />  */}
        {/* Banner */}
        <div className="pricing-banner">
          <div className="pricing-banner-content">
            <h6>PRICING PLANS</h6>
            <p className="banner-price">
              Get Started with FREE Demo Now,
              <br />
              Pick a Plan Later
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="pricing-steps">
          <div className="step how-it-works">
            <div className="step-content">
              <h3>How it works?</h3>
              <p className="stepP">
                Starting Your Music Classes in 3 Simple Steps
              </p>
            </div>
          </div>
          <div className="steps-right">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Book</h3>
                <p className="stepP">
                  Register on our website book a DEMO. We will reach out to you
                  and schedule a FREE online Music class.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Experience</h3>
                <p className="stepP">
                  Meet the teacher, discuss your aspirations and get a sneak
                  peek of a typical Music class.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start</h3>
                <p className="stepP">
                  Like the demo session? Upgrade and start your Music lessons.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {pricingData.map((pricingPlan, index) => (
            <div className="pricing-card" key={index}>
              <div className="pricing-card-header">
                {/* <div className="pricing-card-number">{pricingPlan.planNumber}</div> */}
                <h3 className="pricing-plan-name">{pricingPlan.planName}</h3>
              </div>
              <div className="pricing-card-content">
                <p>{pricingPlan.numberOfClasses} Classes</p>
                <p className="pricing-price">₹ {pricingPlan.price}</p>
                <p>Beginner Lessons</p>
                <p> Online Classes</p>
                <p>45 min / Class</p>
                <p>Regional / English Instructions</p>
              </div>
              <button
                className="get-started-button"
                onClick={() => handleGetStartedClick(pricingPlan)}
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Pricing;
