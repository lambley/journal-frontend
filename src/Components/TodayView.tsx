import { Button, ButtonGroup } from 'react-bootstrap';
import { axiosInstance } from "../Api/Api";
import { useState, useEffect } from "react";
import { IPost } from "../types/data";
import { Post } from "./Post";
import moment from 'moment';

export const TodayView = () => {
  const [post, setPost] = useState<IPost>();
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    getQuote(date.toISOString());
  }, []);

  const getQuote = async (date: string) => {
    try {
      const response = await axiosInstance.get("/api/v1/posts/date=" + date);
      setPost(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevDay = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
    const prevDay = date.toISOString();
    getQuote(prevDay);
  };

  const handleNextDay = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
    const nextDay = date.toISOString();
    getQuote(nextDay);
  };

  const handleToday = () => {
    setDate(new Date());
    const today = new Date().toISOString();
    getQuote(today);
  }

  const postComponent = (post: IPost | undefined) => {
    if (post) {
      return (
        <Post {...post} />
      );
    } else {
      return (
        <Post
          key={1}
          id={0}
          title={"No post for this day yet!"}
          content={"No content yet!"}
          label={"No label yet!"}
          created_at={date}
        />
      );
    }
  };

  return (
    <div className="today-view">
      <h1 className="today-view-header">Quote of the Day</h1>
      <div className="quote">
        {postComponent(post)}
      </div>
      <div className="navigation-buttons d-flex justify-content-center mt-3">
        <ButtonGroup aria-label="Basic example">
          <Button
            variant="secondary"
            onClick={handlePrevDay}
          >
            Previous Day
          </Button>
          <Button
            variant={moment(date).isSame(moment(), 'day') ? "secondary active" : "secondary"}
          >
            Today
          </Button>
          <Button
            variant="secondary"
            onClick={handleNextDay}
          >
            Next Day
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
