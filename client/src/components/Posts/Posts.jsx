import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  Fade,
  Container,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import { useState, useEffect } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

const Posts = ({ setCurrentId, refreshPosts, page }) => {
  const { posts } = useSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Calculate columns based on screen size - updated for 4 columns
  const getGridSize = () => {
    if (isMobile) return 12; // 1 column on mobile
    if (isMedium) return 6; // 2 columns on medium screens
    if (isLarge) return 4; // 3 columns on large screens
    return 3; // 4 columns on extra large screens (new!)
  };

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Loading skeleton placeholders - updated to show 8 items (4x2 grid)
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={2}>
          {" "}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              {" "}
              <Box
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Skeleton variant="rectangular" height={150} animation="wave" />{" "}
                <Box sx={{ p: 1.5 }}>
                  {" "}
                  <Skeleton
                    variant="text"
                    height={30}
                    width="80%"
                    animation="wave"
                  />
                  <Skeleton variant="text" height={15} animation="wave" />{" "}
                  <Skeleton
                    variant="text"
                    height={15}
                    width="90%"
                    animation="wave"
                  />
                  <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                    {" "}
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={20}
                      animation="wave"
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={20}
                      animation="wave"
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={20}
                      animation="wave"
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1.5,
                    pt: 0,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={25}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={25}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Empty state with improved UI
  if (!posts.length && !isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: 4,
          p: 5,
          mx: "auto",
          my: 4,
          maxWidth: 600,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <AutoAwesomeIcon
          sx={{
            fontSize: 80,
            color: "primary.light",
            mb: 3,
            opacity: 0.7,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
          }}
        >
          Create Your First Memory
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 450,
            mb: 3,
            fontSize: "1.1rem",
          }}
        >
          Start preserving your special moments by filling out the form. Capture
          the memories that matter to you!
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            py: 1,
            px: 3,
            borderRadius: 2,
            mt: 2,
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
            },
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onClick={() => {
            // Scroll to form or focus on form
            const form = document.getElementById("memory-form");
            if (form) {
              form.scrollIntoView({ behavior: "smooth" });
              // Add a highlight animation to the form
              form.classList.add("highlight-form");
              setTimeout(() => form.classList.remove("highlight-form"), 1500);
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              navigate("/auth");
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: 1 }} />
            <Typography variant="button">Add Memory</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Staggered animation for post items appearing
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid
        container
        spacing={2} // Reduced spacing between items for a tighter grid
        sx={{
          alignItems: "stretch",
        }}
      >
        {posts.map((post, index) => (
          <Fade
            in={true}
            key={post._id}
            style={{
              transitionDelay: `${index * 60}ms`, // Faster transition for more items
              transformOrigin: "center",
            }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3}>
              {" "}
              {/* Added lg={3} for 4 columns on large screens */}
              <Post
                post={post}
                setCurrentId={setCurrentId}
                refreshPosts={refreshPosts}
                page={page}
              />{" "}
            </Grid>
          </Fade>
        ))}
      </Grid>
    </Container>
  );
};

export default Posts;
// import {
//   Grid,
//   CircularProgress,
//   Typography,
//   Box,
//   Fade,
//   Container,
//   Skeleton,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import Post from "./Post/Post";
// import { useState, useEffect } from "react";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// const Posts = ({ setCurrentId }) => {
//   const posts = useSelector((state) => state.posts);
//   const [isLoading, setIsLoading] = useState(true);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   // Calculate columns based on screen size
//   const getGridSize = () => {
//     if (isMobile) return 12; // 1 column on mobile
//     if (isMedium) return 6; // 2 columns on medium screens
//     return 4; // 3 columns on large screens
//   };

//   // Simulate loading state for better UX
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // Loading skeleton placeholders
//   if (isLoading) {
//     return (
//       <Container maxWidth="xl" sx={{ py: 4 }}>
//         <Grid container spacing={3}>
//           {[1, 2, 3, 4, 5, 6].map((item) => (
//             <Grid item xs={12} sm={6} md={4} key={item}>
//               <Box
//                 sx={{
//                   height: "100%",
//                   borderRadius: 3,
//                   overflow: "hidden",
//                   boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
//                 }}
//               >
//                 <Skeleton variant="rectangular" height={200} animation="wave" />
//                 <Box sx={{ p: 2 }}>
//                   <Skeleton
//                     variant="text"
//                     height={40}
//                     width="80%"
//                     animation="wave"
//                   />
//                   <Skeleton variant="text" height={20} animation="wave" />
//                   <Skeleton
//                     variant="text"
//                     height={20}
//                     width="90%"
//                     animation="wave"
//                   />
//                   <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                     <Skeleton
//                       variant="rectangular"
//                       width={60}
//                       height={24}
//                       animation="wave"
//                       sx={{ borderRadius: 1 }}
//                     />
//                     <Skeleton
//                       variant="rectangular"
//                       width={70}
//                       height={24}
//                       animation="wave"
//                       sx={{ borderRadius: 1 }}
//                     />
//                     <Skeleton
//                       variant="rectangular"
//                       width={50}
//                       height={24}
//                       animation="wave"
//                       sx={{ borderRadius: 1 }}
//                     />
//                   </Box>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     p: 2,
//                     pt: 0,
//                   }}
//                 >
//                   <Skeleton
//                     variant="rectangular"
//                     width={80}
//                     height={30}
//                     animation="wave"
//                     sx={{ borderRadius: 1 }}
//                   />
//                   <Skeleton
//                     variant="rectangular"
//                     width={80}
//                     height={30}
//                     animation="wave"
//                     sx={{ borderRadius: 1 }}
//                   />
//                 </Box>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     );
//   }

