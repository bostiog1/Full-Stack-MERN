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

  // Default image to use when no image is provided
  const defaultImage =
    "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png";

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%", // Full width of grid item
        height: "400px", // Slightly reduced height
        borderRadius: 3,
        position: "relative",
        transition: "all 0.3s ease",
        overflow: "hidden",
        transform: isHovering ? "translateY(-8px)" : "none",
        boxShadow: isHovering
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        m: 0, // Remove any margin
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Top Bar with Creator and Edit Button */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px", // Slightly reduced padding
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        {/* Creator Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 8,
            padding: "3px 6px", // Slightly reduced padding
            backdropFilter: "blur(4px)",
          }}
        >
          <Avatar
            sx={{
              width: 20, // Smaller avatar
              height: 20, // Smaller avatar
              backgroundColor: "primary.main",
              fontSize: "0.6rem", // Smaller font
              marginRight: 0.5, // Reduced margin
            }}
          >
            {post.name ? post.name.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <Typography variant="caption" sx={{ color: "white", fontWeight: 500 }}>
            {post.name}
          </Typography>
        </Box>
        {/* Edit Button - Only show if user is creator */}
        {isCreator && (
          <IconButton
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              width: 24, // Smaller button
              height: 24, // Smaller button
            }}
            onClick={() => setCurrentId(post._id)}
          >
            <EditIcon sx={{ fontSize: 14 }} /> {/* Smaller icon */}
          </IconButton>
        )}
      </Box>
      {/* Image Section - Fixed height regardless of image presence */}
      <Box
        sx={{
          position: "relative",
          height: "150px", // Reduced height for image
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5", // Light background for empty images
        }}
      >
        <CardMedia
          component="div"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          image={post.selectedFile || defaultImage}
          title={post.title}
        />
        {/* Time Badge - Positioned relative to the image container */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8, // Reduced spacing
            right: 8, // Reduced spacing
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "3px 6px", // Reduced padding
            borderRadius: 8,
            fontSize: "0.65rem", // Smaller font
            backdropFilter: "blur(4px)",
            zIndex: 5,
          }}
        >
          <ScheduleIcon fontSize="small" sx={{ fontSize: "0.7rem" }} /> {/* Smaller icon */}
          <Typography
            variant="caption"
            sx={{ color: "white", fontSize: "0.65rem" }} // Smaller font
          >
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>
      </Box>
      {/* Title Section - Fixed height */}
      <Box
        sx={{
          p: 1.5, // Reduced padding
          pb: 0,
          height: "50px", // Reduced height for title
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "primary.dark",
            lineHeight: 1.2, // Reduced line height
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Show max 2 lines
            WebkitBoxOrient: "vertical",
            fontSize: "1rem", // Reduced font size
          }}
        >
          {post.title || "Untitled Post"}
        </Typography>
      </Box>
      {/* Subtitle/Name Section - Fixed height */}
      <Box
        sx={{
          px: 1.5, // Reduced padding
          height: "25px", // Reduced height for name
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.75rem", // Reduced font size
          }}
        >
          {post.name || "Unknown"}
        </Typography>
      </Box>
      {/* Tags Section - Fixed height */}
      <Box
        sx={{
          px: 1.5, // Reduced padding
          pt: 0.5, // Reduced padding
          height: "30px", // Reduced height for tags
          display: "flex",
          flexWrap: "nowrap", // Don't wrap tags
          gap: 0.5,
          overflowX: "auto", // Allow horizontal scrolling
          overflowY: "hidden",
          "&::-webkit-scrollbar": {
            height: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
        }}
      >
        {tags.length > 0 ? (
          tags
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
                  fontSize: "0.6rem", // Smaller font
                  height: "18px", // Shorter height
                  flexShrink: 0, // Prevent tags from shrinking
                }}
              />
            ))
        ) : (
          <Box sx={{ height: "18px" }} /> // Empty spacer if no tags
        )}
      </Box>
      {/* Message Section - Fixed height with ellipsis */}
      <CardContent
        sx={{
          px: 1.5, // Reduced padding
          py: 1, // Reduced padding
          height: "70px", // Reduced height for message
          overflow: "hidden", // Hide overflow
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3, // Show max 3 lines
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3, // Reduced line height
            fontSize: "0.75rem", // Smaller font
          }}
        >
          {post.message || "No description provided"}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push actions to bottom */}
      <Divider />
      {/* Actions - Fixed height */}
      <CardActions
        sx={{
          p: 1.5, // Reduced padding
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          height: "50px", // Reduced height for actions
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
                p: "3px 6px", // Reduced padding
                minWidth: "50px", // Reduced min width
                fontSize: "0.7rem", // Smaller font
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
                p: "3px 6px", // Reduced padding
                fontSize: "0.7rem", // Smaller font
              }}
              startIcon={<DeleteIcon fontSize="small" sx={{ fontSize: 14 }} />} // Smaller icon
            >
              <Typography variant="caption">Delete</Typography>
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
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
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

