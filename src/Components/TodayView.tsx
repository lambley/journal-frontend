import { axiosInstance } from "../Api/Api";
import { useState, useEffect } from "react";
import { IPost } from "../types/data";
import { Post } from "./Post";

export const TodayView = () => {
  const [post, setPost] = useState<IPost>();
  const [date, setDate] = useState<Date>(new Date);

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
    return (
      post && (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          label={post.label}
          created_at={post.created_at}
        />
      )
    );
  };

  return (
    <div className="today-view">
      <h1>Quote of the Day</h1>
      <div className="quote">
        {postComponent(post)}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevDay}>Previous Day</button>
        <button onClick={handleToday}>Today</button>
        <button onClick={handleNextDay}>Next Day</button>
      </div>
    </div>
  );
};
