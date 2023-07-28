import { useState, useEffect, useRef } from "react"
import { Post } from "./Post"
import { PostForm } from '../Components/PostForm'
import { IPost } from "../types/data"
import { axiosInstance } from "../Api/Api.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareXmark, faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col } from "react-bootstrap"

export const PostList = () => {
  const [originalPosts, setOriginalPosts] = useState<IPost[]>([]);
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
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filterText, setFilterText] = useState<string>("");
  const isOriginalPostsSetRef = useRef(false);

  useEffect(() => {
    getPosts()
  }, [isUpdated])

  useEffect(() => {
    if (!isOriginalPostsSetRef.current && posts.length > 0) {
      setOriginalPosts(posts);
      isOriginalPostsSetRef.current = true;
    }
  }, [posts]);

  const sortPosts = (option: string) => {
    let sortedPosts = [...posts];
    if (option === "newest") {
      sortedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (option === "oldest") {
      sortedPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    setPosts(sortedPosts);
  };

  const filterPosts = (text: string) => {
    const filteredPosts = originalPosts.filter((post) =>
      post.content.toLowerCase().includes(text.toLowerCase())
    );
    setFilterText(text);
    setPosts(text === "" ? originalPosts : filteredPosts);
  };


  const getPosts = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/posts')
      const data = res.data

      setPosts(data)
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
    return (
      <div className="edit-post-form">
        <h2>Edit Post</h2>
        <div className="post-form-group">
          <label htmlFor="title">Title</label>
          <input className="post-form-text-field" type="text" name="title" id="edit-title" defaultValue={post.title}/>
        </div>

        <div className="post-form-group">
          <label htmlFor="content">Content</label>
          <input className="post-form-text-field" type="text" name="content" id="edit-content" defaultValue={post.content}/>
        </div>

        <div className="post-form-group">
          <label htmlFor="label">Label</label>
          <input className="post-form-text-field" type="text" name="label" id="edit-label" defaultValue={post.label}/>
        </div>

        <button onClick={()=>onEditSubmit(post)}>
          Submit
        </button>
        <hr />
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
        {/* Post Form */}
        <button onClick={()=>{setShowForm(!showForm)}}>Create New Post</button>
        <div className="post-form-foreground">
          {showForm && <PostForm updatePostList={updatePostList} />}
        </div>
        {/* Sort and Filter Options */}
        <div>
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              sortPosts(e.target.value);
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <label htmlFor="filter">Filter:</label>
          <input
            type="text"
            id="filter"
            value={filterText}
            onChange={(e) => {
              console.log(e.target.value);
              setFilterText(e.target.value);
              filterPosts(e.target.value);
            }}
          />
        </div>
        {/* Post List */}
        <div className="fixed-scroll container row">
          {posts.map((post: IPost) => (
            <Col sm={12} md={4} className="mb-3">
              <div className="post-card-button-wrapper">
                <button className="post-button post-button-edit" onClick={()=>{setIsEditing(
                  {
                    isEdit: !isEditing.isEdit,
                    id: post.id!
                  }
                  )}}
                >
                  <FontAwesomeIcon icon={faSquarePen} />
                </button>
                <button className="post-button post-button-delete" onClick={()=>handleDelete(post.id!)}>
                  <FontAwesomeIcon icon={faSquareXmark} />
                </button>
              </div>
              {isEditing.isEdit && isEditing.id === post.id
                ? editPostComponent(post)
                : postComponent(post)
              }
            </Col>
          ))}
        </div>
      </div>
    </>
  )
}