//   // Handle liking a post
//   const handleLikeClick = () => {
//     dispatch(likePost(post._id));
//   };

//   // Check if current user has liked this post
//   const userHasLiked =
//     user?.result &&
//     Array.isArray(post.likes) &&
//     post.likes.find((id) => id === (user.result.googleId || user.result._id));

//   // Render the like button text and icon
//   const renderLikes = () => {
//     // Ensure post.likes is an array, default to empty if not
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const likesCount = likesArray.length;

//     if (!user?.result) {
//       // User not logged in
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }

//     // User is logged in
//     if (userHasLiked) {
//       // Current user has liked the post
//       return (
//         <>
//           <ThumbUpAltIcon fontSize="small" />
//           &nbsp;
//           {likesCount > 1
//             ? `You and ${likesCount - 1} ${
//                 likesCount === 2 ? "other" : "others"
//               }`
//             : "You liked this"}
//         </>
//       );
//     } else {
//       // Current user has not liked the post
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }
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

//   // Determine if the user is logged in to enable/disable like button
//   const isLoggedIn = !!user?.result;

//   // Default image to use when no image is provided
//   const defaultImage =
//     "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png";

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         width: "300px", // Fixed exact width for all cards
//         height: "450px", // Fixed exact height for all cards
//         borderRadius: 3,
//         position: "relative",
//         transition: "all 0.3s ease",
//         overflow: "hidden",
//         transform: isHovering ? "translateY(-8px)" : "none",
//         boxShadow: isHovering
//           ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//           : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//         m: 0, // Remove any margin
//       }}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Top Bar with Creator and Edit Button */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 10,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "12px",
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
//         }}
//       >
//         {/* Creator Badge */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: 8,
//             padding: "4px 8px",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 24,
//               height: 24,
//               backgroundColor: "primary.main",
//               fontSize: "0.7rem",
//               marginRight: 1,
//             }}
//           >
//             {post.name ? post.name.charAt(0).toUpperCase() : "?"}
//           </Avatar>
//           <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
//             {post.name}
//           </Typography>
//         </Box>
//         {/* Edit Button - Only show if user is creator */}
//         {isCreator && (
//           <IconButton
//             size="small"
//             sx={{
//               backgroundColor: "rgba(255, 255, 255, 0.8)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 transform: "scale(1.1)",
//               },
//               transition: "all 0.2s ease",
//               boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//             }}
//             onClick={() => setCurrentId(post._id)}
//           >
//             <EditIcon fontSize="small" />
//           </IconButton>
//         )}
//       </Box>
//       {/* Image Section - Fixed height regardless of image presence */}
//       <Box
//         sx={{
//           position: "relative",
//           height: "180px", // Fixed height for image section
//           width: "100%",
//           overflow: "hidden",
//           backgroundColor: "#f5f5f5", // Light background for empty images
//         }}
//       >
//         <CardMedia
//           component="div"
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//           image={post.selectedFile || defaultImage}
//           title={post.title}
//         />
//         {/* Time Badge - Positioned relative to the image container */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 12,
//             right: 12,
//             display: "flex",
//             alignItems: "center",
//             gap: 0.5,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             color: "white",
//             padding: "4px 8px",
//             borderRadius: 8,
//             fontSize: "0.7rem",
//             backdropFilter: "blur(4px)",
//             zIndex: 5,
//           }}
//         >
//           <ScheduleIcon fontSize="small" sx={{ fontSize: "0.9rem" }} />
//           <Typography
//             variant="caption"
//             sx={{ color: "white", fontSize: "0.7rem" }}
//           >
//             {moment(post.createdAt).fromNow()}
//           </Typography>
//         </Box>
//       </Box>
//       {/* Title Section - Fixed height */}
//       <Box
//         sx={{
//           p: 2,
//           pb: 0,
//           height: "60px", // Fixed height for title section
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <Typography
//           variant="h6"
//           component="h2"
//           sx={{
//             fontWeight: 600,
//             color: "primary.dark",
//             lineHeight: 1.3,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 2, // Show max 2 lines
//             WebkitBoxOrient: "vertical",
//           }}
//         >
//           {post.title || "Untitled Post"}
//         </Typography>
//       </Box>
//       {/* Subtitle/Name Section - Fixed height */}
//       <Box
//         sx={{
//           px: 2,
//           height: "30px", // Fixed height for name section
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {post.name || "Unknown"}
//         </Typography>
//       </Box>
//       {/* Tags Section - Fixed height */}
//       <Box
//         sx={{
//           px: 2,
//           pt: 1,
//           height: "36px", // Fixed height for tags
//           display: "flex",
//           flexWrap: "nowrap", // Don't wrap tags
//           gap: 0.5,
//           overflowX: "auto", // Allow horizontal scrolling
//           overflowY: "hidden",
//           "&::-webkit-scrollbar": {
//             height: "2px",
//           },
//           "&::-webkit-scrollbar-track": {
//             background: "#f1f1f1",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             background: "#888",
//             borderRadius: "4px",
//           },
//         }}
//       >
//         {tags.length > 0 ? (
//           tags
//             .filter((tag) => tag && tag.trim() !== "")
//             .map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={`#${tag}`}
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{
//                   borderRadius: "4px",
//                   fontSize: "0.65rem",
//                   height: "20px",
//                   flexShrink: 0, // Prevent tags from shrinking
//                 }}
//               />
//             ))
//         ) : (
//           <Box sx={{ height: "20px" }} /> // Empty spacer if no tags
//         )}
//       </Box>
//       {/* Message Section - Fixed height with ellipsis */}
//       <CardContent
//         sx={{
//           px: 2,
//           py: 1.5,
//           height: "80px", // Fixed height for message section
//           overflow: "hidden", // Hide overflow
//         }}
//       >
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 3, // Show max 3 lines
//             WebkitBoxOrient: "vertical",
//             lineHeight: 1.4,
//           }}
//         >
//           {post.message || "No description provided"}
//         </Typography>
//       </CardContent>
//       <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push actions to bottom */}
//       <Divider />
//       {/* Actions - Fixed height */}
//       <CardActions
//         sx={{
//           p: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           backgroundColor: "rgba(0, 0, 0, 0.02)",
//           height: "60px", // Fixed height for actions section
//         }}
//       >
//         <Tooltip
//           title={
//             isLoggedIn
//               ? userHasLiked
//                 ? "Remove your like"
//                 : "Like this memory"
//               : "Sign in to like"
//           }
//           TransitionComponent={Zoom}
//           arrow
//         >
//           <span>
//             {/* Wrap in span to make tooltip work with disabled button */}
//             <Button
//               size="small"
//               color={userHasLiked ? "secondary" : "primary"}
//               onClick={handleLikeClick}
//               disabled={!isLoggedIn}
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: isLoggedIn
//                     ? userHasLiked
//                       ? "rgba(244, 67, 54, 0.08)"
//                       : "rgba(63, 81, 181, 0.08)"
//                     : "inherit",
//                 },
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.5,
//                 p: "4px 8px",
//                 minWidth: "60px",
//               }}
//             >
//               {renderLikes()}
//             </Button>
//           </span>
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
//                 p: "4px 8px",
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
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
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

//   // Handle liking a post
//   const handleLikeClick = () => {
//     dispatch(likePost(post._id));
//   };

//   // Check if current user has liked this post
//   const userHasLiked =
//     user?.result &&
//     Array.isArray(post.likes) &&
//     post.likes.find((id) => id === (user.result.googleId || user.result._id));

//   // Render the like button text and icon
//   const renderLikes = () => {
//     // Ensure post.likes is an array, default to empty if not
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const likesCount = likesArray.length;

//     if (!user?.result) {
//       // User not logged in
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }

