import { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardMedia,
  Button,
  Typography,
  Tooltip,
  Zoom,
  Box,
  IconButton,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import Chip from "@mui/material/Chip";

import { useDispatch } from "react-redux";
import postStyles from "./styles";
import { useNavigate } from "react-router-dom";

import { likePost, deletePost } from "../../../actions/posts";
import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

const Post = ({ post, setCurrentId, page, refreshPosts }) => {
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();

  // New: Local state for likes, initialized from post.likes prop
  const [likes, setLikes] = useState(
    Array.isArray(post.likes) ? post.likes : []
  );

  // New: Sync local 'likes' state with 'post.likes' prop whenever the prop changes
  useEffect(() => {
    setLikes(Array.isArray(post.likes) ? post.likes : []);
  }, [post.likes]);

  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleConfirmDelete = () => {
    try {
      dispatch(deletePost(post._id));
      setDeleteModalOpen(false);

      // Call the callback from Home.jsx to refresh posts for the current page
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteModalOpen(false);
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!user?.result) return;

    const userId = user?.result?.googleId || user?.result?._id;
    const originalLikes = Array.isArray(post.likes) ? [...post.likes] : [];

    const currentUserHasLikedOptimistic = likes.includes(userId);

    let newOptimisticLikes;
    if (currentUserHasLikedOptimistic) {
      newOptimisticLikes = likes.filter((id) => id !== userId);
    } else {
      newOptimisticLikes = [...likes, userId];
    }
    setLikes(newOptimisticLikes);

    try {
      dispatch(likePost(post._id));
    } catch (error) {
      console.error("Error liking post:", error);
      setLikes(originalLikes);
    }
  };

  const userHasLiked =
    user?.result &&
    Array.isArray(post.likes) &&
    post.likes.find(
      (id) => id === (user?.result?.googleId || user?.result?._id)
    );

  const renderLikes = () => {
    const likesArray = Array.isArray(likes) ? likes : [];
    const likesCount = likesArray.length;

    const userId = user?.result?.googleId || user?.result?._id;
    const currentUserHasLiked = user?.result && likesArray.includes(userId);

    const IconComponent = currentUserHasLiked
      ? ThumbUpAltIcon
      : ThumbUpAltOutlined;
    let text =
      likesCount > 0
        ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
        : "Like";

    if (user?.result) {
      if (currentUserHasLiked) {
        text =
          likesCount > 1
            ? `You and ${likesCount - 1} ${
                likesCount === 2 ? "other" : "others"
              }`
            : "You";
      }
    }

    return (
      <Box component="span" sx={postStyles.likeButtonTextContainer}>
        <IconComponent fontSize="small" sx={{ mr: 0.5 }} />
        {text}
      </Box>
    );
  };

  const processedTags = Array.isArray(post.tags)
    ? post.tags.map((tag) => tag.trim()).filter((tag) => tag !== "")
    : typeof post.tags === "string" && post.tags.trim() !== ""
    ? post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    : [];

  const isCreator =
    user?.result?.googleId === post?.creator ||
    user?.result?._id === post?.creator;
  const isLoggedIn = !!user?.result;
  const defaultImage =
    "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png";

  return (
    <Card
      sx={{
        ...postStyles.card,
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
        height: "100%",
        width: "250px",
        display: "flex",
        flexDirection: "column",
      }}
      raised
      elevation={3}
    >
      {/* Image Section - Clickable */}
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          "&:hover .overlay-content": {
            opacity: 1,
          },
        }}
        onClick={openPost}
      >
        <CardMedia
          sx={{
            ...postStyles.media,
            height: 150,

            objectFit: "cover",

            borderRadius: "12px 12px 0 0",
          }}
          image={post.selectedFile || defaultImage}
          title={post.title || "Post image"}
        />

        {/* Creator Info Overlay */}
        <Box
          className="overlay-content"
          sx={{
            ...postStyles.overlay,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
            borderRadius: "12px 12px 0 0",
            opacity: 0.8,
            transition: "opacity 0.3s ease",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ ...postStyles.creatorName, fontWeight: 600 }}
          >
            {post.name || post.creator || "Unknown User"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ ...postStyles.timeText, opacity: 0.9 }}
          >
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>

        {/* Edit Button - Non-clickable for navigation */}
        {isCreator && (
          <Box
            sx={{
              ...postStyles.overlay2,
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          ...postStyles.contentWrapper,
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tags */}
        {processedTags.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {processedTags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontSize: "0.75rem",
                    height: 24,
                    borderRadius: 2,
                  }}
                />
              ))}
              {processedTags.length > 3 && (
                <Chip
                  label={`+${processedTags.length - 3}`}
                  size="small"
                  variant="outlined"
                  color="default"
                  sx={{
                    fontSize: "0.75rem",
                    height: 24,
                    borderRadius: 2,
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Title - Clickable */}
        <Typography
          sx={{
            ...postStyles.title,
            cursor: "pointer",
            mb: 1,
            fontWeight: 600,
            fontSize: "1.25rem",
            lineHeight: 1.3,
            "&:hover": {
              color: "primary.main",
            },
          }}
          variant="h6"
          component="h2"
          onClick={openPost}
        >
          {post.title || "Untitled Post"}
        </Typography>

        {/* Message - Clickable with better spacing */}
        <Box
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            mb: 2,
            minHeight: 60, // Minimum height for consistent layout
          }}
          onClick={openPost}
        >
          <Typography
            variant="body2"
            component="p"
            sx={{
              ...postStyles.messageText,
              color: "text.secondary",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            {post.message || "No description provided."}
          </Typography>
        </Box>

        {/* Actions - Non-clickable for navigation */}
        <CardActions
          sx={{
            ...postStyles.cardActions,
            p: 0,
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
          }}
        >
          <Tooltip
            title={
              isLoggedIn
                ? userHasLiked
                  ? "Remove like"
                  : "Like"
                : "Sign in to like"
            }
            TransitionComponent={Zoom}
            arrow
            placement="top"
          >
            <span>
              <Button
                size="small"
                color={
                  user?.result &&
                  likes.includes(user.result.googleId || user.result._id) &&
                  isLoggedIn
                    ? "secondary"
                    : "primary"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(e);
                }}
                disabled={!isLoggedIn}
                sx={{
                  ...postStyles.actionButton,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {renderLikes()}
              </Button>
            </span>
          </Tooltip>
          {isCreator && (
            <Tooltip
              title="Delete memory"
              TransitionComponent={Zoom}
              arrow
              placement="top"
            >
              <Button
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(e);
                }}
                sx={{
                  ...postStyles.actionButton,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                startIcon={<DeleteIcon fontSize="small" />}
              >
                Delete
              </Button>
            </Tooltip>
          )}
        </CardActions>
      </Box>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        itemToDeleteName={post.title} 
        itemType="Memory" 
      />
    </Card>
  );
};

export default Post;
