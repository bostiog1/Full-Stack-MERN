import { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

const ImageUpload = ({ initialImage, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl("");
    onImageChange("");
  };

  return (
    <Box>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={previewUrl ? <ImageIcon /> : <FileUploadIcon />}
        sx={{
          p: 1.5,
          position: "relative",
          overflow: "hidden",
          borderStyle: "dashed",
          borderWidth: "2px",
          borderColor: previewUrl ? "primary.main" : "divider",
          "&:hover": {
            borderColor: "primary.main",
          },
        }}
      >
        {previewUrl ? "Change Image" : "Upload Image"}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {previewUrl ? (
        <Box
          sx={{
            mt: 2,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            height: "140px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
            onClick={handleClearImage}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.03)",
            borderRadius: 2,
            height: "100px",
          }}
        >
          <ImageIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No image selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
