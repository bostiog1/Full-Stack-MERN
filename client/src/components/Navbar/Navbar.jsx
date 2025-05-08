import { Avatar, Box, Button, Toolbar, Typography } from "@mui/material";
import memories from "../../../public/assets/memories.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    navigate("/auth");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        mb: 4,
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        borderRadius: 2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              {user?.name?.charAt(0)}
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