//     // User is logged in
//     if (userHasLiked) {
//       // Current user has liked the post
//       return (
//         <>
//           <ThumbUpAltIcon fontSize="small" />
//           &nbsp;
//           {likesCount > 1
//             ? `You and ${likesCount - 1} ${
//                 likesCount === 2 ? "other" : "others"
//               }`
//             : "You liked this"}
//         </>
//       );
//     } else {
//       // Current user has not liked the post
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }
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

//   // Determine if the user is logged in to enable/disable like button
//   const isLoggedIn = !!user?.result;

//   // Default image to use when no image is provided
//   const defaultImage =
//     "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png";

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         width: "100%", // Fixed width to ensure consistency
//         height: 480, // Fixed height for consistent dimensions across all cards
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
//       {/* Top Bar with Creator and Edit Button */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 10,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "16px",
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
//         }}
//       >
//         {/* Creator Badge */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: 8,
//             padding: "4px 12px",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 28,
//               height: 28,
//               backgroundColor: "primary.main",
//               fontSize: "0.8rem",
//               marginRight: 1,
//             }}
//           >
//             {post.name ? post.name.charAt(0).toUpperCase() : "?"}
//           </Avatar>
//           <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
//             {post.name}
//           </Typography>
//         </Box>
//         {/* Edit Button - Only show if user is creator */}
//         {isCreator && (
//           <IconButton
//             sx={{
//               backgroundColor: "rgba(255, 255, 255, 0.8)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 transform: "scale(1.1)",
//               },
//               transition: "all 0.2s ease",
//               boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//             }}
//             onClick={() => setCurrentId(post._id)}
//           >
//             <EditIcon />
//           </IconButton>
//         )}
//       </Box>

