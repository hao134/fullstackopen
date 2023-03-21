import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "../reducers/blogReducer";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { Link } from "react-router-dom"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from "@mui/material";

const BlogList = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    const blogs = useSelector((state) => state.blogs)
    const Blogs = [...blogs]
    const blogFormRef = useRef()

    return (
        <div>
            <h2>Create new</h2>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm />
            </Togglable>
            <TableContainer id='bloglist' component={Paper}>
                <Table>
                    <TableBody>
                        {Blogs
                            .sort((a, b) => b.likes - a.likes)
                            .map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        <Link to={`/blogs/${blog.id}`}>
                                            {blog.title} - {blog.author}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BlogList