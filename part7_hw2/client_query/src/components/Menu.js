import { Link } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Button from "@mui/material/Button";
import { useQuery } from 'react-query'

const Menu = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = useQuery('login', () => {
    if (!loggedUserJSON){
      return null
    }
    return loggedUserJSON
  })
  if ( user.isLoading ) {
    return <div>loading data...</div>
  }
    
  if ( user.isError ) {
    return <div>blog service not available due to problems in server</div>
  }

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload()
  }
  //const userData = JSON.parse(user.data)

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/blogs">
            Blogs
          </Button>
          <em> {JSON.parse(user.data).name} logged in</em>
          <Button onClick={handleLogout} color="success" variant="contained">
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Menu;