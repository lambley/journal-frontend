import { Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';
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
    <Container className="today-view">
      <h1 className="today-view-header">Quote of the Day</h1>
      <Row>
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <div className="quote">
            {postComponent(post)}
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <ButtonGroup className="d-flex justify-content-center" aria-label="Basic example">
            <Button
              variant="secondary"
              onClick={handlePrevDay}
            >
              Previous Day
            </Button>
            <Button
              variant={moment(date).isSame(moment(), 'day') ? "secondary active" : "secondary"}
              onClick={handleToday}
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
        </Col>
      </Row>
    </Container>
  );
};
