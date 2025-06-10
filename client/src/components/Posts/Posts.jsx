import {
  Grid,
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
            const form = document.getElementById("memory-form");
            if (form) {
              form.scrollIntoView({ behavior: "smooth" });
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
        spacing={2}
        sx={{
          alignItems: "stretch",
        }}
      >
        {posts.map((post, index) => (
          <Fade
            in={true}
            key={post._id}
            style={{
              transitionDelay: `${index * 60}ms`,
              transformOrigin: "center",
            }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3}>
              {" "}
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
