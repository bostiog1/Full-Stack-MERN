import React, { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Tooltip,
  Zoom,
  Box,
  ButtonBase,
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
      // Handle error (e.g., show a toast notification)
    }
  };
  // const handleConfirmDelete = () => {
  //   dispatch(deletePost(post._id));
  //   setDeleteModalOpen(false);
  // };

  // const handleLikeClick = () => dispatch(likePost(post._id));
  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevents navigation if the button is within a clickable area
    if (!user?.result) return; // Only allow logged-in users to like

    const userId = user?.result?.googleId || user?.result?._id;
    // Store the likes from the *prop* (the original backend state) for potential rollback
    const originalLikes = Array.isArray(post.likes) ? [...post.likes] : [];

    // Determine if the current user has liked based on the *local* 'likes' state
    const currentUserHasLikedOptimistic = likes.includes(userId);

    // Optimistically update the local 'likes' state
    let newOptimisticLikes;
    if (currentUserHasLikedOptimistic) {
      newOptimisticLikes = likes.filter((id) => id !== userId); // Remove like
    } else {
      newOptimisticLikes = [...likes, userId]; // Add like
    }
    setLikes(newOptimisticLikes); // Instantly update the UI

    try {
      // Dispatch the action to update the backend and eventually Redux
      await dispatch(likePost(post._id));
      // No need to setLikes again here; the useEffect above handles prop updates from Redux
    } catch (error) {
      console.error("Error liking post:", error);
      // Rollback: Revert local state to the original if the backend call fails
      setLikes(originalLikes);
      // Optional: Show an error message to the user (e.g., using a toast/snackbar)
    }
  };

  const userHasLiked =
    user?.result &&
    Array.isArray(post.likes) &&
    post.likes.find(
      (id) => id === (user?.result?.googleId || user?.result?._id)
    );

  const renderLikes = () => {
    // Use the local 'likes' state for rendering
    const likesArray = Array.isArray(likes) ? likes : [];
    const likesCount = likesArray.length;

    const userId = user?.result?.googleId || user?.result?._id;
    // Recalculate if the current user has liked based on the LOCAL 'likes' state
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
        height: "100%", // Ensure consistent height
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
            height: 150, // Fixed height for consistency

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
                // color={userHasLiked && isLoggedIn ? "secondary" : "primary"}
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
                // startIcon={
                //   userHasLiked && isLoggedIn ? (
                //     <FavoriteIcon />
                //   ) : (
                //     <FavoriteBorderIcon />
                //   )
                // }
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
        postTitle={post.title}
      />
    </Card>
  );
};

export default Post;
// import React, { useState } from "react";
// import {
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Button,
//   Typography,
//   Tooltip,
//   Zoom,
//   Box,
// } from "@mui/material";
// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import moment from "moment";
// import { useDispatch } from "react-redux";
// import { makeStyles } from "@mui/styles";

// import { likePost, deletePost } from "../../../actions/posts";
// import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

// const useStyles = makeStyles((theme) => ({
//   card: {
//     display: "flex",
//     flexDirection: "column",
//     width: "220px",
//     height: "235px",
//     borderRadius: "15px",
//     position: "relative",
//     backgroundColor: theme.palette?.background?.paper || "#fff",
//     overflow: "hidden",
//   },
//   media: {
//     height: "100px",
//     backgroundColor: "rgba(0, 0, 0, 0.1)",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   },
//   overlay: {
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     color: "white",
//     zIndex: 1,
//     textShadow: "0px 0px 3px rgba(0,0,0,0.6)",
//   },
//   creatorName: {
//     fontSize: "0.8rem",
//     fontWeight: "bold",
//     lineHeight: 1.2,
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//     maxWidth: "120px",
//   },
//   timeText: {
//     fontSize: "0.65rem",
//     lineHeight: 1.2,
//   },
//   overlay2: {
//     position: "absolute",
//     top: "8px",
//     right: "8px",
//     color: "white",
//     zIndex: 1,
//   },
//   editButton: {
//     color: "white",
//     minWidth: "auto",
//     padding: "4px",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     "&:hover": {
//       backgroundColor: "rgba(0,0,0,0.5)",
//     },
//   },
//   contentWrapper: {
//     padding: "8px 12px",
//     flexGrow: 1,
//     display: "flex",
//     flexDirection: "column",
//     // justifyContent: "space-between",
//     minHeight: 0,
//     overflow: "hidden",
//   },
//   details: {
//     marginBottom: "4px",
//     maxHeight: "18px",
//     overflow: "hidden",
//   },
//   tagText: {
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     fontSize: "0.7rem",
//     lineHeight: 1.3,
//     color: theme.palette?.text?.secondary || "grey",
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: "0.95rem",
//     lineHeight: 1.3,
//     marginBottom: "4px",
//     maxHeight: "40px",
//     overflow: "hidden",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     textOverflow: "ellipsis",
//   },
//   messageContent: {
//     flexGrow: 1,
//     overflow: "hidden",
//     minHeight: "30px",
//     padding: "0 !important",
//     marginBottom: "4px",
//   },
//   messageText: {
//     fontSize: "0.75rem",
//     lineHeight: 1.4,
//     overflow: "hidden",
//     display: "-webkit-box",
//     WebkitLineClamp: 3,
//     WebkitBoxOrient: "vertical",
//     textOverflow: "ellipsis",
//     color: theme.palette?.text?.secondary || "grey",
//   },
//   cardActions: {
//     padding: "1px 1px",
//     borderTop: `1px solid ${theme.palette?.divider || "rgba(0,0,0,0.12)"}`,
//     minHeight: "40px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   actionButton: {
//     padding: "1px 2px",
//     fontSize: "0.7rem",
//     maxWidth: "120px",
//   },
//   likeButtonTextContainer: {
//     display: "flex",
//     alignItems: "center",
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//   },
// }));

