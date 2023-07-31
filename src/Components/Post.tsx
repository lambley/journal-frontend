import React from "react";
import { IPost } from "../types/data";
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

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
        <div className="post-quote-left">
          <FontAwesomeIcon icon={faQuoteLeft} style={{ marginRight: "8px" }} />
          <Card.Title>{props.id}. {title}</Card.Title>
        </div>
        <div className="post-quote-right">
          <Card.Text>{content}</Card.Text>
          <FontAwesomeIcon icon={faQuoteRight} style={{ marginRight: "8px" }} />
        </div>
        <div className="post-card-bottom">
          <span className={`post-label ${colourLabels(label)}`}>#{label}</span>
          <div className="post-date"><i>Added on {created_at?.toString().slice(0, 10)}</i></div>
        </div>
      </Card.Body>
    </Card>
  );
};
