// import {
//   Box,
//   Paper,
//   AppBar,
//   TextField,
//   Button,
//   Chip,
//   Stack,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ChatIcon from "@mui/icons-material/Chat";
// import CommentIcon from "@mui/icons-material/Comment";
// import InputAdornment from "@mui/material/InputAdornment";
// import Posts from "../Posts/Posts";
// import Form from "../Form/Form";
// import { useDispatch, useSelector } from "react-redux";
// import { getPosts, getPostsBySearch } from "../../actions/posts";
// import Pagination from "../Pagination";
// import { useLocation, useNavigate } from "react-router-dom";

// import homeStyles from "./styles";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// const Home = () => {
//   const query = useQuery();
//   const page = query.get("page") || 1;
//   const searchQuery = query.get("searchQuery");
//   const { numberOfPages } = useSelector((state) => state.posts);

//   const [currentId, setCurrentId] = useState(0);
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");
//   const [tags, setTags] = useState([]);
//   const [newTagInput, setNewTagInput] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!searchQuery && !tags.length) {
//       dispatch(getPosts(page));
//     }
//   }, [page, dispatch, searchQuery, tags.length]);

//   const searchPost = () => {
//     if (search.trim() || tags.length > 0) {
//       dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
//       navigate(
//         `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
//       );
//     } else {
//       navigate("/posts");
//     }
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === "Enter") {
//       searchPost();
//     }
//   };

//   const handleTagInputKeyPress = (e) => {
//     if (e.key === "Enter" && newTagInput.trim() !== "") {
//       const trimmedTag = newTagInput.trim();
//       if (!tags.includes(trimmedTag)) {
//         // Prevent duplicate tags
//         setTags([...tags, trimmedTag]);
//       }
//       setNewTagInput("");
//       e.preventDefault();
//     }
//   };

//   const handleDeleteChip = (chipToDelete) =>
//     setTags(tags.filter((tag) => tag !== chipToDelete));

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column-reverse", md: "row" },
//           gap: 3,
//           flex: 1,
//           minHeight: "100vh",
//         }}
//       >
//         {/* Posts Section - Left Side */}
//         <Box
//           sx={{
//             flex: 3,
//             minWidth: 0, // Prevents flex items from overflowing
//           }}
//         >
//           <Posts setCurrentId={setCurrentId} />
//         </Box>
//         <Box
//           sx={{
//             flex: 1,
//             maxWidth: { xs: "100%", md: "400px" },
//             minWidth: { xs: "100%", md: "320px" },
//             position: { xs: "static", md: "sticky" },
//             top: 20,
//             height: { xs: "auto", md: "fit-content" },
//             maxHeight: { xs: "none", md: "calc(100vh - 40px)" },
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             mb: { xs: 4, md: 0 },
//           }}
//         >
//           {/* Search Bar */}
//           <AppBar
//             sx={{
//               ...homeStyles.appBarSearch,
//               borderRadius: 2,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             }}
//             position="static"
//             color="inherit"
//           >
//             <Box sx={{ p: 2 }}>
//               {/* Main Search TextField */}
//               <TextField
//                 onKeyDown={handleSearchKeyPress}
//                 name="search"
//                 variant="outlined"
//                 label="Search Memories"
//                 fullWidth
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 sx={{
//                   mb: 2,
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               {/* Tag Input TextField */}
//               <TextField
//                 onKeyDown={handleTagInputKeyPress}
//                 name="tagsInput"
//                 variant="outlined"
//                 label="Add Tags (Press Enter)"
//                 fullWidth
//                 value={newTagInput}
//                 onChange={(e) => setNewTagInput(e.target.value)}
//                 sx={{
//                   mb: tags.length > 0 ? 2 : 0,
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LocalOfferIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               {/* Display Tags as Chips */}
//               {tags.length > 0 && (
//                 <Box sx={{ mb: 2 }}>
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{
//                       flexWrap: "wrap",
//                       gap: 1,
//                     }}
//                   >
//                     {tags.map((tag) => (
//                       <Chip
//                         key={tag}
//                         label={tag}
//                         onDelete={() => handleDeleteChip(tag)}
//                         color="primary"
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                           borderRadius: 2,
//                           "& .MuiChip-deleteIcon": {
//                             fontSize: "16px",
//                           },
//                         }}
//                       />
//                     ))}
//                   </Stack>
//                 </Box>
//               )}

//               <Button
//                 onClick={searchPost}
//                 sx={{
//                   ...homeStyles.searchButton,
//                   borderRadius: 2,
//                   textTransform: "none",
//                   fontWeight: 600,
//                   py: 1.5,
//                 }}
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 startIcon={<SearchIcon />}
//               >
//                 Search Memories
//               </Button>
//             </Box>
//           </AppBar>

//           {/* Form - Fixed height */}
//           <Box
//             sx={{
//               flexShrink: 0, // Don't shrink
//               minHeight: "auto", // Let it size naturally
//             }}
//           >
//             <Form currentId={currentId} setCurrentId={setCurrentId} />
//           </Box>

//           {/* Pagination - Always at bottom when visible */}
//           {!searchQuery && !tags.length && numberOfPages > 1 && (
//             <Box sx={{ mt: 2 }}>
//               {" "}
//               {/* Simple margin top instead of mt: auto */}
//               <Paper
//                 sx={{
//                   ...homeStyles.pagination,
//                   borderRadius: 2,
//                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                   p: 2,
//                 }}
//                 elevation={2}
//               >
//                 <Pagination page={page} />
//               </Paper>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Home;

// import { Box, Paper, AppBar, TextField, Button } from "@mui/material";
// import { useEffect, useState } from "react";
// import Posts from "../Posts/Posts";
// import Form from "../Form/Form";
// import { useDispatch } from "react-redux";
// import { getPosts, getPostsBySearch } from "../../actions/posts";
// import Pagination from "../Pagination";
// import { useLocation, useNavigate } from "react-router-dom";
// import homeStyles from "./styles";

// // If you are using 'material-ui-chip-input', uncomment the line below
// // import ChipInput from 'material-ui-chip-input';

// // Custom hook to parse URL query parameters
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// const Home = () => {
//   const query = useQuery();
//   const page = query.get("page") || 1;
//   const searchQuery = query.get("searchQuery");

//   const [currentId, setCurrentId] = useState(0);
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");
//   const [tags, setTags] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!searchQuery && !tags.length) {
//       dispatch(getPosts(page));
//     }
//   }, [page, dispatch, searchQuery, tags.length]);

//   const searchPost = () => {
//     if (search.trim() || tags.length > 0) {
//       dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
//       navigate(
//         `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
//       );
//     } else {
//       navigate("/posts");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       searchPost();
//     }
//   };

//   const handleAddChip = (tag) => setTags([...tags, tag]);

//   const handleDeleteChip = (chipToDelete) =>
//     setTags(tags.filter((tag) => tag !== chipToDelete));

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column-reverse", md: "row" },
//           gap: 4,
//           flex: 1,
//         }}
//       >
//         {/* Posts Section */}
//         <Box sx={{ flex: 3 }}>
//           <Posts setCurrentId={setCurrentId} />
//         </Box>

//         {/* Search and Form Section */}
//         <Box
//           sx={{
//             flex: 1,
//             position: { xs: "static", md: "sticky" },
//             top: 20,
//             mb: { xs: 4, md: 0 },
//           }}
//         >
//           <AppBar
//             sx={homeStyles.appBarSearch}
//             position="static"
//             color="inherit"
//           >
//             <TextField
//               onKeyDown={handleKeyPress}
//               name="search"
//               variant="outlined"
//               label="Search Memories"
//               fullWidth
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {/*
//               If you have 'material-ui-chip-input' installed, use this:
//               <ChipInput
//                 style={{ margin: "10px 0" }}
//                 value={tags}
//                 onAdd={(chip) => handleAddChip(chip)}
//                 onDelete={(chip) => handleDeleteChip(chip)}
//                 label="Search Tags"
//                 variant="outlined"
//               />
//               Otherwise, this is a basic TextField placeholder:
//             */}
//             <TextField
//               label="Search Tags (comma-separated)"
//               variant="outlined"
//               value={tags.join(", ")}
//               onChange={(e) =>
//                 setTags(e.target.value.split(",").map((tag) => tag.trim()))
//               }
//               style={{ margin: "10px 0" }}
//               fullWidth
//             />

//             <Button
//               onClick={searchPost}
//               sx={homeStyles.searchButton}
//               variant="contained"
//               color="primary"
//             >
//               Search
//             </Button>
//           </AppBar>

//           <Form currentId={currentId} setCurrentId={setCurrentId} />

//           {/* Pagination Section */}
//           {/* Only show pagination if not in a search query result */}
//           {!searchQuery && !tags.length && (
//             <Paper sx={homeStyles.pagination} elevation={6}>
//               <Pagination page={page} /> {/* Pass the current page */}
//             </Paper>
//           )}
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Home;

// import {
//   Box,
//   Paper,
//   AppBar,
//   TextField,
//   Button,
//   Chip,
//   InputAdornment,
//   Stack,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import Posts from "../Posts/Posts";
// import Form from "../Form/Form";
// import { useDispatch } from "react-redux";
// import { getPosts, getPostsBySearch } from "../../actions/posts";
// import Pagination from "../Pagination";
// import { useLocation, useNavigate } from "react-router-dom";
// import homeStyles from "./styles"; // Assuming homeStyles are imported correctly
// import SearchIcon from "@mui/icons-material/Search"; // Added SearchIcon
// import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // Added LocalOfferIcon

// // Custom hook to parse URL query parameters
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// const Home = () => {
//   const query = useQuery();
//   const page = query.get("page") || 1;
//   const searchQuery = query.get("searchQuery");

//   const [currentId, setCurrentId] = useState(0);
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");
//   const [tags, setTags] = useState([]);
//   const [newTagInput, setNewTagInput] = useState(""); // UNCOMMENTED
//   const navigate = useNavigate();

//   useEffect(() => {
//     // This useEffect is good for initial load or when search/tags are cleared
//     if (!searchQuery && !tags.length) {
//       dispatch(getPosts(page));
//     }
//   }, [page, dispatch, searchQuery, tags.length]);

//   const searchPost = () => {
//     if (search.trim() || tags.length > 0) {
//       dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
//       navigate(
//         `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
//       );
//     } else {
//       navigate("/posts");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       searchPost();
//     }
//   };

//   // UNCOMMENTED: Handler for 'Enter' key press on the new tag input
//   const handleTagInputKeyPress = (e) => {
//     if (e.key === "Enter" && newTagInput.trim() !== "") {
//       e.preventDefault(); // Prevent default form submission
//       const trimmedTag = newTagInput.trim().toLowerCase(); // Convert to lowercase
//       if (!tags.includes(trimmedTag)) {
//         // Prevent duplicate tags
//         setTags([...tags, trimmedTag]);
//       }
//       setNewTagInput(""); // Clear the input field
//     }
//   };

//   // UNCOMMENTED: Handler to delete a chip (tag)
//   const handleDeleteChip = (chipToDelete) =>
//     setTags(tags.filter((tag) => tag !== chipToDelete));

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column-reverse", md: "row" },
//           gap: 4,
//           flex: 1,
//         }}
//       >
//         {/* Posts Section */}
//         <Box sx={{ flex: 3 }}>
//           <Posts setCurrentId={setCurrentId} />
//         </Box>

//         {/* Search and Form Section */}
//         <Box
//           sx={{
//             flex: 1,
//             maxWidth: { xs: "100%", md: "400px" }, // Added max width for better layout on medium screens
//             minWidth: { xs: "100%", md: "320px" }, // Added min width
//             position: { xs: "static", md: "sticky" },
//             top: 20,
//             height: { xs: "auto", md: "fit-content" }, // Adjust height
//             maxHeight: { xs: "none", md: "calc(100vh - 40px)" }, // Max height for sticky
//             mb: { xs: 4, md: 0 },
//             display: "flex", // Added flex for internal layout
//             flexDirection: "column", // Added flex for internal layout
//             gap: 2, // Added gap for internal layout
//           }}
//         >
//           <AppBar
//             sx={{
//               ...homeStyles.appBarSearch, // Merging existing styles
//               borderRadius: 2,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // Added some shadow for visual separation
//               p: 2, // Added padding here for internal elements
//             }}
//             position="static"
//             color="inherit"
//           >
//             {/* Main Search TextField */}
//             <TextField
//               onKeyDown={handleKeyPress}
//               name="search"
//               variant="outlined"
//               label="Search Memories"
//               fullWidth
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{
//                 mb: 2, // Margin bottom for separation from tags
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                 },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* NEW TAG INPUT SECTION (based on your commented code) */}
//             <Box sx={{ mb: 2 }}>
//               {" "}
//               {/* Container for tag input and chips */}
//               {/* Tag Input TextField */}
//               <TextField
//                 onKeyDown={handleTagInputKeyPress} // Use the new key press handler
//                 name="tagsInput"
//                 variant="outlined"
//                 label="Add Tags (Press Enter)"
//                 fullWidth
//                 value={newTagInput} // Use the newTagInput state
//                 onChange={(e) => setNewTagInput(e.target.value)} // Update newTagInput state
//                 sx={{
//                   mb: tags.length > 0 ? 1 : 0, // Add margin if tags are present
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LocalOfferIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               {/* Display Tags as Chips */}
//               {tags.length > 0 && (
//                 <Box sx={{ mt: 1 }}>
//                   {" "}
//                   {/* Margin top for chips */}
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{
//                       flexWrap: "wrap",
//                       gap: 1,
//                     }}
//                   >
//                     {tags.map((tag) => (
//                       <Chip
//                         key={tag} // Using tag as key (assuming unique tags)
//                         label={tag}
//                         onDelete={() => handleDeleteChip(tag)} // Use the new delete handler
//                         color="primary"
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                           borderRadius: 2,
//                           "& .MuiChip-deleteIcon": {
//                             fontSize: "16px",
//                           },
//                         }}
//                       />
//                     ))}
//                   </Stack>
//                 </Box>
//               )}
//             </Box>
//             {/* END OF NEW TAG INPUT SECTION */}

//             <Button
//               onClick={searchPost}
//               sx={homeStyles.searchButton} // Make sure homeStyles.searchButton exists
//               variant="contained"
//               color="primary"
//               fullWidth // Added fullWidth for consistency
//             >
//               Search
//             </Button>
//           </AppBar>

//           <Form currentId={currentId} setCurrentId={setCurrentId} />

//           {/* Pagination Section */}
//           {/* Only show pagination if not in a search query result */}
//           {!searchQuery && !tags.length && (
//             <Paper sx={homeStyles.pagination} elevation={6}>
//               {" "}
//               {/* Make sure homeStyles.pagination exists */}
//               <Pagination page={page} /> {/* Pass the current page */}
//             </Paper>
//           )}
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Home;

import {
  Box,
  Paper,
  AppBar,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react"; // Added useRef, useCallback
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import Pagination from "../Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import homeStyles from "./styles";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = parseInt(query.get("page") || "1", 10);
  const searchQueryParam = query.get("searchQuery");

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const navigate = useNavigate();

  // Debounce ref and function (common pattern)
  const debounceTimeout = useRef(null);
  const { numberOfPages } = useSelector((state) => state.posts);

  // Use useCallback to memoize searchPost so it doesn't trigger useEffect unnecessarily
  const searchPost = useCallback(() => {
    // Only search if there's a search term or tags
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      // Update URL to reflect current search terms
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      // If search and tags are cleared, navigate back to main posts
      navigate(`/posts?page=${page}`); // Ensure we keep the current page
      // Optionally, refetch all posts for the current page when cleared
      dispatch(getPosts(page));
    }
  }, [search, tags, dispatch, navigate, page]); // Dependencies for useCallback

  // New: Function to refresh posts for the current page
  // This will be passed down to Post.jsx
  const refreshPosts = useCallback(() => {
    // Check if the current page would be empty after deletion
    // Assuming you have total posts/page limit in your backend/state
    // If not, simply refetch `getPosts(page)` and let backend handle it

    // A simple check: if the current page is greater than the total number of pages,
    // navigate to the last valid page. This handles if a page becomes empty.
    const newPage =
      page > numberOfPages && numberOfPages > 0 ? numberOfPages : page;

    if (!search.trim() && tags.length === 0) {
      // If not currently in a search, fetch all posts for the adjusted page
      dispatch(getPosts(newPage));
      if (newPage !== page) {
        navigate(`/posts?page=${newPage}`); // Update URL if page changed
      }
    } else {
      // If in a search, re-run the search query
      searchPost(); // `searchPost` uses current `search` and `tags` state
    }
  }, [page, numberOfPages, search, tags, dispatch, navigate, searchPost]);

  useEffect(() => {
    // Initial fetch of posts or when page/searchQueryParam/tags change (if they were external)
    // This useEffect is now mainly for initial load or handling direct URL changes
    if (searchQueryParam || tags.length) {
      // If there's a search in URL, trigger it
      // This block might need adjustment based on how initial search from URL is handled
      // For simplicity, let's keep it focused on the new real-time search
    } else {
      dispatch(getPosts(page)); // Default fetch if no search params
    }
  }, [page, dispatch, searchQueryParam, tags.length]);

  // Effect to trigger search when `search` or `tags` states change (after debounce for `search`)
  useEffect(() => {
    // Clear any previous debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new debounce timeout for the main 'search' input
    // The `searchPost` function (memoized with useCallback) will be called after delay
    debounceTimeout.current = setTimeout(() => {
      // Only call searchPost if there's actual search text or tags
      const hasActualSearch = search.trim() !== "" || tags.length > 0;
      const isSearchRoute = window.location.pathname.includes("/posts/search");

      // If we are on a search route or have actual search terms, trigger search
      if (hasActualSearch || isSearchRoute) {
        searchPost();
      } else {
        // If no search terms and not on search route, fetch general posts for the page
        dispatch(getPosts(page));
      }
    }, 500);

    // Cleanup: clear timeout if component unmounts or dependencies change before timeout
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, tags, searchPost, page, dispatch]); // `searchPost` is a dependency because it's memoized

  // Handle main search input change (no longer directly calls searchPost)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handler for 'Enter' key press on the new tag input
  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      e.preventDefault();
      const trimmedTag = newTagInput.trim().toLowerCase();
      if (!tags.includes(trimmedTag)) {
        setTags((prevTags) => [...prevTags, trimmedTag]); // Use functional update
      }
      setNewTagInput("");
    }
  };

  // Handler to delete a chip (tag)
  const handleDeleteChip = (chipToDelete) =>
    setTags((prevTags) => prevTags.filter((tag) => tag !== chipToDelete)); // Use functional update

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: 4,
          flex: 1,
        }}
      >
        {/* Posts Section */}
        <Box sx={{ flex: 3 }}>
          <Posts setCurrentId={setCurrentId} refreshPosts={refreshPosts} />
        </Box>

        {/* Search and Form Section */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "400px" },
            minWidth: { xs: "100%", md: "320px" },
            position: { xs: "static", md: "sticky" },
            top: 20,
            height: { xs: "auto", md: "fit-content" },
            maxHeight: { xs: "none", md: "calc(100vh - 40px)" },
            mb: { xs: 4, md: 0 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <AppBar
            sx={{
              ...homeStyles.appBarSearch,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              p: 2,
            }}
            position="static"
            color="inherit"
          >
            {/* Main Search TextField */}
            <TextField
              name="search"
              variant="outlined"
              label="Search Memories"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)} // Use the debounced handler
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* TAG INPUT SECTION */}
            <Box sx={{ mb: 2 }}>
              <TextField
                onKeyDown={handleTagInputKeyPress}
                name="tagsInput"
                variant="outlined"
                label="Add Tags (Press Enter)"
                fullWidth
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                sx={{
                  mb: tags.length > 0 ? 1 : 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {tags.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteChip(tag)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          "& .MuiChip-deleteIcon": {
                            fontSize: "16px",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* The explicit "Search" button is now optional if you prefer
                a purely reactive search, but can be kept as a fallback */}
            <Button
              onClick={searchPost} // Keep this for explicit search button click
              sx={homeStyles.searchButton}
              variant="contained"
              color="primary"
              fullWidth
            >
              Search
            </Button>
          </AppBar>

          <Form currentId={currentId} setCurrentId={setCurrentId} />

          {/* Pagination Section */}
          {/* Make sure this condition correctly identifies when to show pagination for general posts */}
          {!searchQueryParam ||
          (searchQueryParam === "none" && tags.length === 0) ? ( // Adjusted condition
            <Paper sx={homeStyles.pagination} elevation={6}>
              <Pagination page={page} />
            </Paper>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default Home;
