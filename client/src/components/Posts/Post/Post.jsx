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
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("profile")); // Get user info

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

  // Handle liking a post
  const handleLikeClick = () => {
    dispatch(likePost(post._id));
  };

  // Check if current user has liked this post
  const userHasLiked =
    user?.result &&
    Array.isArray(post.likes) &&
    post.likes.find((id) => id === (user.result.googleId || user.result._id));

  // Render the like button text and icon
  const renderLikes = () => {
    // Ensure post.likes is an array, default to empty if not
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const likesCount = likesArray.length;

    if (!user?.result) {
      // User not logged in
      return (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;
          {likesCount > 0
            ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
            : "Like"}
        </>
      );
    }

    // User is logged in
    if (userHasLiked) {
      // Current user has liked the post
      return (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likesCount > 1
            ? `You and ${likesCount - 1} ${
                likesCount === 2 ? "other" : "others"
              }`
            : "You liked this"}
        </>
      );
    } else {
      // Current user has not liked the post
      return (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;
          {likesCount > 0
            ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
            : "Like"}
        </>
      );
    }
  };

  // Handle case where tags might not be an array
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
    ? [post.tags]
    : [];

  // Determine if the current user is the creator to show edit/delete buttons
  const isCreator =
    user?.result?.googleId === post?.creator ||
    user?.result?._id === post?.creator;

  // Determine if the user is logged in to enable/disable like button
  const isLoggedIn = !!user?.result;

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
          {post.name ? post.name.charAt(0).toUpperCase() : "?"}
        </Avatar>
        <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
          {post.name}
        </Typography>
      </Box>

      {/* Edit Button - Only show if user is creator */}
      {isCreator && (
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
      )}

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
        <Tooltip
          title={
            isLoggedIn
              ? userHasLiked
                ? "Remove your like"
                : "Like this memory"
              : "Sign in to like"
          }
          TransitionComponent={Zoom}
          arrow
        >
          <span>
            {" "}
            {/* Wrap in span to make tooltip work with disabled button */}
            <Button
              size="small"
              color={userHasLiked ? "secondary" : "primary"}
              onClick={handleLikeClick}
              disabled={!isLoggedIn}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isLoggedIn
                    ? userHasLiked
                      ? "rgba(244, 67, 54, 0.08)"
                      : "rgba(63, 81, 181, 0.08)"
                    : "inherit",
                },
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {renderLikes()}
            </Button>
          </span>
        </Tooltip>

        {/* Delete Button - Only show if user is creator */}
        {isCreator && (
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
        )}
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
// import {
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Button,
//   Typography,
//   IconButton,
//   Chip,
//   Box,
//   Divider,
//   Avatar,
//   Tooltip,
//   Zoom,
// } from "@mui/material";
// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined"; // Import outlined icon
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ScheduleIcon from "@mui/icons-material/Schedule";
// import moment from "moment";
// import { useDispatch } from "react-redux";
// import { likePost, deletePost } from "../../../actions/posts";
// import { useState } from "react";
// import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

// const Post = ({ post, setCurrentId }) => {
//   const dispatch = useDispatch();
//   const [isHovering, setIsHovering] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);

//   const user = JSON.parse(localStorage.getItem("profile")); // Get user info

//   const handleDeleteClick = () => {
//     setDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setDeleteModalOpen(false);
//   };

//   const handleConfirmDelete = () => {
//     dispatch(deletePost(post._id));
//     setDeleteModalOpen(false);
//   };

//   // Helper function to render the like button content
//   const renderLikes = () => {
//     // Ensure post.likes is an array, default to empty if not
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const totalLikes = likesArray.length;

//     const userLiked = likesArray.find(
//       (like) => like === (user?.result?.googleId || user?.result?._id)
//     );

//     return (
//       <>
//         {/* Choose icon based on whether the current user liked it */}
//         {userLiked ? (
//           <ThumbUpAltIcon fontSize="small" />
//         ) : (
//           <ThumbUpAltOutlined fontSize="small" />
//         )}
//         {/* Display the total number of likes or "Like" */}
//         &nbsp;{totalLikes > 0 ? totalLikes : "Like"}
//       </>
//     );
//   };

