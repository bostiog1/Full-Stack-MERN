import {
  Avatar,
  Typography,
  Paper,
  Grid,
  Container,
  Button,
  Icon, // Note: Icon import might not be used if you're using MUI Icons directly
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Input } from "./Input";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { signIn, signUp } from "../../actions/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Auth = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { loginWithRedirect } = useAuth0();

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      dispatch(signUp(formData, navigate));
    } else {
      dispatch(signIn(formData, navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log("Input changed:", formData);
  };

  const swithcMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleLogin = () => {
    loginWithRedirect().catch((err) => console.error("Login error:", err));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
        <form style={{ width: "100%", marginTop: 2 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
            <Button
              color="primary"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              // startIcon={<icon />} // Add an icon here if desired
            >
              Login with Google
            </Button>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: 2 }}
          >
            {isSignUp ? "Sign Up (Traditional)" : "Sign In (Traditional)"}{" "}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button variant="text" onClick={swithcMode}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
