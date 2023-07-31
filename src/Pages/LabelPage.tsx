import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Post } from '../Components/Post'
import { IPost } from '../types/data'
import { axiosInstance } from '../Api/Api.js'
import { Row, Col } from 'react-bootstrap'

export const LabelPage:React.FC = () => {
  const { label = '' } = useParams<{ label?:string }>();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getPosts(label)
  }, [label])

  const getPosts = async (label: string) => {
    const response = await axiosInstance.get("/api/v1/posts/label=" + label);
    setPosts(response.data);
  }

  return (
    <div>
      <h1 className='text-center'>
        <span className={`label-page-heading post-label-${label}`}>#{label}</span> Quotes
      </h1>
      {posts.length === 0 ? (
        <p className="text-center mt-3">No posts found</p>
      ) : (
        <Row xs={1} md={3} className="g-4 mt-3">
          {posts.map((post: IPost) => (
            <Col key={post.id}>
              <Post {...post} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
