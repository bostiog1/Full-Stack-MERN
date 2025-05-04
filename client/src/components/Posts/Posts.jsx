import { Grid, CircularProgress, Typography, Box, Fade } from "@mui/material";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import { useState, useEffect } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const Posts = ({ setCurrentId }) => {
  const posts = useSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          Loading memories...
        </Typography>
      </Box>
    );
  }

  if (!posts.length && !isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: 2,
          p: 3,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 60, color: "primary.light", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
          No memories yet
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          Create your first memory by filling out the form!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      sx={{
        alignItems: "stretch",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      {posts.map((post, index) => (
        <Fade
          in={true}
          key={post._id}
          style={{
            transitionDelay: `${index * 100}ms`,
            transformOrigin: "center",
          }}
        >
          <Grid item xs={12} sm={6} lg={6}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        </Fade>
      ))}
    </Grid>
  );
};

export default Posts;