//       {/* Image Section - Fixed height regardless of image presence */}
//       <Box
//         sx={{
//           position: "relative",
//           height: "200px", // Fixed height for image section
//           width: "100%",
//           overflow: "hidden",
//         }}
//       >
//         <CardMedia
//           component="div"
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//           image={post.selectedFile || defaultImage}
//           title={post.title}
//         />
//         {/* Time Badge - Positioned relative to the image container */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             right: 16,
//             display: "flex",
//             alignItems: "center",
//             gap: 0.5,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             color: "white",
//             padding: "4px 10px",
//             borderRadius: 8,
//             fontSize: "0.75rem",
//             backdropFilter: "blur(4px)",
//             zIndex: 5,
//           }}
//         >
//           <ScheduleIcon fontSize="small" />
//           <Typography variant="caption" sx={{ color: "white" }}>
//             {moment(post.createdAt).fromNow()}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Content - Fixed height with ellipsis for text overflow */}
//       <CardContent
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           height: "180px", // Fixed height for consistent dimensions
//           overflow: "hidden", // Hide overflow instead of scroll
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Title - Fixed height with ellipsis */}
//         <Typography
//           variant="h5"
//           component="h2"
//           sx={{
//             mb: 1,
//             fontWeight: 600,
//             color: "primary.dark",
//             lineHeight: 1.3,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 2, // Show max 2 lines
//             WebkitBoxOrient: "vertical",
//             height: "2.6em", // Fixed height for 2 lines
//           }}
//         >
//           {post.title}
//         </Typography>

//         {/* Message - Fixed height with ellipsis */}
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             mb: 2,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 3, // Show max 3 lines
//             WebkitBoxOrient: "vertical",
//             lineHeight: 1.5,
//             height: "4.5em", // Fixed height for 3 lines
//             flexShrink: 0,
//           }}
//         >
//           {post.message}
//         </Typography>

