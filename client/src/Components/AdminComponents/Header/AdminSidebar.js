import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import NotificationsIcon from "@mui/icons-material/Notifications";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    marginTop : "70px",
    width: "300px",
    // borderRight: "1px solid #ccc",
    // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  ListItem: {
    marginTop: "100px",
    borderRadius: "10px",
    backgroundColor: "#161b40",
    color: "white",
    fontSize: "30px",
  },
}));

function AdminSidebar() {
  const classes = useStyles();

  return (
    <nav id="sidebar" className={classes.sidebar}>
      <List component="nav" aria-label="admin-sidebar">
        <ListItem button component={Link} to="/adminHome">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/teachers">
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Teachers" />
        </ListItem>
        <ListItem button component={Link} to="/getEnrolledUsersLIst">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Enrolled Users" />
        </ListItem>
        <ListItem button component={Link} to="/adminCourseManagement">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
        <ListItem button component={Link} to="/adminGetPricingDetails">
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Pricing" />
        </ListItem>
        <ListItem button component={Link} to="/adminGetBookingLists">
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Free Demo Bookings" />
        </ListItem>
        <ListItem button component={Link} to="">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
      </List>
    </nav>
  );
}

export default AdminSidebar;
