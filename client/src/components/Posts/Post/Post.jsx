import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Chip,
  Box,
  Divider,
  Avatar,
  Tooltip,
  Zoom,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleIcon from "@mui/icons-material/Schedule";
import moment from "moment";
import { useDispatch } from "react-redux";
import { likePost, deletePost } from "../../../actions/posts";
import { useState } from "react";
import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const [liked, setLiked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleLike = () => {
    dispatch(likePost(post._id));
    setLiked(!liked);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePost(post._id));
    setDeleteModalOpen(false);
  };

  // Handle case where tags might not be an array
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
    ? [post.tags]
    : [];

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        position: "relative",
        transition: "all 0.3s ease",
        overflow: "hidden",
        transform: isHovering ? "translateY(-8px)" : "none",
        boxShadow: isHovering
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Creator Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: 8,
          padding: "4px 12px",
          backdropFilter: "blur(4px)",
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            backgroundColor: "primary.main",
            fontSize: "0.8rem",
            marginRight: 1,
          }}
        >
          {post.creator ? post.creator.charAt(0).toUpperCase() : "?"}
        </Avatar>
        <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
          {post.creator}
        </Typography>
      </Box>

      {/* Edit Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
        onClick={() => setCurrentId(post._id)}
      >
        <EditIcon />
      </IconButton>

      {/* Image */}
      <CardMedia
        sx={{
          height: 0,
          paddingTop: "60%",
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        image={
          post.selectedFile ||
          "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
        }
        title={post.title}
      />

      {/* Time Badge */}
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "4px 10px",
          borderRadius: 8,
          fontSize: "0.75rem",
          backdropFilter: "blur(4px)",
        }}
      >
        <ScheduleIcon fontSize="small" />
        <Typography variant="caption" sx={{ color: "white" }}>
          {moment(post.createdAt).fromNow()}
        </Typography>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: "primary.dark",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
          }}
        >
          {post.message}
        </Typography>

        {/* Tags */}
        {tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 2 }}>
            {tags
              .filter((tag) => tag && tag.trim() !== "")
              .map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    height: "22px",
                  }}
                />
              ))}
          </Box>
        )}
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        }}
      >
        <Tooltip title="Like this memory" TransitionComponent={Zoom} arrow>
          <Button
            size="small"
            color={liked ? "secondary" : "primary"}
            onClick={handleLike}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(63, 81, 181, 0.08)",
              },
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
            startIcon={<ThumbUpAltIcon fontSize="small" />}
          >
            <Typography variant="body2">{post.likeCount || 0}</Typography>
          </Button>
        </Tooltip>

        <Tooltip title="Delete this memory" TransitionComponent={Zoom} arrow>
          <Button
            size="small"
            color="error"
            onClick={handleDeleteClick}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.08)",
              },
            }}
            startIcon={<DeleteIcon fontSize="small" />}
          >
            <Typography variant="body2">Delete</Typography>
          </Button>
        </Tooltip>
      </CardActions>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        postTitle={post.title}
      />
    </Card>
  );
};

export default Post;
