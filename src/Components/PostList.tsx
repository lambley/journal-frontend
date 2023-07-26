import { useState, useEffect } from "react"
import { Post } from "./Post"
// import { PostForm } from '../Posts/PostForm'
import { IPost } from "../types/data"
import axios from 'axios';

export const PostList = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)

  useEffect(() => {
    getPosts()
  }, [isUpdated])

  const getPosts = async () => {
    const url = process.env.REACT_APP_API_URL + '/api/v1/posts'
    try {
      const res = await axios.get(url)
      const data = res.data

      setPosts(data.reverse())
    } catch(error: any) {
      console.log(error);

    }
  }

  const updatePostList = (post: IPost) => {
    let newPosts = [...posts]
    newPosts.unshift(post)
    setPosts(newPosts)
    setIsUpdated(true)
  }

  return(
    <>
      <div>
        <h1>Post List</h1>
        {/* <PostForm updatePostList={updatePostList} /> */}
        {posts.map((post: IPost) => (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            label={post.label}
            created_at={post.created_at}
          />
        ))}
      </div>
    </>
  )
}
