import { Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';
import { axiosInstance } from "../Api/Api";
import { useState, useEffect } from "react";
import { IPost } from "../types/data";
import { TodayViewPost } from "./TodayViewPost";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faDice } from '@fortawesome/free-solid-svg-icons';

export const TodayView = () => {
  const [post, setPost] = useState<IPost>();
  const [date, setDate] = useState<Date>(new Date());
  const [labelImage, setLabelImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getQuote(date.toISOString());
  }, []);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = labelImage;
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
  }, [labelImage]);

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

  // Navigation button handlers
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

  const randomizeDateWithinRange = () => {
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

    const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));

    return randomDate;
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
    <Container className="today-view" aria-label="Today's Quote">
      <h1 className="today-view-header">Quote of the Day</h1>
      <Row>
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <div className="quote">
            {loading
              ? <div className="loading-background"></div>
              :
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
            }
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <ButtonGroup className="d-flex justify-content-center" aria-label="Today's Quote navigation">
            <Button
              variant="secondary"
              onClick={handlePrevDay}
              aria-label="Previous Day"
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
            <Button
              variant={moment(date).isSame(moment(), 'day') ? "secondary active" : "secondary"}
              onClick={handleToday}
              aria-label='Today'
            >
              Today
            </Button>
            <Button
              variant="secondary"
              onClick={handleNextDay}
              aria-label='Next Day'
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          </ButtonGroup>
          <div className="text-center w-100">
            <ButtonGroup className='mt-3'>
              <Button
                variant='secondary'
                onClick={() => getQuote(randomizeDateWithinRange().toISOString())}
                aria-label='Random Quote'
                style={{
                  backgroundColor: "#ff0000bd",
                  borderColor: "#ff0000bd",
                }}
              >
                <FontAwesomeIcon icon={faDice} />
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
