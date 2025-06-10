const postStyles = {
  media: {
    borderRadius: "20px",
    objectFit: "cover",
    width: "100%",
    maxHeight: "600px",
  },
  card: {
    display: "flex",
    width: "100%",
    // Using a direct media query for small screens
    "@media (max-width: 600px)": {
      flexWrap: "wrap",
      flexDirection: "column",
    },
  },
  section: {
    borderRadius: "20px",
    margin: "10px",
    flex: 1,
  },
  imageSection: {
    marginLeft: "20px",
    // Using a direct media query for small screens
    "@media (max-width: 600px)": {
      marginLeft: 0,
    },
  },
  recommendedPosts: {
    display: "flex",
    // Using a direct media query for small screens
    "@media (max-width: 600px)": {
      flexDirection: "column",
    },
  },
  loadingPaper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderRadius: "15px",
    height: "39vh",
  },
  commentsOuterContainer: {
    display: "flex",
    gap: "24px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "16px",
    },
  },
  commentsInnerContainer: {
    flex: 1,
    maxHeight: "400px",
    overflowY: "auto",
    padding: "16px",
    backgroundColor: "#fafafa",
    borderRadius: "16px",
    border: `1px solid #e0e0e0`,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c1c1c1",
      borderRadius: "3px",
      "&:hover": {
        backgroundColor: "#a8a8a8",
      },
    },
  },
  commentInputContainer: {
    flex: "0 0 320px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: `1px solid #e0e0e0`,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    "@media (max-width: 768px)": {
      flex: "1 1 auto",
    },
  },
  commentItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "4px",
    padding: "4px 0",
    marginBottom: "4px",
    borderBottom: "1px solid #f0f0f0",
    "&:last-child": {
      borderBottom: "none",
    },
    transition: "background-color 0.2s ease",
    borderRadius: "8px",
    marginBottom: "8px",
    padding: "12px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  commentAvatar: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    width: 36,
    height: 36,
    fontSize: "0.9rem",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  commentContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  commentAuthor: {
    fontWeight: 600,
    color: "#1976d2",
    fontSize: "0.9rem",
    marginBottom: "2px",
  },
  commentText: {
    color: "#424242",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  emptyCommentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    textAlign: "center",
    minHeight: "120px",
  },
  emptyCommentsIcon: {
    fontSize: "3rem",
    color: "#bdbdbd",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#1a1a1a",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  commentButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textTransform: "none",
    fontWeight: 600,
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "1rem",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
      transform: "translateY(-1px)",
    },
    "&:disabled": {
      background: "#e0e0e0",
      color: "#9e9e9e",
      boxShadow: "none",
      transform: "none",
    },
  },
  commentTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#667eea",
          borderWidth: "2px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666",
      "&.Mui-focused": {
        color: "#667eea",
      },
    },
  },
  commentCount: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
};

export default postStyles;
