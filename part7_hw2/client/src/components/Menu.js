import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import Button from "@mui/material/Button";
import { logOutUser } from "../reducers/loginReducer";

const Menu = () => {
    const dispatch = useDispatch()
    const padding = {
        paddingRight: 5
    }
    const handleLogout = () => {
        dispatch(logOutUser())
    }
    return (
        <div>
            <Link style={padding} to="/users" >Users</Link>
            <Link style={padding} to="/blogs">Blogs</Link>
            <Button onClick={handleLogout}>logout</Button>
        </div>
    )
}

export default Menu