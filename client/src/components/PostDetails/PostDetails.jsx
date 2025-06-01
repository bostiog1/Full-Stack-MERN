import { useEffect } from "react";
import { Paper, Typography, CircularProgress, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ChatIcon from "@mui/icons-material/Chat";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";

import postStyles from "./styles";
import { getPost } from "../../actions/posts";

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id, dispatch]);

  if (!post && !isLoading) {
    return (
      <Paper style={postStyles.loadingPaper} elevation={6}>
        <Typography variant="h5">Post Not Found</Typography>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper style={postStyles.loadingPaper} elevation={6}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  const openRecommendedPost = (_id) => {
    navigate(`/posts/${_id}`);
    // Optional: Dispatch getPost again to refresh details if navigating within PostDetails
    // dispatch(getPost(_id)); // This might cause a re-render loop if not handled carefully
  };
  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      {/* Main Content - Two Columns */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        {/* Left Side - 60% */}
        <div style={{ flex: "0 0 60%" }}>
          <Typography
            variant="h3"
            component="h2"
            style={{ marginBottom: "16px", fontWeight: 600 }}
          >
            {post.title}
          </Typography>

          {/* Tags */}
          <div style={{ marginBottom: "16px" }}>
            {Array.isArray(post.tags) &&
              post.tags.map((tag) => (
                <Typography
                  key={tag}
                  variant="body2"
                  component="span"
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 8px",
                    marginRight: "8px",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  #{tag}
                </Typography>
              ))}
          </div>

          {/* Description */}
          <Typography
            variant="body1"
            component="p"
            style={{
              marginBottom: "24px",
              lineHeight: "1.6",
              fontSize: "1rem",
            }}
          >
            {post.message}
          </Typography>

          {/* Created by */}
          <Typography
            variant="h6"
            style={{ marginBottom: "8px", fontWeight: 500 }}
          >
            Created by: {post.name}
          </Typography>

          {/* Date */}
          <Typography
            variant="body1"
            style={{ marginBottom: "24px", color: "#666" }}
          >
            {moment(post.createdAt).fromNow()}
          </Typography>

          {/* Realtime Chat */}
          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>

          {/* Comments */}
          <Typography variant="body1">
            <strong>Comments - coming soon!</strong>
          </Typography>
        </div>

        {/* Right Side - 40% */}
        <div style={{ flex: "0 0 40%" }}>
          <img
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>

      {/* Recommended Posts */}
      {!!recommendedPosts.length && (
        <div>
          <Typography
            variant="h5"
            style={{ marginBottom: "20px", fontWeight: 600 }}
          >
            You might also like:
          </Typography>
          <Divider style={{ marginBottom: "20px" }} />

          {/* 4 Posts in One Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {recommendedPosts.slice(0, 4).map(
              ({ title, name, message, likes, selectedFile, _id }) => (
                <div
                  key={_id}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "transform 0.2s",
                  }}
                  onClick={() => openRecommendedPost(_id)}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  <img
                    src={selectedFile}
                    alt={title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 600, marginBottom: "4px" }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{
                        color: "#666",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        marginBottom: "8px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        fontSize: "0.875rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {message}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#666" }}>
                      Likes: {Array.isArray(likes) ? likes.length : 0}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};
export default PostDetails;
