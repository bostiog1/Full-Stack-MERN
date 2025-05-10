// frontend/components/Auth/Auth.jsx
import {
  Avatar,
  Typography,
  Paper,
  Grid,
  Container,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Input } from "./Input";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react"; // Import useEffect
import { signIn, signUp, processAuth0Login } from "../../actions/auth"; // Import the new action
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to check if already logged in
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

  // Get Auth0 state
  const {
    loginWithRedirect,
    user: auth0User,
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
    error: auth0Error,
  } = useAuth0();

  // Get traditional auth state from Redux
  const { authData } = useSelector((state) => state.auth);

  // --- New useEffect to handle Auth0 redirect success ---
  useEffect(() => {
    // Check if Auth0 is not loading, user is authenticated via Auth0,
    // and the traditional auth state is *not* yet populated (to avoid infinite loops)
    if (!isAuth0Loading && isAuth0Authenticated && auth0User && !authData) {
      console.log("Auth0 user detected, processing login...");
      // Dispatch the new action to send Auth0 data to backend and update Redux state
      dispatch(processAuth0Login(auth0User, navigate));
    } else if (!isAuth0Loading && auth0Error) {
      // Handle Auth0 specific errors if needed
      console.error("Auth0 Error:", auth0Error);
      // Optionally display an error message to the user
    }
    // Depend on Auth0 state, Redux authData, dispatch, and navigate
  }, [
    isAuth0Loading,
    isAuth0Authenticated,
    auth0User,
    authData,
    dispatch,
    navigate,
    auth0Error,
  ]);

  // Redirect already logged in users (either traditional or processed Auth0)
  useEffect(() => {
    if (authData) {
      // authData is populated by the AUTH action, regardless of method
      navigate("/");
    }
  }, [authData, navigate]); // Depend on authData and navigate

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent traditional login/signup if Auth0 is still loading or user is already authenticated via Auth0
    if (isAuth0Loading || isAuth0Authenticated) {
      console.log("Auth0 is active, traditional submit blocked.");
      return;
    }

    if (isSignUp) {
      dispatch(signUp(formData, navigate));
    } else {
      dispatch(signIn(formData, navigate));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const swithcMode = () => {
    setIsSignUp((prev) => !prev);
    // Clear form data when switching modes
    setFormData(initialState);
    setShowPassword(false);
  };

  const handleLogin = () => {
    // You might want to add a check here if Auth0 is already processing
    if (!isAuth0Loading) {
      loginWithRedirect().catch((err) =>
        console.error("Auth0 login error:", err)
      );
    }
  };

  // Optionally show a loading spinner while Auth0 is processing
  if (isAuth0Loading) {
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
          <Typography variant="h6">Loading authentication...</Typography>
          {/* Add a CircularProgress spinner from MUI if you have it */}
        </Paper>
      </Container>
    );
  }

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
                  value={formData.firstName} // Add value prop
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                  value={formData.lastName} // Add value prop
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
              value={formData.email} // Add value prop
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
              value={formData.password} // Add value prop
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
                value={formData.confirmPassword} // Add value prop
              />
            )}
            {/* Disable traditional buttons while Auth0 is loading */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 1, mb: 2 }}
              disabled={isAuth0Loading || isAuth0Authenticated} // Disable if Auth0 is handling
            >
              {isSignUp ? "Sign Up (Traditional)" : "Sign In (Traditional)"}{" "}
            </Button>
            {/* Disable Auth0 button while Auth0 is loading */}
            <Button
              color="primary"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              disabled={isAuth0Loading || isAuth0Authenticated} // Disable if Auth0 is handling
              // startIcon={<icon />} // Add a Google icon here if desired (e.g., <GoogleIcon />)
            >
              Login with Google (Auth0)
            </Button>
          </Grid>
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
// import {
//   Avatar,
//   Typography,
//   Paper,
//   Grid,
//   Container,
//   Button,
//   Icon, // Note: Icon import might not be used if you're using MUI Icons directly
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { Input } from "./Input";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useState } from "react";
// import { signIn, signUp } from "../../actions/auth";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const initialState = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
// };

// export const Auth = () => {
//   const [formData, setFormData] = useState(initialState);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);

//   const { loginWithRedirect } = useAuth0();

//   const handleShowPassword = () => setShowPassword((prev) => !prev);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (isSignUp) {
//       dispatch(signUp(formData, navigate));
//     } else {
//       dispatch(signIn(formData, navigate));
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // console.log("Input changed:", formData);
//   };

//   const swithcMode = () => {
//     setIsSignUp((prev) => !prev);
//   };

//   const handleLogin = () => {
//     loginWithRedirect().catch((err) => console.error("Login error:", err));
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 3,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//           <LockOutlinedIcon />
//         </Avatar>

//         <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
//         <form style={{ width: "100%", marginTop: 2 }} onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {isSignUp && (
//               <>
//                 <Input
//                   name="firstName"
//                   label="First Name"
//                   handleChange={handleChange}
//                   autoFocus
//                   half
//                 />
//                 <Input
//                   name="lastName"
//                   label="Last Name"
//                   handleChange={handleChange}
//                   half
//                 />
//               </>
//             )}
//             <Input
//               name="email"
//               label="Email Address"
//               handleChange={handleChange}
//               type="email"
//             />
//             <Input
//               name="password"
//               label="Password"
//               handleChange={handleChange}
//               type={showPassword ? "text" : "password"}
//               handleShowPassword={handleShowPassword}
//             />
//             {isSignUp && (
//               <Input
//                 name="confirmPassword"
//                 label="Repeat Password"
//                 handleChange={handleChange}
//                 type="password"
//               />
//             )}
//             <Button
//               color="primary"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleLogin}
//               // startIcon={<icon />} // Add an icon here if desired
//             >
//               Login with Google
//             </Button>
//           </Grid>

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             sx={{ mt: 1, mb: 2 }}
//           >
//             {isSignUp ? "Sign Up (Traditional)" : "Sign In (Traditional)"}{" "}
//           </Button>

//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <Button variant="text" onClick={swithcMode}>
//                 {isSignUp
//                   ? "Already have an account? Sign In"
//                   : "Don't have an account? Sign Up"}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };
