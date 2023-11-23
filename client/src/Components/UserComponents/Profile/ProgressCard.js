import React, { useState, useEffect } from "react";

const ProgressCard = ({ totalHours, videoCallCount }) => {
  const [remainingHours, setRemainingHours] = useState(totalHours);

  // Use useEffect to deduct 1 hour for each video call
  useEffect(() => {
    const hoursDeducted = videoCallCount;
    const newRemainingHours = totalHours - hoursDeducted;
    setRemainingHours(newRemainingHours);
  }, [totalHours, videoCallCount]);

  return (
    <div className="progress-card">
      <h2 className = "text-dark text-center">Course Progress</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${((totalHours - remainingHours) / totalHours) * 100}%` }}
        >
          {((totalHours - remainingHours) / totalHours) * 100}% Complete
        </div>
      </div>
      <div className="progress-info">
        <p>Total Hours: {totalHours} hours</p>
        <p>Remaining Hours: {remainingHours} hours</p>
        <p>Video Calls Completed: {videoCallCount}</p>
      </div>
    </div>
  );
};

export default ProgressCard;
