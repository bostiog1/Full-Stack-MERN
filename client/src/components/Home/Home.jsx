import {
  Box,
  Paper,
  AppBar,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material"; // Add Chip and Stack
import React, { useEffect, useState } from "react";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import Pagination from "../Pagination";
import { useLocation, useNavigate } from "react-router-dom";

import homeStyles from "./styles";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const { numberOfPages } = useSelector((state) => state.posts);

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery && !tags.length) {
      dispatch(getPosts(page));
    }
  }, [page, dispatch, searchQuery, tags.length]);

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      navigate("/posts");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      searchPost();
    }
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      const trimmedTag = newTagInput.trim();
      if (!tags.includes(trimmedTag)) {
        // Prevent duplicate tags
        setTags([...tags, trimmedTag]);
      }
      setNewTagInput("");
      e.preventDefault();
    }
  };

  const handleDeleteChip = (chipToDelete) =>
    setTags(tags.filter((tag) => tag !== chipToDelete));

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
        <Box sx={{ flex: 3 }}>
          <Posts setCurrentId={setCurrentId} />
        </Box>
        <Box
          sx={{
            flex: 1,
            position: { xs: "static", md: "sticky" },
            top: 20,
            mb: { xs: 4, md: 0 },
          }}
        >
          <AppBar
            sx={homeStyles.appBarSearch}
            position="static"
            color="inherit"
          >
            {/* Main Search TextField */}
            <TextField
              onKeyDown={handleSearchKeyPress}
              name="search"
              variant="outlined"
              label="Search Memories"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 1 }}
            />

            {/* Tag Input TextField */}
            <TextField
              onKeyDown={handleTagInputKeyPress}
              name="tagsInput"
              variant="outlined"
              label="Add Tags (Press Enter)"
              fullWidth
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              sx={{ mb: tags.length > 0 ? 1 : 0 }}
            />

            {/* Display Tags as Chips */}
            {tags.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", mb: 1.5 }}
              >
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteChip(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}

            <Button
              onClick={searchPost}
              sx={homeStyles.searchButton}
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </AppBar>

          <Form currentId={currentId} setCurrentId={setCurrentId} />

          {/* Only show pagination if not in a search query result */}
          {!searchQuery && !tags.length && numberOfPages > 1 && (
            <Paper sx={homeStyles.pagination} elevation={6}>
              <Pagination page={page} />
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Home;

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
//         <Box sx={{ flex: 2 }}>
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

// import { Box, Paper, AppBar, TextField, Button } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Posts from "../Posts/Posts";
// import Form from "../Form/Form";
// import { useDispatch } from "react-redux";
// import { getPosts } from "../../actions/posts";
// import Pagination from "../Pagination";

// import postStyles from "./styles";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }
// const Home = () => {
//   const classes = useStyles();
//   const query = useQuery();
//   const page = query.get("page") || 1;
//   const searchQuery = query.get("searchQuery");

//   const [currentId, setCurrentId] = useState(0);
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");
//   const [tags, setTags] = useState([]);
//   const history = useHistory();

//   const searchPost = () => {
//     if (search.trim() || tags) {
//       dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
//       history.push(
//         `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
//       );
//     } else {
//       history.push("/");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.keyCode === 13) {
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
//         <Box sx={{ flex: 2 }}>
//           <Posts setCurrentId={setCurrentId} />
//         </Box>
//         <Box
//           sx={{
//             flex: 1,
//             position: { xs: "static", md: "sticky" },
//             top: 20,
//             mb: { xs: 4, md: 0 },
//           }}
//         >
//           <AppBar
//             className={classes.appBarSearch}
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
//             <ChipInput
//               style={{ margin: "10px 0" }}
//               value={tags}
//               onAdd={(chip) => handleAddChip(chip)}
//               onDelete={(chip) => handleDeleteChip(chip)}
//               label="Search Tags"
//               variant="outlined"
//             />
//             <Button
//               onClick={searchPost}
//               className={classes.searchButton}
//               variant="contained"
//               color="primary"
//             >
//               Search
//             </Button>
//           </AppBar>
//           <Form currentId={currentId} setCurrentId={setCurrentId} />
//           <Paper className={classes.pagination} elevation={6}>
//             <Pagination />
//           </Paper>
//         </Box>
//       </Box>
//     </>
//   );
// };
