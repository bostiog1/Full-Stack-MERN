import { Container, CssBaseline, Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import memories from "../public/assets/memories.png";
import Posts from "./components/Posts/Posts";
import Form from "./components/Form/Form";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getPosts } from "./actions/posts";
import theme from "./theme";

const App = () => {
  const [currentId, setCurrentId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
              mb: 4,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              borderRadius: 2,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
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
                variant="h2"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                Memories
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              gap: 4,
              flex: 1,
            }}
          >
            <Box sx={{ flex: 2 }}>
              <Posts setCurrentId={setCurrentId} />
            </Box>
            <Box
              sx={{
                flex: 1,
                position: { xs: "static", md: "sticky" },
                top: 20,
                mb: { xs: 4, md: 0 },
              }}
            >
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: "auto",
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              Share Your Precious Memories © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
