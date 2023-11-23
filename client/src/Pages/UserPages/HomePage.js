import React, { useEffect } from 'react';
import Header from '../../Components/UserComponents/Home/Header';
import Home from '../../Components/UserComponents/Home/Home';
import axios from '../../Utils/axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(process.env.JWT_SECRET); 

    if (!token) {
      navigate('/');
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