//   // Handle case where tags might not be an array
//   const tags = Array.isArray(post.tags)
//     ? post.tags
//     : typeof post.tags === "string"
//     ? [post.tags]
//     : [];

//   // Determine if the current user is the creator to show edit/delete buttons
//   const isCreator =
//     user?.result?.googleId === post?.creator ||
//     user?.result?._id === post?.creator;

//   // Determine if the user is logged in
//   const isLoggedIn = !!user?.result;
//   // Determine if the user has liked this specific post (used for button color and tooltip)
//   const userHasLiked = Array.isArray(post.likes)
//     ? post.likes.find(
//         (like) => like === (user?.result?.googleId || user?.result?._id)
//       )
//     : false;

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         borderRadius: 3,
//         position: "relative",
//         transition: "all 0.3s ease",
//         overflow: "hidden",
//         transform: isHovering ? "translateY(-8px)" : "none",
//         boxShadow: isHovering
//           ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//           : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//       }}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Creator Badge */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 16,
//           left: 16,
//           zIndex: 10,
//           display: "flex",
//           alignItems: "center",
//           backgroundColor: "rgba(0, 0, 0, 0.6)",
//           borderRadius: 8,
//           padding: "4px 12px",
//           backdropFilter: "blur(4px)",
//         }}
//       >
//         <Avatar
//           sx={{
//             width: 28,
//             height: 28,
//             backgroundColor: "primary.main",
//             fontSize: "0.8rem",
//             marginRight: 1,
//           }}
//         >
//           {post.name ? post.name.charAt(0).toUpperCase() : "?"}
//         </Avatar>
//         <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
//           {post.name}
//         </Typography>
//       </Box>

//       {/* Edit Button - Only show if user is creator */}
//       {isCreator && (
//         <IconButton
//           sx={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             zIndex: 10,
//             backgroundColor: "rgba(255, 255, 255, 0.8)",
//             "&:hover": {
//               backgroundColor: "rgba(255, 255, 255, 0.9)",
//               transform: "scale(1.1)",
//             },
//             transition: "all 0.2s ease",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//           }}
//           onClick={() => setCurrentId(post._id)}
//         >
//           <EditIcon />
//         </IconButton>
//       )}

//       {/* Image */}
//       <CardMedia
//         sx={{
//           height: 0,
//           paddingTop: "60%",
//           position: "relative",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//         image={
//           post.selectedFile ||
//           "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
//         }
//         title={post.title}
//       />

//       {/* Time Badge */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: "42%",
//           right: 16,
//           display: "flex",
//           alignItems: "center",
//           gap: 0.5,
//           backgroundColor: "rgba(0, 0, 0, 0.6)",
//           color: "white",
//           padding: "4px 10px",
//           borderRadius: 8,
//           fontSize: "0.75rem",
//           backdropFilter: "blur(4px)",
//         }}
//       >
//         <ScheduleIcon fontSize="small" />
//         <Typography variant="caption" sx={{ color: "white" }}>
//           {moment(post.createdAt).fromNow()}
//         </Typography>
//       </Box>

//       {/* Content */}
//       <CardContent sx={{ flexGrow: 1, p: 3 }}>
//         <Typography
//           variant="h5"
//           component="h2"
//           sx={{
//             mb: 1,
//             fontWeight: 600,
//             color: "primary.dark",
//             lineHeight: 1.3,
//           }}
//         >
//           {post.title}
//         </Typography>

//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             mb: 2,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: "vertical",
//             lineHeight: 1.5,
//           }}
//         >
//           {post.message}
//         </Typography>

//         {/* Tags */}
//         {tags.length > 0 && (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 2 }}>
//             {tags
//               .filter((tag) => tag && tag.trim() !== "")
//               .map((tag, index) => (
//                 <Chip
//                   key={index}
//                   label={`#${tag}`}
//                   size="small"
//                   color="primary"
//                   variant="outlined"
//                   sx={{
//                     borderRadius: "4px",
//                     fontSize: "0.7rem",
//                     height: "22px",
//                   }}
//                 />
//               ))}
//           </Box>
//         )}
//       </CardContent>

