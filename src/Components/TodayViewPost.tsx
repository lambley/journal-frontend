import React from "react";
import { Link } from 'react-router-dom';
import { IPost } from "../types/data";
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

export const TodayViewPost = (props: IPost) => {
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
    <div className="today-view-post">
      <div className="today-view-post-background">
        <div className="post-quote-right">
          <FontAwesomeIcon icon={faQuoteLeft} style={{ marginRight: "8px" }} />
          <h4>{content}</h4>
          <FontAwesomeIcon icon={faQuoteRight} style={{ marginRight: "8px" }} />
        </div>
        <div className="post-quote-left">
          <div>{title}</div>
        </div>
        <div className="post-card-bottom">
          <Link to={`/label/${label}`} className={`link post-label ${colourLabels(label)}`}>
            #{label}
          </Link>
          <div className="post-date"><i>Added on {created_at?.toString().slice(0, 10)}</i></div>
        </div>
      </div>
    </div>
  );
};
