import React, { useEffect } from 'react';
import Header from '../../Components/UserComponets/Home/Header';
import Home from '../../Components/UserComponets/Home/Home';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('secret123'); // Use the correct token key

    if (!token) {
      navigate('/'); // Redirect to the login page if token doesn't exist
    }
  }, []);

  return (
    <div>
      <Header />
      <Home />
    </div>
  );
}

export default HomePage;
