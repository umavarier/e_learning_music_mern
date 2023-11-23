import React, { useState, useEffect } from 'react';
import axios from '../../../Utils/axios'; 
import Header from '../Home/Header.js'

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
  const apiKey = process.env.CLOUDINARY_API_KEY; 

  useEffect(() => {
    console.log("vvvvvvv")
    axios
      .get(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/video?api_key=${apiKey}`
      )
      .then((response) => {
        setVideos(response.data.resources);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <div
        style={{
          backgroundColor: ' #333',
          color: '#fff',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0' }}>Video Gallery</h1>
      </div>

      <div className="video-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {videos.map((video) => (
          <div
            key={video.public_id}
            className="video-item"
            style={{
              width: '300px',
              margin: '10px',
              border: '1px solid #ccc',
              padding: '10px',
            }}
          >
            <video controls width="100%" height="auto">
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
