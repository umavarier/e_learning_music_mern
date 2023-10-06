import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './roleSelection.css'

function RoleSelection() {
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = () => {
    if (isStudent) {
      navigate('/loginwithotp');
    } else if (isTeacher) {
      navigate('/teacherLogin');
    } else {
      // Display an error message if neither option is selected
      alert('Please select a role (Student or Teacher)');
    }
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <div>
        <label className='text-dark'>
          <input
            type="checkbox" 
            checked={isStudent}
            onChange={() => {
              setIsStudent(!isStudent);
              setIsTeacher(false); // Ensure only one checkbox is selected
            }}
          />
          Student
        </label>
      </div>
      <div>
        <label className='text-dark'> 
          <input
            type="checkbox"
            checked={isTeacher}
            onChange={() => {
              setIsTeacher(!isTeacher);
              setIsStudent(false); // Ensure only one checkbox is selected
            }}
          />
          Teacher
        </label>
      </div>
      <button onClick={handleRoleSelection}>Continue</button>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default RoleSelection;
