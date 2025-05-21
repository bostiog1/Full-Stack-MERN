// frontend/components/Auth/Auth.jsx
import {
  Avatar,
  Typography,
  Paper,
  Grid,
  Container,
  Button,
  Box,
  Divider,
  useTheme,
  CircularProgress,
  Fade,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GoogleIcon from "@mui/icons-material/Google";
import { Input } from "./Input";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { signIn, signUp, processAuth0Login } from "../../actions/auth";
import { useDispatch, useSelector } from "react-redux";
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  // Get Auth0 state
  const {
    loginWithRedirect,
    user: auth0User,
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
    error: auth0Error,
  } = useAuth0();

  // Get traditional auth state from Redux
  const { authData, error: authError } = useSelector(
    (state) => state.auth || {}
  );

  // Handle Auth0 redirect success
  useEffect(() => {
    if (!isAuth0Loading && isAuth0Authenticated && auth0User && !authData) {
      dispatch(processAuth0Login(auth0User, navigate));
    }
  }, [
    isAuth0Loading,
    isAuth0Authenticated,
    auth0User,
    authData,
    dispatch,
    navigate,
  ]);

  // Redirect already logged in users
  useEffect(() => {
    if (authData) {
      navigate("/");
    }
  }, [authData, navigate]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.firstName) {
        errors.firstName = "First name is required";
      }

      if (!formData.lastName) {
        errors.lastName = "Last name is required";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      if (isSignUp) {
        dispatch(signUp(formData, navigate))
          .catch((error) => {
            console.error("Signup error:", error);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        dispatch(signIn(formData, navigate))
          .catch((error) => {
            console.error("Signin error:", error);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null,
      });
    }
  };

  const switchMode = () => {
    setIsSignUp((prev) => !prev);
    setFormData(initialState);
    setFormErrors({});
    setShowPassword(false);
  };

  const handleLogin = () => {
    if (!isAuth0Loading) {
      loginWithRedirect().catch((err) =>
        console.error("Auth0 login error:", err)
      );
    }
  };

  // Loading state
  if (isAuth0Loading) {
    return (
      <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} thickness={5} />
          <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
            Loading authentication...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 5 }}>
      <Fade in={true} timeout={800}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              py: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "white",
                color: theme.palette.primary.main,
                width: 56,
                height: 56,
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "white",
                mt: 1,
              }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mt: 1,
                textAlign: "center",
              }}
            >
              {isSignUp
                ? "Sign up to create and share your memories"
                : "Sign in to access your memories"}
            </Typography>
          </Box>

          <CardContent sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
            {/* Error Messages */}
            {(authError || auth0Error) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {authError ||
                  "Authentication error occurred. Please try again."}
              </Alert>
            )}

            {/* Tabs for Sign In / Sign Up */}
            <Tabs
              value={isSignUp ? 1 : 0}
              onChange={(e, newValue) => setIsSignUp(newValue === 1)}
              sx={{ mb: 3 }}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                icon={<LoginIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Sign In"
              />
              <Tab
                icon={<PersonAddIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Sign Up"
              />
            </Tabs>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {isSignUp && (
                  <>
                    <Input
                      name="firstName"
                      label="First Name"
                      handleChange={handleChange}
                      autoFocus
                      half
                      value={formData.firstName}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                    />
                    <Input
                      name="lastName"
                      label="Last Name"
                      handleChange={handleChange}
                      half
                      value={formData.lastName}
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                    />
                  </>
                )}
                <Input
                  name="email"
                  label="Email Address"
                  handleChange={handleChange}
                  type="email"
                  value={formData.email}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
                <Input
                  name="password"
                  label="Password"
                  handleChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  handleShowPassword={handleShowPassword}
                  value={formData.password}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
                {isSignUp && (
                  <Input
                    name="confirmPassword"
                    label="Repeat Password"
                    handleChange={handleChange}
                    type="password"
                    value={formData.confirmPassword}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                  />
                )}
              </Grid>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(33, 150, 243, 0.4)",
                  },
                }}
                disabled={
                  isSubmitting || isAuth0Loading || isAuth0Authenticated
                }
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting
                  ? "Processing..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>

              {/* Divider */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  my: 3,
                }}
              >
                <Divider sx={{ flexGrow: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ mx: 2, color: "text.secondary" }}
                >
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              {/* OAuth Buttons */}
              <Button
                color="error"
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.04)",
                  },
                }}
                onClick={handleLogin}
                disabled={isAuth0Loading || isAuth0Authenticated}
                startIcon={<GoogleIcon />}
              >
                Continue with Google
              </Button>

              {/* Switch Mode Text */}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <Button
                    onClick={switchMode}
                    sx={{
                      ml: 1,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};
// // frontend/components/Auth/Auth.jsx
// import {
//   Avatar,
//   Typography,
//   Paper,
//   Grid,
//   Container,
//   Button,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { Input } from "./Input";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useState, useEffect } from "react"; // Import useEffect
// import { signIn, signUp, processAuth0Login } from "../../actions/auth"; // Import the new action
// import { useDispatch, useSelector } from "react-redux"; // Import useSelector to check if already logged in
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

//   // Get Auth0 state
//   const {
//     loginWithRedirect,
//     user: auth0User,
//     isAuthenticated: isAuth0Authenticated,
//     isLoading: isAuth0Loading,
//     error: auth0Error,
//   } = useAuth0();

//   // Get traditional auth state from Redux
//   const { authData } = useSelector((state) => state.auth);

//   // --- New useEffect to handle Auth0 redirect success ---
//   useEffect(() => {
//     // Check if Auth0 is not loading, user is authenticated via Auth0,
//     // and the traditional auth state is *not* yet populated (to avoid infinite loops)
//     if (!isAuth0Loading && isAuth0Authenticated && auth0User && !authData) {
//       console.log("Auth0 user detected, processing login...");
//       // Dispatch the new action to send Auth0 data to backend and update Redux state
//       dispatch(processAuth0Login(auth0User, navigate));
//     } else if (!isAuth0Loading && auth0Error) {
//       // Handle Auth0 specific errors if needed
//       console.error("Auth0 Error:", auth0Error);
//       // Optionally display an error message to the user
//     }
//     // Depend on Auth0 state, Redux authData, dispatch, and navigate
//   }, [
//     isAuth0Loading,
//     isAuth0Authenticated,
//     auth0User,
//     authData,
//     dispatch,
//     navigate,
//     auth0Error,
//   ]);

//   // Redirect already logged in users (either traditional or processed Auth0)
//   useEffect(() => {
//     if (authData) {
//       // authData is populated by the AUTH action, regardless of method
//       navigate("/");
//     }
//   }, [authData, navigate]); // Depend on authData and navigate

//   const handleShowPassword = () => setShowPassword((prev) => !prev);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Prevent traditional login/signup if Auth0 is still loading or user is already authenticated via Auth0
//     if (isAuth0Loading || isAuth0Authenticated) {
//       console.log("Auth0 is active, traditional submit blocked.");
//       return;
//     }

//     if (isSignUp) {
//       dispatch(signUp(formData, navigate));
//     } else {
//       dispatch(signIn(formData, navigate));
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const swithcMode = () => {
//     setIsSignUp((prev) => !prev);
//     // Clear form data when switching modes
//     setFormData(initialState);
//     setShowPassword(false);
//   };

//   const handleLogin = () => {
//     // You might want to add a check here if Auth0 is already processing
//     if (!isAuth0Loading) {
//       loginWithRedirect().catch((err) =>
//         console.error("Auth0 login error:", err)
//       );
//     }
//   };

//   // Optionally show a loading spinner while Auth0 is processing
//   if (isAuth0Loading) {
//     return (
//       <Container component="main" maxWidth="xs">
//         <Paper
//           elevation={3}
//           sx={{
//             padding: 3,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6">Loading authentication...</Typography>
//           {/* Add a CircularProgress spinner from MUI if you have it */}
//         </Paper>
//       </Container>
//     );
//   }

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
//                   value={formData.firstName} // Add value prop
//                 />
//                 <Input
//                   name="lastName"
//                   label="Last Name"
//                   handleChange={handleChange}
//                   half
//                   value={formData.lastName} // Add value prop
//                 />
//               </>
//             )}
//             <Input
//               name="email"
//               label="Email Address"
//               handleChange={handleChange}
//               type="email"
//               value={formData.email} // Add value prop
//             />
//             <Input
//               name="password"
//               label="Password"
//               handleChange={handleChange}
//               type={showPassword ? "text" : "password"}
//               handleShowPassword={handleShowPassword}
//               value={formData.password} // Add value prop
//             />
//             {isSignUp && (
//               <Input
//                 name="confirmPassword"
//                 label="Repeat Password"
//                 handleChange={handleChange}
//                 type="password"
//                 value={formData.confirmPassword} // Add value prop
//               />
//             )}
//             {/* Disable traditional buttons while Auth0 is loading */}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               sx={{ mt: 1, mb: 2 }}
//               disabled={isAuth0Loading || isAuth0Authenticated} // Disable if Auth0 is handling
//             >
//               {isSignUp ? "Sign Up (Traditional)" : "Sign In (Traditional)"}{" "}
//             </Button>
//             {/* Disable Auth0 button while Auth0 is loading */}
//             <Button
//               color="primary"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleLogin}
//               disabled={isAuth0Loading || isAuth0Authenticated} // Disable if Auth0 is handling
//               // startIcon={<icon />} // Add a Google icon here if desired (e.g., <GoogleIcon />)
//             >
//               Login with Google (Auth0)
//             </Button>
//           </Grid>
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
