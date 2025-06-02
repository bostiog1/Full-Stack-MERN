import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Chip,
  Fade,
  Grow,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Send,
  AccountCircle,
  EmojiEmotions,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { commentPost } from "../../actions/posts";
import postStyles from "./styles";

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(
    Array.isArray(post?.comments) ? post.comments : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const commentsRef = useRef();

  // Effect to update the local 'comments' state when the 'post.comments' prop changes.
  useEffect(() => {
    setComments(Array.isArray(post?.comments) ? post.comments : []);
  }, [post?.comments]);

  // Handler for submitting a new comment
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
    </Box>
  );
};

export default CommentSection;
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Avatar,
//   Divider,
// } from "@mui/material";
// import { useDispatch } from "react-redux";

// import { commentPost } from "../../actions/posts";
// import postStyles from "./styles";

// const CommentSection = ({ post }) => {
//   const user = JSON.parse(localStorage.getItem("profile"));
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState(
//     Array.isArray(post?.comments) ? post.comments : []
//   );
//   const dispatch = useDispatch();
//   const commentsRef = useRef();

//   // Effect to update the local 'comments' state when the 'post.comments' prop changes.
//   useEffect(() => {
//     setComments(Array.isArray(post?.comments) ? post.comments : []);
//   }, [post?.comments]);

//   // Handler for submitting a new comment
//   const handleComment = async () => {
//     if (!user?.result?.name) {
//       console.log("Please sign in to comment.");
//       return;
//     }

//     if (!comment.trim()) {
//       console.log("Comment cannot be empty.");
//       return;
//     }

//     const finalComment = `${user?.result?.name}: ${comment}`;

//     try {
//       const newComments = await dispatch(commentPost(finalComment, post._id));

//       setComment("");
//       setComments(newComments);

//       if (commentsRef.current) {
//         setTimeout(() => {
//           if (commentsRef.current) {
//             commentsRef.current.scrollIntoView({
//               behavior: "smooth",
//               block: "end",
//             });
//           }
//         }, 100);
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   const isLoggedIn = !!user?.result?.name;

//   return (
//     <Box sx={{ mt: 3, p: 2, borderTop: "1px solid #e0e0e0" }}>
//       <Box sx={postStyles.commentsOuterContainer}>
//         {/* Comments List Section */}
//         <Box sx={postStyles.commentsInnerContainer}>
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
//             Comments
//           </Typography>
//           {comments.length === 0 ? (
//             <Typography variant="body2" color="text.secondary">
//               No comments yet. Be the first to comment!
//             </Typography>
//           ) : (
//             comments.map((c, i) => (
//               <Box key={i} sx={postStyles.commentText}>
//                 <Avatar
//                   sx={{
//                     bgcolor: "primary.main",
//                     width: 28,
//                     height: 28,
//                     fontSize: "0.8rem",
//                   }}
//                 >
//                   {c.split(": ")[0][0]}
//                 </Avatar>
//                 <Typography
//                   variant="subtitle1"
//                   component="span"
//                   sx={{ flex: 1 }}
//                 >
//                   <Box component="span" sx={postStyles.commentAuthor}>
//                     {c.split(": ")[0]}
//                   </Box>
//                   {c.split(": ").length > 1
//                     ? c.split(": ").slice(1).join(": ")
//                     : c}
//                 </Typography>
//               </Box>
//             ))
//           )}
//           <div ref={commentsRef} />
//         </Box>

//         {/* Write a Comment Input Section */}
//         <Box sx={postStyles.commentInputContainer}>
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
//             {isLoggedIn ? "Write a comment" : "Sign in to comment"}
//           </Typography>
//           <TextField
//             fullWidth
//             rows={4}
//             variant="outlined"
//             label={isLoggedIn ? "Comment" : "Sign in to write a comment"}
//             multiline
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             disabled={!isLoggedIn}
//             sx={{ mb: 1.5, borderRadius: 2 }}
//           />
//           <Button
//             fullWidth
//             disabled={!comment.length || !isLoggedIn}
//             color="primary"
//             variant="contained"
//             onClick={handleComment}
//             sx={{
//               mt: 1,
//               textTransform: "none",
//               fontWeight: 600,
//               borderRadius: 2,
//             }}
//           >
//             Comment
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CommentSection;
