import { Box, Paper, AppBar, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";
import Pagination from "../Pagination";
import { useHistory, useLocation } from "react-router-dom";
import ChipInput from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

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
        <Box sx={{ flex: 2 }}>
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
          <Form currentId={currentId} setCurrentId={setCurrentId} />
          <Paper elevation={6}>
            <Pagination />
          </Paper>
        </Box>
      </Box>
    </>
  );
};
