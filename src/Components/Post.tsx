import { IPost } from "../types/data";
import Card from 'react-bootstrap/Card';

export const Post = (props: IPost) => {
  const { title, content, label, created_at } = props;

  const colourLabels = (label: string) => {
    if (label === "idea") {
      return "post-label-idea";
    } else if (label === "fun") {
      return "post-label-fun";
    } else if (label === "work") {
      return "post-label-work";
    } else {
      return "post-label-life";
    }
  };

  return (
    <Card style={{
      height: "180px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      padding: "16px",
      flexWrap: "wrap",
    }}>
      <Card.Body>
        <Card.Title>{props.id}. {title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <div className="post-card-bottom">
          <span className={`post-label ${colourLabels(label)}`}>#{label}</span>
          <div className="post-date"><i>Added on {created_at?.toString().slice(0, 10)}</i></div>
        </div>
      </Card.Body>
    </Card>
  );
};
