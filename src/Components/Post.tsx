import { IPost } from "../types/data";

export const Post = (props: IPost) => {

  const { title, content, label, created_at } = props


  const colourLabels = (label: string) => {
    if (label === "idea") {
      return "post-label-idea"
    } else if (label === "fun") {
      return "post-label-fun"
    } else if (label === "work") {
      return "post-label-work"
    } else {
      return "post-label-life"
    }
  }

  return (
    <>
      <h2>{props.id}. {title}</h2>
      <p>{content}</p>
      <small className={`post-label ${colourLabels(label)}`}>{label}</small>
      <small className="post-date"><i>Added on {created_at.toString().slice(0,10)}</i></small>
      <hr />
    </>
  )
}