// const Post = ({ post, setCurrentId }) => {
//   const dispatch = useDispatch();
//   const classes = useStyles();
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const user = JSON.parse(localStorage.getItem("profile"));

//   const handleDeleteClick = () => setDeleteModalOpen(true);
//   const handleCloseDeleteModal = () => setDeleteModalOpen(false);
//   const handleConfirmDelete = () => {
//     dispatch(deletePost(post._id));
//     setDeleteModalOpen(false);
//   };
//   const handleLikeClick = () => dispatch(likePost(post._id));

//   const userHasLiked =
//     user?.result &&
//     Array.isArray(post.likes) &&
//     post.likes.find(
//       (id) => id === (user?.result?.googleId || user?.result?._id)
//     );

//   const renderLikes = () => {
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const likesCount = likesArray.length;
//     const IconComponent = userHasLiked ? ThumbUpAltIcon : ThumbUpAltOutlined;
//     let text =
//       likesCount > 0
//         ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//         : "Like";

//     if (user?.result) {
//       if (userHasLiked) {
//         text =
//           likesCount > 1
//             ? `You and ${likesCount - 1} ${
//                 likesCount === 2 ? "other" : "others"
//               }`
//             : "You";
//       }
//     }
//     return (
//       <Box component="span" className={classes.likeButtonTextContainer}>
//         <IconComponent fontSize="small" sx={{ mr: 0.5 }} />
//         {text}
//       </Box>
//     );
//   };

//   const processedTags = Array.isArray(post.tags)
//     ? post.tags.map((tag) => tag.trim()).filter((tag) => tag !== "")
//     : typeof post.tags === "string" && post.tags.trim() !== ""
//     ? post.tags
//         .split(",")
//         .map((tag) => tag.trim())
//         .filter((tag) => tag !== "")
//     : [];

//   const isCreator =
//     user?.result?.googleId === post?.creator ||
//     user?.result?._id === post?.creator;
//   const isLoggedIn = !!user?.result;
//   const defaultImage =
//     "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png";

//   return (
//     <Card className={classes.card}>
//       <CardMedia
//         className={classes.media}
//         image={post.selectedFile || defaultImage}
//         title={post.title || "Post image"}
//       />
//       <div className={classes.overlay}>
//         <Typography variant="h6" className={classes.creatorName}>
//           {post.name || post.creator || "Unknown User"}
//         </Typography>
//         <Typography variant="body2" className={classes.timeText}>
//           {moment(post.createdAt).fromNow()}
//         </Typography>
//       </div>

//       {isCreator && (
//         <div className={classes.overlay2}>
//           <Button
//             className={classes.editButton}
//             size="small"
//             onClick={(e) => {
//               e.stopPropagation();
//               setCurrentId(post._id);
//             }}
//           >
//             <MoreHorizIcon fontSize="small" />
//           </Button>
//         </div>
//       )}

//       <div className={classes.contentWrapper}>
//         <Box sx={{ overflow: "hidden", flexShrink: 1, minHeight: 0 }}>
//           {processedTags.length > 0 && (
//             <div className={classes.details}>
//               <Typography variant="body2" className={classes.tagText}>
//                 {processedTags.map((tag) => `#${tag}`).join(" ")}
//               </Typography>
//             </div>
//           )}

//           <Typography className={classes.title} variant="h5" component="h2">
//             {post.title || "Untitled Post"}
//           </Typography>

//           <CardContent className={classes.messageContent}>
//             <Typography
//               variant="body2"
//               component="p"
//               className={classes.messageText}
//             >
//               {post.message || "No description provided."}
//             </Typography>
//           </CardContent>
//         </Box>

//         <CardActions className={classes.cardActions}>
//           <Tooltip
//             title={
//               isLoggedIn
//                 ? userHasLiked
//                   ? "Remove like"
//                   : "Like"
//                 : "Sign in to like"
//             }
//             TransitionComponent={Zoom}
//             arrow
//             placement="top"
//           >
//             <span>
//               <Button
//                 size="small"
//                 color={userHasLiked && isLoggedIn ? "secondary" : "primary"}
//                 onClick={handleLikeClick}
//                 disabled={!isLoggedIn}
//                 className={classes.actionButton}
//               >
//                 {renderLikes()}
//               </Button>
//             </span>
//           </Tooltip>

//           {isCreator && (
//             <Tooltip
//               title="Delete memory"
//               TransitionComponent={Zoom}
//               arrow
//               placement="top"
//             >
//               <Button
//                 size="small"
//                 color="primary"
//                 onClick={handleDeleteClick}
//                 className={classes.actionButton}
//                 sx={{ flexShrink: 0 }}
//               >
//                 <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} /> Delete
//               </Button>
//             </Tooltip>
//           )}
//         </CardActions>
//       </div>

//       <DeleteConfirmationModal
//         open={deleteModalOpen}
//         handleClose={handleCloseDeleteModal}
//         handleConfirmDelete={handleConfirmDelete}
//         postTitle={post.title}
//       />
//     </Card>
//   );
// };

// export default Post;
