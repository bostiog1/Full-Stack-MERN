import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  FormHelperText,
  Box,
  Tooltip,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";

export const Input = ({
  name,
  handleChange,
  label,
  half,
  autoFocus,
  type,
  handleShowPassword,
  value,
  error,
  helperText,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        label={label}
        autoFocus={autoFocus}
        type={type}
        value={value}
        error={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.3s",
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(63, 81, 181, 0.2)",
            },
            "&.Mui-error": {
              boxShadow: focused ? "0 0 0 3px rgba(244, 67, 54, 0.2)" : "none",
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              fontWeight: 500,
            },
          },
        }}
        helperText={error && helperText}
        FormHelperTextProps={{
          sx: {
            marginLeft: "14px",
            display: "flex",
            alignItems: "center",
            mt: 0.5,
          },
        }}
        InputProps={{
          endAdornment:
            name === "password" ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleShowPassword}
                  edge="end"
                  aria-label={
                    type === "password" ? "show password" : "hide password"
                  }
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {type === "password" ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : error ? (
              <InputAdornment position="end">
                <Tooltip title={helperText || "Error"} arrow placement="top">
                  <ErrorOutlineIcon color="error" fontSize="small" />
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
      />
    </Grid>
  );
};
