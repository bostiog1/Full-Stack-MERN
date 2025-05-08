import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
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
  );
};
