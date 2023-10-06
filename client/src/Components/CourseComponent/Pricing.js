import React from 'react';
import './Pricing.css'; // Import your CSS file for styling
import Header from '../UserComponets/Home/Header';

const Pricing = () => {
  return (
    <div className="pricing-container">
      {/* <Header />  */}
      {/* Banner */}
      <div className="pricing-banner">
        <div className="pricing-banner-content">
          <h6>PRICING PLANS</h6>
          <p className="bannerP">
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
      <p className="stepP">Starting Your Music Classes in 3 Simple Steps</p>
    </div>
  </div>
  <div className="steps-right">
    <div className="step">
      <div className="step-number">1</div>
      <div className="step-content">
        <h3>Book</h3>
        <p className="stepP">
          Register on our website book a DEMO. We will reach out to you and
          schedule a FREE online Music class.
        </p>
      </div>
    </div>
    <div className="step">
      <div className="step-number">2</div>
      <div className="step-content">
        <h3>Experience</h3>
        <p className="stepP">
          Meet the teacher, discuss your aspirations and get a sneak peek of a
          typical Music class.
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
        {/* Basic */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-number">1</div>
            <h3>BASIC</h3>
          </div>
          <div className="pricing-card-content">
            <p>4 Classes / Month</p>
            <p>₹ 3600</p>
            
            <p>Beginner Lessons</p>
            <p>4 Online Classes</p>
            <p>60 min / Class</p>
            <p>Regional / English Instructions</p>
          </div>
          <button className="get-started-button">Get Started</button>
        </div>

        {/* Most-Selling */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-number">2</div>
            <h3>MOST-SELLING</h3>
          </div>
          <div className="pricing-card-content">
            <p>12 Classes / Quarter</p>
            <p>₹ 9600</p>
            
            <p>Beginner Lessons</p>
            <p>12 Online Classes</p>
            <p>60 min / Class</p>
            <p>Regional / English Instructions</p>
          </div>
          <button className="get-started-button">Get Started</button>
        </div>

        {/* Standard */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-number">3</div>
            <h3>STANDARD</h3>
          </div>
          <div className="pricing-card-content">
            <p>8 Classes / Month</p>
            <p>₹ 5600</p>
            
            <p>Beginner Lessons</p>
            <p>8 Online Classes</p>
            <p>45 min / Class</p>
            <p>Regional / English Instructions</p>
          </div>
          <button className="get-started-button">Get Started</button>
        </div>

        {/* Value-Pack */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-number">4</div>
            <h3>VALUE-PACK</h3>
          </div>
          <div className="pricing-card-content">
            <p>24 Classes / Quarter</p>
            <p>₹ 14500</p>
            <p>₹ 18000 19% OFF</p>
            <p>Beginner Lessons</p>
            <p>24 Online Classes</p>
            <p>45 min / Class</p>
            {/* <p>Regional / English Instructions</p> */}
          </div>
          <button className="get-started-button">Get Started</button>
        </div>

        {/* VIP */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-number">5</div>
            <h3>VIP</h3>
          </div>
          <div className="pricing-card-content">
            <p>48 Classes</p>
            <p>₹ 39999</p>
            <p>Beginner Lessons</p>
            <p>48 Online Classes</p>
            <p>45 min / Class</p>
            <p>Regional / English Instructions</p>
            {/* <p>Classes can be split among family & friends</p> */}
          </div>
          <button className="get-started-button">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
