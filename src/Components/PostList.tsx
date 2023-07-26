import { useState, useEffect } from "react"
import { Post } from "./Post"
import { PostForm } from '../Components/PostForm'
import { IPost } from "../types/data"
import { axiosInstance } from "../Api/Api.js"

export const PostList = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)

  useEffect(() => {
    getPosts()
  }, [isUpdated])

  const getPosts = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/posts')
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
        <PostForm updatePostList={updatePostList} />
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
