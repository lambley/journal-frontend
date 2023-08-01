import { Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';
import { axiosInstance } from "../Api/Api";
import { useState, useEffect } from "react";
import { IPost } from "../types/data";
import { TodayViewPost } from "./TodayViewPost";
import moment from 'moment';

export const TodayView = () => {
  const [post, setPost] = useState<IPost>();
  const [date, setDate] = useState<Date>(new Date());
  const [labelImage, setLabelImage] = useState<string>("");

  useEffect(() => {
    getQuote(date.toISOString());
  }, []);

  const getQuote = async (date: string) => {
    try {
      const response = await axiosInstance.get("/api/v1/posts/date=" + date);
      setPost(response.data);
      getLabelImage(response.data.label);
    } catch (error) {
      console.log(error);
    }
  };

  const getLabelImage = (label: string): void => {
    const url = `https://source.unsplash.com/random?${label}`;
    setLabelImage(url);
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
        <TodayViewPost {...post} />
      );
    } else {
      return (
        <TodayViewPost
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
            <div style={{
              backgroundImage: `url(${labelImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
            }}>
              {postComponent(post)}
            </div>
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
