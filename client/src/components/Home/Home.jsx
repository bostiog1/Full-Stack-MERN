import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";

export const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <>
      {/* Main Content */}
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
        </Box>
      </Box>
    </>
  );
};