//       <Divider />

//       {/* Actions */}
//       <CardActions
//         sx={{
//           padding: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           backgroundColor: "rgba(0, 0, 0, 0.02)",
//         }}
//       >
//         <Tooltip
//           title={
//             isLoggedIn
//               ? userHasLiked
//                 ? "Unlike this memory"
//                 : "Like this memory"
//               : "Sign in to like"
//           }
//           TransitionComponent={Zoom}
//           arrow
//         >
//           <Button
//             size="small"
//             color={userHasLiked ? "secondary" : "primary"} // Color reflects if *this user* has liked
//             onClick={() => dispatch(likePost(post._id))} // Dispatches the like action
//             disabled={!isLoggedIn} // Disabled if not logged in
//             sx={{
//               borderRadius: 2,
//               "&:hover": {
//                 backgroundColor: isLoggedIn
//                   ? "rgba(63, 81, 181, 0.08)"
//                   : "inherit",
//               },
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//             }}
//             // renderLikes provides the icon and the simple count text
//           >
//             {renderLikes()}
//           </Button>
//         </Tooltip>

//         {/* Delete Button - Only show if user is creator */}
//         {isCreator && (
//           <Tooltip title="Delete this memory" TransitionComponent={Zoom} arrow>
//             <Button
//               size="small"
//               color="error"
//               onClick={handleDeleteClick}
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: "rgba(244, 67, 54, 0.08)",
//                 },
//               }}
//               startIcon={<DeleteIcon fontSize="small" />}
//             >
//               <Typography variant="body2">Delete</Typography>
//             </Button>
//           </Tooltip>
//         )}
//       </CardActions>

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

// // import {
// //   Card,
// //   CardActions,
// //   CardContent,
// //   CardMedia,
// //   Button,
// //   Typography,
// //   IconButton,
// //   Chip,
// //   Box,
// //   Divider,
// //   Avatar,
// //   Tooltip,
// //   Zoom,
// // } from "@mui/material";
// // import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// // import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined"; // Import outlined icon
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import EditIcon from "@mui/icons-material/Edit";
// // import ScheduleIcon from "@mui/icons-material/Schedule";
// // import moment from "moment";
// // import { useDispatch } from "react-redux";
// // import { likePost, deletePost } from "../../../actions/posts";
// // import { useState } from "react"; // Keep useState for other state if needed
// // import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal";

// // const Post = ({ post, setCurrentId }) => {
// //   const dispatch = useDispatch();
// //   const [isHovering, setIsHovering] = useState(false);
// //   // Removed: const [liked, setLiked] = useState(false); // Redundant state
// //   const [deleteModalOpen, setDeleteModalOpen] = useState(false);

// //   const user = JSON.parse(localStorage.getItem("profile")); // Get user info

// //   // Removed: const handleLike = () => { ... } // Replaced by inline dispatch and Likes logic

// //   const handleDeleteClick = () => {
// //     setDeleteModalOpen(true);
// //   };

// //   const handleCloseDeleteModal = () => {
// //     setDeleteModalOpen(false);
// //   };

// //   const handleConfirmDelete = () => {
// //     dispatch(deletePost(post._id));
// //     setDeleteModalOpen(false);
// //   };

// //   // Helper function to render likes content based on logic from source
// //   const renderLikes = () => {
// //     // Ensure post.likes is an array, default to empty if not
// //     const likesArray = Array.isArray(post.likes) ? post.likes : [];
// //     const userLiked = likesArray.find(
// //       (like) => like === (user?.result?.googleId || user?.result?._id)
// //     );

// //     if (likesArray.length > 0) {
// //       return userLiked ? (
// //         // If user liked
// //         <>
// //           <ThumbUpAltIcon fontSize="small" />
// //           &nbsp;
// //           {likesArray.length > 2
// //             ? `You and ${likesArray.length - 1} others`
// //             : `${likesArray.length} like${likesArray.length > 1 ? "s" : ""}`}
// //         </>
// //       ) : (
// //         // If user did not like, but others did
// //         <>
// //           <ThumbUpAltOutlined fontSize="small" />
// //           &nbsp;
// //           {likesArray.length} {likesArray.length === 1 ? "Like" : "Likes"}
// //         </>
// //       );
// //     }

