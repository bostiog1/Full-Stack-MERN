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
import { useEffect, useState, useRef, useCallback } from "react"; 
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

  const debounceTimeout = useRef(null);
  const { numberOfPages } = useSelector((state) => state.posts);

  const searchPost = useCallback(() => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      navigate(`/posts?page=${page}`);
      dispatch(getPosts(page));
    }
  }, [search, tags, dispatch, navigate, page]);

  const refreshPosts = useCallback(() => {
    const newPage =
      page > numberOfPages && numberOfPages > 0 ? numberOfPages : page;

    if (!search.trim() && tags.length === 0) {
      dispatch(getPosts(newPage));
      if (newPage !== page) {
        navigate(`/posts?page=${newPage}`);
      }
    } else {
      searchPost();
    }
  }, [page, numberOfPages, search, tags, dispatch, navigate, searchPost]);

  useEffect(() => {
    if (searchQueryParam || tags.length) {
    } else {
      dispatch(getPosts(page));
    }
  }, [page, dispatch, searchQueryParam, tags.length]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const hasActualSearch = search.trim() !== "" || tags.length > 0;
      const isSearchRoute = window.location.pathname.includes("/posts/search");

      if (hasActualSearch || isSearchRoute) {
        searchPost();
      } else {
        dispatch(getPosts(page));
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, tags, searchPost, page, dispatch]);

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      e.preventDefault();
      const trimmedTag = newTagInput.trim().toLowerCase();
      if (!tags.includes(trimmedTag)) {
        setTags((prevTags) => [...prevTags, trimmedTag]);
      }
      setNewTagInput("");
    }
  };

  const handleDeleteChip = (chipToDelete) =>
    setTags((prevTags) => prevTags.filter((tag) => tag !== chipToDelete));

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
        <Box sx={{ flex: 4 }}>
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
              onChange={(e) => setSearch(e.target.value)}
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

            <Button
              onClick={searchPost}
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
          {!searchQueryParam ||
          (searchQueryParam === "none" && tags.length === 0) ? (
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
