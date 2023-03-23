import { useQuery } from 'react-query'
import { getBlogs } from '../requests'
import BlogShow from "./BlogShow";

const Home = () => {
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
      <h2>All Blogs</h2>
      <div>
        {Blogs.sort((a, b) => b.likes - a.likes).map((blog) => (
          <BlogShow key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Home;