// //     // If no likes
// //     return (
// //       <>
// //         <ThumbUpAltOutlined fontSize="small" />
// //         &nbsp;Like
// //       </>
// //     );
// //   };

// //   // Handle case where tags might not be an array
// //   const tags = Array.isArray(post.tags)
// //     ? post.tags
// //     : typeof post.tags === "string"
// //     ? [post.tags]
// //     : [];

// //   // Determine if the current user is the creator to show edit/delete buttons
// //   const isCreator =
// //     user?.result?.googleId === post?.creator ||
// //     user?.result?._id === post?.creator;

// //   // Determine if the user is logged in to enable/disable like button and set color
// //   const isLoggedIn = !!user?.result;
// //   const userHasLiked = Array.isArray(post.likes)
// //     ? post.likes.find(
// //         (like) => like === (user?.result?.googleId || user?.result?._id)
// //       )
// //     : false;

// //   return (
// //     <Card
// //       sx={{
// //         display: "flex",
// //         flexDirection: "column",
// //         height: "100%",
// //         borderRadius: 3,
// //         position: "relative",
// //         transition: "all 0.3s ease",
// //         overflow: "hidden",
// //         transform: isHovering ? "translateY(-8px)" : "none",
// //         boxShadow: isHovering
// //           ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
// //           : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
// //       }}
// //       onMouseEnter={() => setIsHovering(true)}
// //       onMouseLeave={() => setIsHovering(false)}
// //     >
// //       {/* Creator Badge */}
// //       <Box
// //         sx={{
// //           position: "absolute",
// //           top: 16,
// //           left: 16,
// //           zIndex: 10,
// //           display: "flex",
// //           alignItems: "center",
// //           backgroundColor: "rgba(0, 0, 0, 0.6)",
// //           borderRadius: 8,
// //           padding: "4px 12px",
// //           backdropFilter: "blur(4px)",
// //         }}
// //       >
// //         <Avatar
// //           sx={{
// //             width: 28,
// //             height: 28,
// //             backgroundColor: "primary.main",
// //             fontSize: "0.8rem",
// //             marginRight: 1,
// //           }}
// //         >
// //           {post.name ? post.name.charAt(0).toUpperCase() : "?"}
// //         </Avatar>
// //         <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
// //           {post.name}
// //         </Typography>
// //       </Box>

// //       {/* Edit Button - Only show if user is creator */}
// //       {isCreator && (
// //         <IconButton
// //           sx={{
// //             position: "absolute",
// //             top: 16,
// //             right: 16,
// //             zIndex: 10,
// //             backgroundColor: "rgba(255, 255, 255, 0.8)",
// //             "&:hover": {
// //               backgroundColor: "rgba(255, 255, 255, 0.9)",
// //               transform: "scale(1.1)",
// //             },
// //             transition: "all 0.2s ease",
// //             boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
// //           }}
// //           onClick={() => setCurrentId(post._id)}
// //         >
// //           <EditIcon />
// //         </IconButton>
// //       )}

// //       {/* Image */}
// //       <CardMedia
// //         sx={{
// //           height: 0,
// //           paddingTop: "60%",
// //           position: "relative",
// //           backgroundSize: "cover",
// //           backgroundPosition: "center",
// //         }}
// //         image={
// //           post.selectedFile ||
// //           "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
// //         }
// //         title={post.title}
// //       />

// //       {/* Time Badge */}
// //       <Box
// //         sx={{
// //           position: "absolute",
// //           top: "42%",
// //           right: 16,
// //           display: "flex",
// //           alignItems: "center",
// //           gap: 0.5,
// //           backgroundColor: "rgba(0, 0, 0, 0.6)",
// //           color: "white",
// //           padding: "4px 10px",
// //           borderRadius: 8,
// //           fontSize: "0.75rem",
// //           backdropFilter: "blur(4px)",
// //         }}
// //       >
// //         <ScheduleIcon fontSize="small" />
// //         <Typography variant="caption" sx={{ color: "white" }}>
// //           {moment(post.createdAt).fromNow()}
// //         </Typography>
// //       </Box>

