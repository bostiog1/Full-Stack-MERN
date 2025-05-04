import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";

const DeleteConfirmationModal = ({
  open,
  handleClose,
  handleConfirmDelete,
  postTitle,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: "400px",
          width: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DeleteForeverIcon color="error" />
          <Typography variant="h6">Delete Memory</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{postTitle}"? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
