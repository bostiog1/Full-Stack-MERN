import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
  InputAdornment,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonIcon from "@mui/icons-material/Person";
import TitleIcon from "@mui/icons-material/Title";
import MessageIcon from "@mui/icons-material/Message";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const dispatch = useDispatch();
  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );

  useEffect(() => {
    if (post) {
      setPostData(post);
      setTagsArray(Array.isArray(post.tags) ? post.tags : []);
      setPreviewUrl(post.selectedFile || "");
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPostData = {
      ...postData,
      tags: tagsArray,
    };

    if (currentId) {
      dispatch(updatePost(currentId, finalPostData));
    } else {
      dispatch(createPost(finalPostData));
    }
    clear();
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({
      creator: "",
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
    setTagsArray([]);
    setPreviewUrl("");
    setTagInput("");
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Avoid duplicates
      if (!tagsArray.includes(tagInput.trim())) {
        setTagsArray([...tagsArray, tagInput.trim()]);
      }
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
        setPostData({ ...postData, selectedFile: reader.result });
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "visible",
        background: "white",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: currentId ? "secondary.main" : "primary.main",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {currentId ? "Edit" : "Create"} Memory
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Creator Field */}
            <TextField
              name="creator"
              variant="outlined"
              label="Creator"
              fullWidth
              value={postData.creator}
              onChange={(e) =>
                setPostData({ ...postData, creator: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Title Field */}
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

            {/* Message Field */}
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

            {/* Tags Field */}
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

            {/* File Upload */}
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

            {/* Action Buttons */}
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
                {currentId ? "Update" : "Create"}
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
      </CardContent>
    </Card>
  );
};

export default Form;
// import {
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Box,
//   IconButton,
//   Chip,
//   Stack,
//   Avatar,
//   InputAdornment,
//   Card,
//   CardContent,
//   Divider,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createPost, updatePost } from "../../actions/posts";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import PersonIcon from "@mui/icons-material/Person";
// import TitleIcon from "@mui/icons-material/Title";
// import MessageIcon from "@mui/icons-material/Message";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";

// const Form = ({ currentId, setCurrentId }) => {
//   const [postData, setPostData] = useState({
//     creator: "",
//     title: "",
//     message: "",
//     tags: "",
//     selectedFile: "",
//   });
//   const [tagInput, setTagInput] = useState("");
//   const [tagsArray, setTagsArray] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState("");

//   const dispatch = useDispatch();
//   const post = useSelector((state) =>
//     currentId ? state.posts.find((p) => p._id === currentId) : null
//   );

//   useEffect(() => {
//     if (post) {
//       setPostData(post);
//       setTagsArray(Array.isArray(post.tags) ? post.tags : []);
//       setPreviewUrl(post.selectedFile || "");
//     }
//   }, [post]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalPostData = {
//       ...postData,
//       tags: tagsArray,
//     };

//     if (currentId) {
//       dispatch(updatePost(currentId, finalPostData));
//     } else {
//       dispatch(createPost(finalPostData));
//     }
//     clear();
//   };

//   const clear = () => {
//     setCurrentId(null);
//     setPostData({
//       creator: "",
//       title: "",
//       message: "",
//       tags: "",
//       selectedFile: "",
//     });
//     setTagsArray([]);
//     setPreviewUrl("");
//     setTagInput("");
//   };

//   const handleAddTag = () => {
//     if (tagInput.trim()) {
//       // Avoid duplicates
//       if (!tagsArray.includes(tagInput.trim())) {
//         setTagsArray([...tagsArray, tagInput.trim()]);
//       }
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTagsArray(tagsArray.filter((tag) => tag !== tagToRemove));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPostData({ ...postData, selectedFile: reader.result });
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: 2,
//         overflow: "visible",
//         background: "white",
//         position: "sticky",
//         top: "20px",
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Typography
//           variant="h5"
//           sx={{
//             mb: 3,
//             color: currentId ? "secondary.main" : "primary.main",
//             fontWeight: "bold",
//             textAlign: "center",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 1,
//           }}
//         >
//           {currentId ? "Edit" : "Create"} Memory
//         </Typography>

//         <Divider sx={{ mb: 3 }} />

//         <form autoComplete="off" noValidate onSubmit={handleSubmit}>
//           <Stack spacing={3}>
//             {/* Creator Field */}
//             <TextField
//               name="creator"
//               variant="outlined"
//               label="Creator"
//               fullWidth
//               value={postData.creator}
//               onChange={(e) =>
//                 setPostData({ ...postData, creator: e.target.value })
//               }
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Title Field */}
//             <TextField
//               name="title"
//               variant="outlined"
//               label="Title"
//               fullWidth
//               value={postData.title}
//               onChange={(e) =>
//                 setPostData({ ...postData, title: e.target.value })
//               }
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <TitleIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Message Field */}
//             <TextField
//               name="message"
//               variant="outlined"
//               label="Message"
//               multiline
//               rows={4}
//               fullWidth
//               value={postData.message}
//               onChange={(e) =>
//                 setPostData({ ...postData, message: e.target.value })
//               }
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <MessageIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Tags Field */}
//             <Box>
//               <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
//                 <TextField
//                   name="tagInput"
//                   variant="outlined"
//                   label="Add Tag"
//                   fullWidth
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LocalOfferIcon color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleAddTag}
//                   sx={{ minWidth: "50px" }}
//                 >
//                   <AddIcon />
//                 </Button>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: 1,
//                   minHeight: "40px",
//                   p: 1,
//                   border: "1px solid #e0e0e0",
//                   borderRadius: 1,
//                   backgroundColor: "#f9f9f9",
//                 }}
//               >
//                 {tagsArray.length > 0 ? (
//                   tagsArray.map((tag, index) => (
//                     <Chip
//                       key={index}
//                       label={tag}
//                       onDelete={() => handleRemoveTag(tag)}
//                       color="primary"
//                       variant="outlined"
//                       size="small"
//                     />
//                   ))
//                 ) : (
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ p: 1 }}
//                   >
//                     No tags added yet
//                   </Typography>
//                 )}
//               </Box>
//             </Box>

//             {/* File Upload */}
//             <Box>
//               <Button
//                 variant="outlined"
//                 component="label"
//                 fullWidth
//                 startIcon={<FileUploadIcon />}
//                 sx={{ p: 1.5, position: "relative", overflow: "hidden" }}
//               >
//                 {previewUrl ? "Change Image" : "Upload Image"}
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//               </Button>

//               {previewUrl && (
//                 <Box
//                   sx={{
//                     mt: 2,
//                     position: "relative",
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     height: "140px",
//                     boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <IconButton
//                     size="small"
//                     sx={{
//                       position: "absolute",
//                       top: 5,
//                       right: 5,
//                       backgroundColor: "rgba(255,255,255,0.8)",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
//                     }}
//                     onClick={() => {
//                       setPostData({ ...postData, selectedFile: "" });
//                       setPreviewUrl("");
//                     }}
//                   >
//                     <CloseIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>

//             {/* Action Buttons */}
//             <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 type="submit"
//                 fullWidth
//                 startIcon={<SaveIcon />}
//                 sx={{ py: 1.5 }}
//               >
//                 {currentId ? "Update" : "Create"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 size="large"
//                 onClick={clear}
//                 fullWidth
//                 startIcon={<CloseIcon />}
//                 sx={{ py: 1.5 }}
//               >
//                 Clear
//               </Button>
//             </Box>
//           </Stack>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default Form;
