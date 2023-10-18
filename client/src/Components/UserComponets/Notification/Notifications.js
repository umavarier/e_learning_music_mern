import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  useEffect(() => {   
    axios.get(`getNotifications/${userId}`).then((response) => {
      setNotifications(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification._id}>
          <div>{notification.message}</div>
          {/* <button onClick={() => markAsRead(notification._id)}>Mark as Read</button> */}
          {/* <button onClick={() => deleteNotification(notification._id)}>Delete</button> */}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
