import { IPost } from "../types/data";
import { axiosInstance } from "../Api/Api.js"

export const Post = (props: IPost) => {

  return (
    <>
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      <small>{props.label}</small>
      <hr />
      <p>Created at {props.created_at.toString()}</p>
    </>
  )
}
