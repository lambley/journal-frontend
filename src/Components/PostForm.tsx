import { axiosInstance } from "../Api/Api.js";
import { IPost } from "../types/data";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface IFieldErrors {
  id?: string;
  author?: string;
  quote?: string;
  label?: string;
}

export const PostForm = (props: { updatePostList: (post: IPost) => void }) => {
  const [serverError, setServerError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({});
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const jwtToken = localStorage.getItem("jwtToken");

  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
  };

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
      const response = await axiosInstance.post("/api/v1/posts", { post: postData }, { headers });

      props.updatePostList(response.data);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data) {
        setFieldErrors(error.response.data);
      }
      setServerError(error.message || "Server error occurred.");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="edit-post-form" style={{width: '50%'}}>
      <h2 style={{ marginBottom: "20px" }}>Create New Post</h2>
      <Form.Group className="post-form-group">
        <Form.Label htmlFor="post-form-title">Author</Form.Label>
        <Form.Control
          {...register("title", { required: true })}
          id="post-form-title"
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          className="post-form-text-field"
        />
        {errors?.title?.type === "required" && <p>This field is required</p>}
        {fieldErrors?.author && <p style={{ color: "red" }}>Author: {fieldErrors.author}</p>}

      </Form.Group>

      <Form.Group className="post-form-group">
        <Form.Label htmlFor="post-form-content">Quote</Form.Label>
        <Form.Control
          {...register("content", { required: true })}
          id="post-form-content"
          type="text"
          name="content"
          onChange={(e) => setContent(e.target.value)}
          className="post-form-text-field"
        />
        {errors?.content?.type === "required" && <p>This field is required</p>}
        {fieldErrors?.quote && <p style={{ color: "red" }}>Quote: {fieldErrors.quote}</p>}

      </Form.Group>

      <Form.Group className="post-form-group">
        <Form.Label htmlFor="post-form-label">Label</Form.Label>
        <Form.Control
          as="select"
          {...register("label", { required: true })}
          id="post-form-label"
          name="label"
          onChange={(e) => setLabel(e.target.value)}
          className="post-form-text-field"
          defaultValue={""}
        >
          <option value="---">---</option>
          <option value="idea">Idea</option>
          <option value="fun">Fun</option>
          <option value="work">Work</option>
          <option value="life">Life</option>
        </Form.Control>
        {errors?.label?.type === "required" && <p>This field is required</p>}
        {fieldErrors?.label && <p style={{ color: "red" }}>Label: {fieldErrors.label}</p>}
      </Form.Group>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