//         {/* Tags - Fixed height container with horizontal scrolling if needed */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "nowrap", // Don't wrap tags
//             gap: 0.8,
//             mt: "auto", // Push to bottom of content area
//             overflowX: "auto", // Allow horizontal scrolling
//             overflowY: "hidden",
//             height: "28px", // Fixed height for tags area
//             pb: 1,
//             "&::-webkit-scrollbar": {
//               height: "4px",
//             },
//             "&::-webkit-scrollbar-track": {
//               background: "#f1f1f1",
//             },
//             "&::-webkit-scrollbar-thumb": {
//               background: "#888",
//               borderRadius: "4px",
//             },
//           }}
//         >
//           {tags
//             .filter((tag) => tag && tag.trim() !== "")
//             .map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={`#${tag}`}
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{
//                   borderRadius: "4px",
//                   fontSize: "0.7rem",
//                   height: "22px",
//                   flexShrink: 0, // Prevent tags from shrinking
//                 }}
//               />
//             ))}
//         </Box>
//       </CardContent>

//       <Divider />

//       {/* Actions - Fixed height */}
//       <CardActions
//         sx={{
//           padding: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           backgroundColor: "rgba(0, 0, 0, 0.02)",
//           height: "64px", // Fixed height for actions section
//         }}
//       >
//         <Tooltip
//           title={
//             isLoggedIn
//               ? userHasLiked
//                 ? "Remove your like"
//                 : "Like this memory"
//               : "Sign in to like"
//           }
//           TransitionComponent={Zoom}
//           arrow
//         >
//           <span>
//             {/* Wrap in span to make tooltip work with disabled button */}
//             <Button
//               size="small"
//               color={userHasLiked ? "secondary" : "primary"}
//               onClick={handleLikeClick}
//               disabled={!isLoggedIn}
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: isLoggedIn
//                     ? userHasLiked
//                       ? "rgba(244, 67, 54, 0.08)"
//                       : "rgba(63, 81, 181, 0.08)"
//                     : "inherit",
//                 },
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.5,
//               }}
//             >
//               {renderLikes()}
//             </Button>
//           </span>
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
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
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

//   // Handle liking a post
//   const handleLikeClick = () => {
//     dispatch(likePost(post._id));
//   };

//   // Check if current user has liked this post
//   const userHasLiked =
//     user?.result &&
//     Array.isArray(post.likes) &&
//     post.likes.find((id) => id === (user.result.googleId || user.result._id));

//   // Render the like button text and icon
//   const renderLikes = () => {
//     // Ensure post.likes is an array, default to empty if not
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const likesCount = likesArray.length;

//     if (!user?.result) {
//       // User not logged in
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }

//     // User is logged in
//     if (userHasLiked) {
//       // Current user has liked the post
//       return (
//         <>
//           <ThumbUpAltIcon fontSize="small" />
//           &nbsp;
//           {likesCount > 1
//             ? `You and ${likesCount - 1} ${
//                 likesCount === 2 ? "other" : "others"
//               }`
//             : "You liked this"}
//         </>
//       );
//     } else {
//       // Current user has not liked the post
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }
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

//   // Determine if the user is logged in to enable/disable like button
//   const isLoggedIn = !!user?.result;

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%", // Fixed height for consistent dimensions
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
//       {/* Top Bar with Creator and Edit Button */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 10,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "16px",
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
//         }}
//       >
//         {/* Creator Badge */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: 8,
//             padding: "4px 12px",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 28,
//               height: 28,
//               backgroundColor: "primary.main",
//               fontSize: "0.8rem",
//               marginRight: 1,
//             }}
//           >
//             {post.name ? post.name.charAt(0).toUpperCase() : "?"}
//           </Avatar>
//           <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
//             {post.name}
//           </Typography>
//         </Box>

//         {/* Edit Button - Only show if user is creator */}
//         {isCreator && (
//           <IconButton
//             sx={{
//               backgroundColor: "rgba(255, 255, 255, 0.8)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 transform: "scale(1.1)",
//               },
//               transition: "all 0.2s ease",
//               boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//             }}
//             onClick={() => setCurrentId(post._id)}
//           >
//             <EditIcon />
//           </IconButton>
//         )}
//       </Box>

//       {/* Image - Fixed aspect ratio to maintain consistent dimensions */}
//       <Box
//         sx={{
//           position: "relative",
//           paddingTop: "56.25%" /* 16:9 aspect ratio */,
//         }}
//       >
//         <CardMedia
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//           image={
//             post.selectedFile ||
//             "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
//           }
//           title={post.title}
//         />

