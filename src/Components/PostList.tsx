import { useState, useEffect } from "react"
import { Post } from "./Post"
import { PostForm } from '../Components/PostForm'
import { IPost } from "../types/data"
import { axiosInstance } from "../Api/Api.js"

export const PostList = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)
  const [isEditing, setIsEditing] = useState<{
    isEdit: Boolean,
    id: number
  }>({
    isEdit: false,
    id: 0
  })
  const [showForm, setShowForm] = useState<Boolean>(false)

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

  const handleDelete = async (id:number) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/posts/${id}`)
      console.log(response)
      getPosts()
    } catch(error: any) {
      console.log(error)
    }
  }

  const onEditSubmit = async (post:IPost) => {
    try {
      const response = await axiosInstance.put(`/api/v1/posts/${post.id}`, {
        title: (document.getElementById('edit-title') as HTMLInputElement)?.value,
        content: (document.getElementById('edit-content') as HTMLInputElement)?.value,
        label: (document.getElementById('edit-label') as HTMLInputElement)?.value,
      })
      console.log(response)
      getPosts()
    } catch(error: any) {
      console.log(error)
    }
    setIsEditing({
      isEdit: false,
      id: 0
    })
  }

  const editPostComponent = (post:IPost) => {
    const newList = posts.filter((post:IPost) => post.id !== isEditing.id)
    return (
      <div>
        <h2>Edit Post</h2>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="edit-title" defaultValue={post.title}/>

        <label htmlFor="content">Content</label>
        <input type="text" name="content" id="edit-content" defaultValue={post.content}/>

        <label htmlFor="label">Label</label>
        <input type="text" name="label" id="edit-label" defaultValue={post.label}/>
        <button onClick={()=>onEditSubmit(post)}>Submit</button>
      </div>
    )
  }

  const postComponent = (post:IPost) => {
    return (
      <Post
        key={post.id}
        id={post.id}
        title={post.title}
        content={post.content}
        label={post.label}
        created_at={post.created_at}
      />
    )
  }

  return(
    <>
      <div>
        <h1>Post List</h1>
        <button onClick={()=>{setShowForm(!showForm)}}>Create New Post</button>
        <div className="post-form-foreground">
          {showForm && <PostForm updatePostList={updatePostList} />}
        </div>
        <div className="fixed-scroll">
          {posts.map((post: IPost) => (
            <div>
              <button onClick={()=>handleDelete(post.id!)}>Delete</button>
              <button onClick={()=>{setIsEditing(
                {
                  isEdit: !isEditing.isEdit,
                  id: post.id!
                }
              )}}>Edit</button>
              {isEditing.isEdit && isEditing.id === post.id
                ? editPostComponent(post)
                : postComponent(post)
              }
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
