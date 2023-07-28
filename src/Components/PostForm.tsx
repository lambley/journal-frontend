import { axiosInstance } from "../Api/Api.js";
import { IPost } from "../types/data";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export const PostForm = (props: { updatePostList: (post: IPost) => void }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    const postData: IPost = {
      title,
      content,
      label,
      created_at: new Date(),
    };

    try {
      const response = await axiosInstance.post("/api/v1/posts", { post: postData });

      props.updatePostList(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="edit-post-form" style={{width: '50%'}}>
      <h2 style={{ marginBottom: "20px" }}>Create New Post</h2>
      <Form.Group className="post-form-group">
        <Form.Label>Title</Form.Label>
        <Form.Control
          {...register("title", { required: true })}
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          className="post-form-text-field"
        />
        {errors?.title?.type === "required" && <p>This field is required</p>}
      </Form.Group>

      <Form.Group className="post-form-group">
        <Form.Label>Content</Form.Label>
        <Form.Control
          {...register("content", { required: true })}
          type="text"
          name="content"
          onChange={(e) => setContent(e.target.value)}
          className="post-form-text-field"
        />
        {errors?.content?.type === "required" && <p>This field is required</p>}
      </Form.Group>

      <Form.Group className="post-form-group">
        <Form.Label>Label</Form.Label>
        <Form.Control
          {...register("label", { required: true })}
          type="text"
          name="label"
          onChange={(e) => setLabel(e.target.value)}
          className="post-form-text-field"
        />
        {errors?.label?.type === "required" && <p>This field is required</p>}
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
