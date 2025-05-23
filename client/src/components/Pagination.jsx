import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";
import paginationStyles from "./styles";

const Paginate = () => {
  return (
    <Pagination
      sx={{ "& .MuiPagination-ul": paginationStyles.ul }}
      count={5}
      page={1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${1}`} />
      )}
    />
  );
};

export default Paginate;
