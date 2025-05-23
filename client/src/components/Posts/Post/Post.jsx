import React, { useState } from "react";
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
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import { useDispatch } from "react-redux";
import postStyles from "./styles";

import { likePost, deletePost } from "../../../actions/posts";
import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
  const handleConfirmDelete = () => {
    dispatch(deletePost(post._id));
    setDeleteModalOpen(false);
  };
  const handleLikeClick = () => dispatch(likePost(post._id));

  const userHasLiked =
    user?.result &&
    Array.isArray(post.likes) &&
    post.likes.find(
      (id) => id === (user?.result?.googleId || user?.result?._id)
    );

  const renderLikes = () => {
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const likesCount = likesArray.length;
    const IconComponent = userHasLiked ? ThumbUpAltIcon : ThumbUpAltOutlined;
    let text =
      likesCount > 0
        ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
        : "Like";

    if (user?.result) {
      if (userHasLiked) {
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
    <Card sx={postStyles.card}>
      <CardMedia
        sx={postStyles.media}
        image={post.selectedFile || defaultImage}
        title={post.title || "Post image"}
      />
      {/* Use Box component with sx for the overlay div to utilize MUI's styling */}
      <Box sx={postStyles.overlay}>
        <Typography variant="h6" sx={postStyles.creatorName}>
          {post.name || post.creator || "Unknown User"}
        </Typography>
        <Typography variant="body2" sx={postStyles.timeText}>
          {moment(post.createdAt).fromNow()}
        </Typography>
      </Box>

      {isCreator && (
        <Box sx={postStyles.overlay2}>
          <Button
            sx={postStyles.editButton}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </Button>
        </Box>
      )}

      <Box sx={postStyles.contentWrapper}>
        <Box sx={{ overflow: "hidden", flexShrink: 1, minHeight: 0 }}>
          {processedTags.length > 0 && (
            <Box sx={postStyles.details}>
              <Typography variant="body2" sx={postStyles.tagText}>
                {processedTags.map((tag) => `#${tag}`).join(" ")}
              </Typography>
            </Box>
          )}

          <Typography sx={postStyles.title} variant="h5" component="h2">
            {post.title || "Untitled Post"}
          </Typography>

          <CardContent sx={postStyles.messageContent}>
            <Typography
              variant="body2"
              component="p"
              sx={postStyles.messageText}
            >
              {post.message || "No description provided."}
            </Typography>
          </CardContent>
        </Box>

        <CardActions sx={postStyles.cardActions}>
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
            {/* The <span> is kept to correctly wrap the Button for the Tooltip */}
            <span>
              <Button
                size="small"
                color={userHasLiked && isLoggedIn ? "secondary" : "primary"}
                onClick={handleLikeClick}
                disabled={!isLoggedIn}
                sx={postStyles.actionButton}
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
                color="primary"
                onClick={handleDeleteClick}
                sx={{ ...postStyles.actionButton, flexShrink: 0 }} // Merge actionButton with flexShrink for delete
              >
                <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} /> Delete
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
