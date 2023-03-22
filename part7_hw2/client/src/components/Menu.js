import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser, loggedUser } from "../reducers/loginReducer";
import { useEffect } from "react";
import { AppBar, Toolbar } from "@mui/material";
import Button from "@mui/material/Button";

const Menu = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loggedUser());
  }, [dispatch]);

  const user = useSelector((state) => state.login);

  const handleLogout = () => {
    dispatch(logOutUser());
  };
  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" component={Link} to="/blogs">
            Blogs
          </Button>
          <em>{user.name} logged in</em>
          <Button onClick={handleLogout} color="success" variant="contained">
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Menu;
