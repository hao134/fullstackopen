import { useRef } from "react";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useQuery } from 'react-query'
import { getBlogs } from '../requests'

const BlogList = () => {
 
  const blogFormRef = useRef() 
  const result = useQuery(
    'blogs', getBlogs,
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  )
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
        
  if ( result.isError ) {
    return <div>blog service not available due to problems in server</div>
  }
    
  const Blogs = result.data
  

  return (
    <div>
      <h2>Create new</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <TableContainer id="bloglist" component={Paper}>
        <Table>
          <TableBody>
            {Blogs.sort((a, b) => b.likes - a.likes).map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} - {blog.author}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogList;