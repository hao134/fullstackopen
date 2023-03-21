import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "../reducers/blogReducer";
import BlogShow from './BlogShow'


const Home = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    const blogs = useSelector((state) => state.blogs)
    const Blogs = [...blogs]

    return (
        <div>
            <h2>All Blogs</h2>
            <div>
                {Blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <BlogShow key={blog.id} blog={blog} />
                  ))
                }
            </div>
        </div>
    )
}

export default Home