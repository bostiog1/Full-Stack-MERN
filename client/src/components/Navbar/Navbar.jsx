import { Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import memories from "../../../public/assets/memories.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LOGOUT } from "../../constants/actionTypes";

export const Navbar = () => {
  const {
    isAuthenticated: isAuth0Authenticated,
    user: auth0User,
    logout: auth0Logout,
  } = useAuth0();

  const { authData } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = authData?.result || auth0User;
  const isAuthenticated = !!user;

  const traditionalLogout = () => {
    dispatch({ type: LOGOUT });
    navigate("/auth");
  };

  const handleLogout = () => {
    if (isAuth0Authenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } else if (authData) {
      traditionalLogout();
    }
  };

  useEffect(() => {}, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        mb: 2,
        background: "linear-gradient(135deg, #6a11cb 0%,rgb(98, 152, 244) 100%)",
        borderRadius: 2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Ensure memories.png is in your public/assets folder */}
        <img
          src={memories}
          alt="Memories"
          style={{
            height: "60px",
            borderRadius: "50%",
            border: "3px solid white",
            padding: "5px",
            backgroundColor: "white",
          }}
        />
        <Typography
          component={Link}
          to="/"
          variant="h2"
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem" },
            textDecoration: "none",
          }}
        >
          Memories
        </Typography>
      </Box>

      {/* Auth Section */}
      <Toolbar sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
        {isAuthenticated ? (
          <>
            <Avatar
              alt={user?.name}
              src={user?.picture}
              sx={{ width: 56, height: 56 }}
            >
              {!user?.picture && user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ color: "white" }}>
              {user?.name}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </Box>
  );
};