//         {/* Time Badge - Positioned relative to the image container */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             right: 16,
//             display: "flex",
//             alignItems: "center",
//             gap: 0.5,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             color: "white",
//             padding: "4px 10px",
//             borderRadius: 8,
//             fontSize: "0.75rem",
//             backdropFilter: "blur(4px)",
//             zIndex: 5,
//           }}
//         >
//           <ScheduleIcon fontSize="small" />
//           <Typography variant="caption" sx={{ color: "white" }}>
//             {moment(post.createdAt).fromNow()}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Content - Fixed height with overflow for consistent dimensions */}
//       <CardContent
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           height: { xs: "150px", sm: "180px" }, // Fixed height based on screen size
//           overflow: "auto", // Allow scrolling for content that exceeds the height
//           "&::-webkit-scrollbar": {
//             width: "4px",
//           },
//           "&::-webkit-scrollbar-track": {
//             background: "#f1f1f1",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             background: "#888",
//             borderRadius: "4px",
//           },
//         }}
//       >
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

//         {/* Tags - Contained within a scrollable container if needed */}
//         {tags.length > 0 && (
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 0.8,
//               mt: 2,
//               maxHeight: "50px",
//               overflow: "auto",
//               "&::-webkit-scrollbar": {
//                 height: "4px",
//               },
//               "&::-webkit-scrollbar-track": {
//                 background: "#f1f1f1",
//               },
//               "&::-webkit-scrollbar-thumb": {
//                 background: "#888",
//                 borderRadius: "4px",
//               },
//             }}
//           >
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
//                 ? "Remove your like"
//                 : "Like this memory"
//               : "Sign in to like"
//           }
//           TransitionComponent={Zoom}
//           arrow
//         >
//           <span>
//             {" "}
//             {/* Wrap in span to make tooltip work with disabled button */}
//             <Button
//               size="small"
//               color={userHasLiked ? "secondary" : "primary"}
//               onClick={handleLikeClick}
//               disabled={!isLoggedIn}
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: isLoggedIn
//                     ? userHasLiked
//                       ? "rgba(244, 67, 54, 0.08)"
//                       : "rgba(63, 81, 181, 0.08)"
//                     : "inherit",
//                 },
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.5,
//               }}
//             >
//               {renderLikes()}
//             </Button>
//           </span>
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
// import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
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

//   // Handle liking a post
//   const handleLikeClick = () => {
//     dispatch(likePost(post._id));
//   };

//   // Check if current user has liked this post
//   const userHasLiked =
//     user?.result &&
//     Array.isArray(post.likes) &&
//     post.likes.find((id) => id === (user.result.googleId || user.result._id));

//   // Render the like button text and icon
//   const renderLikes = () => {
//     // Ensure post.likes is an array, default to empty if not
//     const likesArray = Array.isArray(post.likes) ? post.likes : [];
//     const likesCount = likesArray.length;

//     if (!user?.result) {
//       // User not logged in
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }

//     // User is logged in
//     if (userHasLiked) {
//       // Current user has liked the post
//       return (
//         <>
//           <ThumbUpAltIcon fontSize="small" />
//           &nbsp;
//           {likesCount > 1
//             ? `You and ${likesCount - 1} ${
//                 likesCount === 2 ? "other" : "others"
//               }`
//             : "You liked this"}
//         </>
//       );
//     } else {
//       // Current user has not liked the post
//       return (
//         <>
//           <ThumbUpAltOutlined fontSize="small" />
//           &nbsp;
//           {likesCount > 0
//             ? `${likesCount} ${likesCount === 1 ? "Like" : "Likes"}`
//             : "Like"}
//         </>
//       );
//     }
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

//   // Determine if the user is logged in to enable/disable like button
//   const isLoggedIn = !!user?.result;

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
//                 ? "Remove your like"
//                 : "Like this memory"
//               : "Sign in to like"
//           }
//           TransitionComponent={Zoom}
//           arrow
//         >
//           <span>
//             {" "}
//             {/* Wrap in span to make tooltip work with disabled button */}
//             <Button
//               size="small"
//               color={userHasLiked ? "secondary" : "primary"}
//               onClick={handleLikeClick}
//               disabled={!isLoggedIn}
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: isLoggedIn
//                     ? userHasLiked
//                       ? "rgba(244, 67, 54, 0.08)"
//                       : "rgba(63, 81, 181, 0.08)"
//                     : "inherit",
//                 },
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.5,
//               }}
//             >
//               {renderLikes()}
//             </Button>
//           </span>
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