//   // Empty state with improved UI
//   if (!posts.length && !isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "50vh",
//           backgroundColor: "rgba(0,0,0,0.02)",
//           borderRadius: 4,
//           p: 5,
//           mx: "auto",
//           my: 4,
//           maxWidth: 600,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
//           textAlign: "center",
//         }}
//       >
//         <AutoAwesomeIcon
//           sx={{
//             fontSize: 80,
//             color: "primary.light",
//             mb: 3,
//             opacity: 0.7,
//           }}
//         />
//         <Typography
//           variant="h4"
//           sx={{
//             mb: 2,
//             fontWeight: 600,
//             background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
//             backgroundClip: "text",
//             textFillColor: "transparent",
//           }}
//         >
//           Create Your First Memory
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{
//             color: "text.secondary",
//             maxWidth: 450,
//             mb: 3,
//             fontSize: "1.1rem",
//           }}
//         >
//           Start preserving your special moments by filling out the form. Capture
//           the memories that matter to you!
//         </Typography>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: theme.palette.primary.main,
//             color: "white",
//             py: 1,
//             px: 3,
//             borderRadius: 2,
//             mt: 2,
//             fontWeight: 500,
//             boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
//             "&:hover": {
//               backgroundColor: theme.palette.primary.dark,
//               transform: "translateY(-2px)",
//               boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
//             },
//             transition: "all 0.3s ease",
//             cursor: "pointer",
//           }}
//           onClick={() => {
//             // Scroll to form or focus on form
//             const form = document.getElementById("memory-form");
//             if (form) {
//               form.scrollIntoView({ behavior: "smooth" });
//               // Add a highlight animation to the form
//               form.classList.add("highlight-form");
//               setTimeout(() => form.classList.remove("highlight-form"), 1500);
//             }
//           }}
//         >
//           <AddCircleOutlineIcon sx={{ mr: 1 }} />
//           <Typography variant="button">Add Memory</Typography>
//         </Box>
//       </Box>
//     );
//   }

//   // Staggered animation for post items appearing
//   return (
//     <Container maxWidth="xl" sx={{ py: 3 }}>
//       <Grid
//         container
//         spacing={3}
//         sx={{
//           alignItems: "stretch",
//         }}
//       >
//         {posts.map((post, index) => (
//           <Fade
//             in={true}
//             key={post._id}
//             style={{
//               transitionDelay: `${index * 80}ms`,
//               transformOrigin: "center",
//             }}
//           >
//             <Grid item xs={12} sm={getGridSize()} lg={getGridSize()}>
//               <Post post={post} setCurrentId={setCurrentId} />
//             </Grid>
//           </Fade>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default Posts;
// import { Grid, CircularProgress, Typography, Box, Fade } from "@mui/material";
// import { useSelector } from "react-redux";
// import Post from "./Post/Post";
// import { useState, useEffect } from "react";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// const Posts = ({ setCurrentId }) => {
//   const posts = useSelector((state) => state.posts);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate loading state for better UX
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "400px",
//         }}
//       >
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
//           Loading memories...
//         </Typography>
//       </Box>
//     );
//   }

//   if (!posts.length && !isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "400px",
//           backgroundColor: "rgba(0,0,0,0.02)",
//           borderRadius: 2,
//           p: 3,
//         }}
//       >
//         <AutoAwesomeIcon sx={{ fontSize: 60, color: "primary.light", mb: 2 }} />
//         <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
//           No memories yet
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{ color: "text.secondary", textAlign: "center" }}
//         >
//           Create your first memory by filling out the form!
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Grid
//       container
//       spacing={3}
//       sx={{
//         alignItems: "stretch",
//         animation: "fadeIn 0.5s ease-in-out",
//       }}
//     >
//       {posts.map((post, index) => (
//         <Fade
//           in={true}
//           key={post._id}
//           style={{
//             transitionDelay: `${index * 100}ms`,
//             transformOrigin: "center",
//           }}
//         >
//           <Grid item xs={12} sm={6} lg={6}>
//             <Post post={post} setCurrentId={setCurrentId} />
//           </Grid>
//         </Fade>
//       ))}
//     </Grid>
//   );
// };

// export default Posts;
