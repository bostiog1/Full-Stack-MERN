import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  InputAdornment,
  Fade,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";

const TagInput = ({ initialTags, onTagsChange }) => {
  const [tagInput, setTagInput] = useState("");
  const [tagsArray, setTagsArray] = useState([]);

  useEffect(() => {
    if (initialTags) {
      const tags = Array.isArray(initialTags) ? initialTags : [];
      setTagsArray(tags);
    }
  }, [initialTags]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Avoid duplicates
      if (!tagsArray.includes(tagInput.trim())) {
        const updatedTags = [...tagsArray, tagInput.trim()];
        setTagsArray(updatedTags);
        onTagsChange(updatedTags);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tagsArray.filter((tag) => tag !== tagToRemove);
    setTagsArray(updatedTags);
    onTagsChange(updatedTags);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
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
          placeholder="Type and press enter"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTag}
          sx={{ minWidth: "50px" }}
          disabled={!tagInput.trim()}
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
            <Fade in key={index} timeout={300}>
              <Chip
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ animationDelay: `${index * 100}ms` }}
              />
            </Fade>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            No tags added yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TagInput;
