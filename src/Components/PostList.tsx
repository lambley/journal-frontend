import { useState, useEffect, useRef } from "react";
import { Post } from "./Post";
import { PostForm } from '../Components/PostForm';
import { DeleteConfirmationModal } from "../Components/DeleteConfirmationModal";
import { IPost } from "../types/data";
import { axiosInstance } from "../Api/Api.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faSquarePen, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Button, Form, Row, ButtonGroup, Alert, Modal } from "react-bootstrap";
import { throttle } from "lodash";

interface IPostEditing {
  isEdit: Boolean,
  id: number
}

export const PostList = () => {
  const [originalPosts, setOriginalPosts] = useState<IPost[]>([]);
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)
  const [isEditing, setIsEditing] = useState<IPostEditing>({isEdit: false, id: 0 })
  const [showForm, setShowForm] = useState<Boolean>(false)
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filterText, setFilterText] = useState<string>("");
  const isOriginalPostsSetRef = useRef(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const jwtToken = localStorage.getItem("jwtToken");

  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
  };

  useEffect(() => {
    getPosts()
  }, [isUpdated])

  useEffect(() => {
    if (!isOriginalPostsSetRef.current && posts.length > 0) {
      setOriginalPosts(posts);
      isOriginalPostsSetRef.current = true;
    }
  }, [posts]);

  useEffect(() => {
    if (originalPosts.length > 0) {
      sortPosts(sortOption);
    }
  }, [originalPosts]);

  const sortPosts = (option: string) => {
    let sortedPosts = [...posts];
    if (option === "newest") {
      sortedPosts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (option === "oldest") {
      sortedPosts.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    }
    setPosts(sortedPosts);
  };

  const throttledFilterPosts = throttle((text: string) => {
    const filteredPosts = originalPosts.filter((post) =>
      post.content.toLowerCase().includes(text.toLowerCase())
    );
    setFilterText(text);
    setPosts(text === "" ? originalPosts : filteredPosts);
  }, 300);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    throttledFilterPosts(text);
  };

  const getPosts = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/posts')
      const data = res.data
      setPosts(data)
    } catch(error: any) {
      console.log(error);
    }
    if (posts.length > 0) {
      sortPosts(sortOption)
    }
  }

  const updatePostList = (post: IPost) => {
    let newPosts = [...posts]
    newPosts.unshift(post)
    setPosts(newPosts)
    setIsUpdated(true)
    // show a confirmation message and display message for 3secs
    if (showForm) {
      setShowForm(false);
    }
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  }

  const updatePost = (originalPost: IPost) => {
    const index = posts.indexOf(posts.find(post => post.id === originalPost.id)!)

    posts[index].title = (document.getElementById('edit-title') as HTMLInputElement)?.value
    posts[index].content = (document.getElementById('edit-content') as HTMLInputElement)?.value
    posts[index].label = (document.getElementById('edit-label') as HTMLInputElement)?.value
  }

  // delete functions
  const handleDelete = async (id: number) => {
    setDeletePostId(id);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (deletePostId) {
      try {
        await axiosInstance.delete(`/api/v1/posts/${deletePostId}`, { headers });
        const updatedPosts = posts.filter((post) => post.id !== deletePostId);
        setPosts(updatedPosts);
        setIsUpdated(true);
      } catch (error) {
        console.log(error);
      }
    }
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setDeletePostId(null);
    setShowDeleteConfirmation(false);
  };

  // edit functions
  const onEditSubmit = async (post:IPost) => {
    updatePost(post)
    try {
      const response = await axiosInstance.put(`/api/v1/posts/${post.id}`, {
        title: (document.getElementById('edit-title') as HTMLInputElement)?.value,
        content: (document.getElementById('edit-content') as HTMLInputElement)?.value,
        label: (document.getElementById('edit-label') as HTMLInputElement)?.value,
      }, {headers})
      console.log(response)
      getPosts()
      sortPosts(sortOption)
    } catch(error: any) {
      console.log(error)
    }
    toggleButtonClasses(post)
    setIsEditing({
      isEdit: false,
      id: 0
    })
  }

  const toggleButtonClasses = (post:IPost) => {
    const editButton = document.querySelector('.post-button-edit')
    const deleteButton = document.querySelector('.post-button-delete')

    if (isEditing.isEdit && isEditing.id === post.id) {
      editButton?.classList.remove('post-button-edit-active')
      deleteButton?.classList.remove('post-button-delete-active')
    } else {
      editButton?.classList.add('post-button-edit-active')
      deleteButton?.classList.add('post-button-delete-active')
    }
  }

  const handleEditClick = (post:IPost) => {
    setIsEditing({
      isEdit: !isEditing.isEdit,
      id: post.id!,
    })
    toggleButtonClasses(post)
    editPostComponent(post)
  }

  const handleCancelEdit = (post:IPost) => {
    setIsEditing({
      isEdit: false,
      id: 0
    })
    toggleButtonClasses(post)
  }

  const editPostComponent = (post:IPost) => {
    return (
      <div className="edit-post-form">
        <h2>Edit Post</h2>
        <div className="post-form-group">
          <label htmlFor="title">Author</label>
          <input className="post-form-text-field" type="text" name="title" id="edit-title" defaultValue={post.title}/>
        </div>

        <div className="post-form-group">
          <label htmlFor="content">Quote</label>
          <input className="post-form-text-field" type="text" name="content" id="edit-content" defaultValue={post.content}/>
        </div>

      <div className="post-form-group">
        <label htmlFor="edit-label">Label</label>
        <select
          className="post-form-text-field"
          name="label"
          id="edit-label"
          defaultValue={post.label}
        >
          <option value="idea">Idea</option>
          <option value="fun">Fun</option>
          <option value="work">Work</option>
          <option value="life">Life</option>
        </select>
      </div>

        <div className="form-button-group">
          <Button
            variant="primary"
            onClick={()=>onEditSubmit(post)}
          >
            Submit
          </Button>
          <Button
            variant="danger"
            onClick={()=>handleCancelEdit(post)}
          >
            Cancel
          </Button>
        </div>
        <hr />
      </div>
    )
  }

  // post functions
  const postComponent = (post:IPost) => {
    return (
      <Post {...post} />
    )
  }

  const createPostButton = () => {
    if (jwtToken) {
      return (
        <Col xs={12} sm={6} md={4}>
          <Button
            variant="info"
            onClick={() => setShowForm(!showForm)}
            className="button-transform"
            aria-label={showForm ? "Close Form" : "Create New Quote"}
          >
            {showForm
            ? (
              <>
                <span className="button-text">
                  <FontAwesomeIcon icon={faTimes} /> Close Form
                </span>
              </>
            )
            : (
              <>
                <span className="button-text">
                  <FontAwesomeIcon icon={faPlus} /> Create New Quote
                </span>
              </>
            )}
          </Button>
          <div className="post-form-foreground">
            {showForm && <PostForm updatePostList={updatePostList} />}
          </div>
        </Col>
      )
    }
  }

  const postButtons = (post:IPost) => {
    if (jwtToken) {
      return (
        <div className="post-card-button-wrapper">
          {/* Edit Button*/}
          <button
            className="post-button post-button-edit"
            aria-label="Edit Post"
            onClick={() => handleEditClick(post)}
          >
            <FontAwesomeIcon icon={faSquarePen} />
          </button>
          {/* Delete Button*/}
          <button
            className="post-button post-button-delete"
            aria-label="Delete Post"
            onClick={() => handleDelete(post.id!)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )
    }
  }

  return (
    <>
      <div className="mt-3">
        {showConfirmation && (
          <Alert variant="success" className="mt-2">
            Post has been created!
          </Alert>
          )
        }
        {/* Post Form and Sort/Filter Options */}
        <Row className="d-flex justify-content-center align-items-center">
          {createPostButton()}
          <Col xs={12} sm={6} md={8}>
            <ButtonGroup className="d-flex justify-content-center align-items-center flex-column">
              <Row className="m-1">
                <Form.Label column xs={3}>Sort:</Form.Label>
                <Col xs={9}>
                  <Form.Control
                    as="select"
                    value={sortOption}
                    aria-label="Sort"
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      sortPosts(e.target.value);
                    }}
                  >
                    <option value="newest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </Form.Control>
                </Col>
              </Row>
              <Row className="m-1">
                <Form.Label column xs={3}>Search:</Form.Label>
                <Col xs={9}>
                  <Form.Control
                    type="text"
                    value={filterText}
                    aria-label="Search"
                    onChange={handleFilterChange}
                  />
                </Col>
              </Row>
            </ButtonGroup>
          </Col>
        </Row>
        {/* Post List */}
        <div className="fixed-scroll container row">
          {posts.map((post: IPost) => (
            <Col sm={12} md={4} className="mb-3" key={post.id}>
              {postButtons(post)}
              {isEditing.isEdit && isEditing.id === post.id ? (
                editPostComponent(post)
              ) : (
                postComponent(post)
              )}
            </Col>
          ))}
        </div>
      </div>
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
