import { useState, useRef, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Chip,
  Fade,
  Grow,
  IconButton,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Send,
  AccountCircle,
  EmojiEmotions,
  DeleteOutline,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { commentPost, deleteComment } from "../../actions/posts";
import postStyles from "./styles";
import DeleteConfirmationModal from "../UI/DeleteConfirmationModal";

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(
    Array.isArray(post?.comments) ? post.comments : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDeleteIndex, setCommentToDeleteIndex] = useState(null);

  useEffect(() => {
    setComments(Array.isArray(post?.comments) ? post.comments : []);
  }, [post?.comments]);

  const handleComment = async () => {
    if (!user?.result?.name) {
      console.log("Please sign in to comment.");
      return;
    }
    if (!comment.trim()) {
      console.log("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    const finalComment = `${user?.result?.name}: ${comment}`;

    try {
      const newComments = await dispatch(commentPost(finalComment, post._id));
      setComment("");
      setComments(newComments);

      if (commentsRef.current) {
        setTimeout(() => {
          if (commentsRef.current) {
            commentsRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (index, commentText) => {
    setCommentToDeleteIndex(index);

    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCommentToDeleteIndex(null);
  };

  const handleConfirmDeleteComment = async () => {
    if (commentToDeleteIndex !== null) {
      try {
        const updatedComments = await dispatch(
          deleteComment(post._id, commentToDeleteIndex)
        );
        setComments(updatedComments);
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleComment();
    }
  };

  const isLoggedIn = !!user?.result?.name;

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        borderTop: "2px solid #f0f0f0",
        background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        borderRadius: "0 0 20px 20px",
      }}
    >
      <Box sx={postStyles.commentsOuterContainer}>
        {/* Comments List Section */}
        <Box sx={postStyles.commentsInnerContainer}>
          <Box sx={postStyles.sectionTitle}>
            <ChatBubbleOutline sx={{ color: "#1976d2" }} />
            Comments
            {comments.length > 0 && (
              <Chip
                label={comments.length}
                size="small"
                sx={postStyles.commentCount}
              />
            )}
          </Box>

          {comments.length === 0 ? (
            <Box sx={postStyles.emptyCommentsContainer}>
              <EmojiEmotions sx={postStyles.emptyCommentsIcon} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                No comments yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, opacity: 0.8 }}
              >
                Be the first to share your thoughts!
              </Typography>
            </Box>
          ) : (
            <Box>
              {comments.map((c, i) => (
                <Grow key={i} in timeout={300 + i * 100}>
                  <Box sx={postStyles.commentItem}>
                    <Avatar sx={postStyles.commentAvatar}>
                      {c.split(": ")[0][0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={postStyles.commentContent}>
                      <Typography sx={postStyles.commentAuthor}>
                        {c.split(": ")[0]}
                      </Typography>
                      <Typography sx={postStyles.commentText}>
                        {c.split(": ").length > 1
                          ? c.split(": ").slice(1).join(": ")
                          : c}
                      </Typography>
                    </Box>
                    {user?.result?.name === c.split(": ")[0] && (
                      <IconButton
                        size="small"
                        onClick={() => openDeleteModal(i, c)}
                        aria-label="delete comment"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Grow>
              ))}
            </Box>
          )}
          <div ref={commentsRef} />
        </Box>

        {/* Write a Comment Input Section */}
        <Fade in timeout={500}>
          <Box sx={postStyles.commentInputContainer}>
            <Box sx={postStyles.sectionTitle}>
              <AccountCircle sx={{ color: "#1976d2" }} />
              {isLoggedIn ? "Write a comment" : "Sign in to comment"}
            </Box>

            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              label={
                isLoggedIn
                  ? "Share your thoughts..."
                  : "Sign in to write a comment"
              }
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isLoggedIn || isSubmitting}
              sx={postStyles.commentTextField}
              helperText={
                isLoggedIn ? "Press Ctrl+Enter to submit quickly" : ""
              }
            />

            <Button
              fullWidth
              disabled={!comment.trim() || !isLoggedIn || isSubmitting}
              color="primary"
              variant="contained"
              onClick={handleComment}
              sx={postStyles.commentButton}
              startIcon={<Send />}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </Box>
        </Fade>
      </Box>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDeleteComment}
        itemToDeleteName="this comment"
        itemType="Comment"
      />
    </Box>
  );
};

export default CommentSection;