// //       {/* Content */}
// //       <CardContent sx={{ flexGrow: 1, p: 3 }}>
// //         <Typography
// //           variant="h5"
// //           component="h2"
// //           sx={{
// //             mb: 1,
// //             fontWeight: 600,
// //             color: "primary.dark",
// //             lineHeight: 1.3,
// //           }}
// //         >
// //           {post.title}
// //         </Typography>

// //         <Typography
// //           variant="body2"
// //           color="text.secondary"
// //           sx={{
// //             mb: 2,
// //             overflow: "hidden",
// //             textOverflow: "ellipsis",
// //             display: "-webkit-box",
// //             WebkitLineClamp: 3,
// //             WebkitBoxOrient: "vertical",
// //             lineHeight: 1.5,
// //           }}
// //         >
// //           {post.message}
// //         </Typography>

// //         {/* Tags */}
// //         {tags.length > 0 && (
// //           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 2 }}>
// //             {tags
// //               .filter((tag) => tag && tag.trim() !== "")
// //               .map((tag, index) => (
// //                 <Chip
// //                   key={index}
// //                   label={`#${tag}`}
// //                   size="small"
// //                   color="primary"
// //                   variant="outlined"
// //                   sx={{
// //                     borderRadius: "4px",
// //                     fontSize: "0.7rem",
// //                     height: "22px",
// //                   }}
// //                 />
// //               ))}
// //           </Box>
// //         )}
// //       </CardContent>

// //       <Divider />

// //       {/* Actions */}
// //       <CardActions
// //         sx={{
// //           padding: 2,
// //           display: "flex",
// //           justifyContent: "space-between",
// //           backgroundColor: "rgba(0, 0, 0, 0.02)",
// //         }}
// //       >
// //         <Tooltip
// //           title={
// //             isLoggedIn
// //               ? userHasLiked
// //                 ? "Unlike this memory"
// //                 : "Like this memory"
// //               : "Sign in to like"
// //           }
// //           TransitionComponent={Zoom}
// //           arrow
// //         >
// //           <Button
// //             size="small"
// //             color={userHasLiked ? "secondary" : "primary"} // Set color based on actual liked status from state
// //             onClick={() => dispatch(likePost(post._id))} // Dispatch directly
// //             disabled={!isLoggedIn} // Disable if not logged in
// //             sx={{
// //               borderRadius: 2,
// //               "&:hover": {
// //                 backgroundColor: isLoggedIn
// //                   ? "rgba(63, 81, 181, 0.08)"
// //                   : "inherit", // Adjust hover based on disabled
// //               },
// //               display: "flex",
// //               alignItems: "center",
// //               gap: 0.5,
// //             }}
// //             // The renderLikes function will provide the icon and text
// //           >
// //             {renderLikes()}
// //           </Button>
// //         </Tooltip>

// //         {/* Delete Button - Only show if user is creator */}
// //         {isCreator && (
// //           <Tooltip title="Delete this memory" TransitionComponent={Zoom} arrow>
// //             <Button
// //               size="small"
// //               color="error"
// //               onClick={handleDeleteClick}
// //               sx={{
// //                 borderRadius: 2,
// //                 "&:hover": {
// //                   backgroundColor: "rgba(244, 67, 54, 0.08)",
// //                 },
// //               }}
// //               startIcon={<DeleteIcon fontSize="small" />}
// //             >
// //               <Typography variant="body2">Delete</Typography>
// //             </Button>
// //           </Tooltip>
// //         )}
// //       </CardActions>

// //       <DeleteConfirmationModal
// //         open={deleteModalOpen}
// //         handleClose={handleCloseDeleteModal}
// //         handleConfirmDelete={handleConfirmDelete}
// //         postTitle={post.title}
// //       />
// //     </Card>
// //   );
// // };

