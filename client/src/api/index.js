import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000" });
const API = axios.create({
  baseURL: "https://full-stack-mern-u5sq.vercel.app/posts",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const deleteComment = (postId, commentIndex) =>
  API.delete(`/posts/comment/${postId}/${commentIndex}`);

export const fetchPost = (id) => API.get(`/posts/${id}`);

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
export const createPost = (newPost) => API.post("/posts", newPost);
export const likePost = (id) => API.patch(`posts/${id}/likePost`);
export const commentPost = (value, id) =>
  API.post(`posts/${id}/commentPost`, { value });

export const updatePost = (id, updatedPost) =>
  API.patch(`posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`posts/${id}`);

export const signIn = (formData) => API.post("/user/signIn", formData);
export const signUp = (formData) => API.post("/user/signUp", formData);

export const auth0SignInBackend = (auth0UserData) =>
  API.post("/user/auth0SignIn", auth0UserData);
