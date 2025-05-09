import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  Stack,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TitleIcon from "@mui/icons-material/Title";
import MessageIcon from "@mui/icons-material/Message";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const post = useSelector((state) =>
    currentId ? state.posts.find((message) => message._id === currentId) : null
  );
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) {
      setPostData(post);
      setTagsArray(post.tags || []);
      setPreviewUrl(post.selectedFile || "");
    }
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: "", message: "", tags: [], selectedFile: "" });
    setTagInput("");
    setTagsArray([]);
    setPreviewUrl("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tagsArray.includes(tagInput.trim())) {
      setTagsArray([...tagsArray, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagsArray(tagsArray.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPostData({ ...postData, selectedFile: base64String });
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalPostData = {
      ...postData,
      tags: tagsArray,
      name: user?.result?.name,
    };

    if (!currentId) {
      dispatch(createPost(finalPostData));
      clear();
    } else {
      dispatch(updatePost(currentId, finalPostData));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          background: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 2,
        background: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <form
        autoComplete="off"
        noValidate
        style={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 2,
            color: currentId ? "secondary.main" : "primary.main",
            fontWeight: "bold",
          }}
        >
          {currentId
            ? `Editing "${postData.title || "Memory"}"`
            : "Creating a Memory"}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <TextField
            name="title"
            variant="outlined"
            label="Title"
            fullWidth
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="message"
            variant="outlined"
            label="Message"
            multiline
            rows={4}
            fullWidth
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MessageIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                name="tagInput"
                variant="outlined"
                label="Add Tag"
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTag}
                sx={{ minWidth: "50px" }}
              >
                <AddIcon />
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                minHeight: "40px",
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              {tagsArray.length > 0 ? (
                tagsArray.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 1 }}
                >
                  No tags added yet
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<FileUploadIcon />}
              sx={{ p: 1.5, position: "relative", overflow: "hidden" }}
            >
              {previewUrl ? "Change Image" : "Upload Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {previewUrl && (
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
                  onClick={() => {
                    setPostData({ ...postData, selectedFile: "" });
                    setPreviewUrl("");
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              fullWidth
              startIcon={<SaveIcon />}
              sx={{ py: 1.5 }}
            >
              {currentId ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={clear}
              fullWidth
              startIcon={<CloseIcon />}
              sx={{ py: 1.5 }}
            >
              Clear
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default Form;
