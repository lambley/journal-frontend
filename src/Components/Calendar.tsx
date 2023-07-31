import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { axiosInstance } from "../Api/Api.js"
import { IPost } from '../types/data.js';
import moment, { Moment } from 'moment';
import { Post } from './Post';
import { ButtonGroup, Button, Form } from 'react-bootstrap';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [posts, setPosts] = useState<IPost[]>([]);
  const [post, setPost] = useState<IPost>(
    {
      id: 0,
      title: 'No post for this day yet!',
      content: 'No content yet!',
      label: 'No label yet!',
      created_at: new Date(),
    }
  );
  const [activeView, setActiveView] = useState<string>('Length');
  const [baseColor, setBaseColor] = useState<number>(60);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/posts');
        const data = res.data;
        setPosts(data);
      } catch (error: any) {
        console.log(error);
      }
    };

    getPosts();
  }, []);

  useEffect(() => {
    getPost(value as Date);
  }, [value]);

  useEffect(() => {
    getPost(value as Date);
  }, []);

  const getPost = async (date: Date) => {
    try {
      const formattedDate = (moment(date) as Moment).format('YYYY-MM-DD');
      const res = await axiosInstance.get("/api/v1/posts/date=" + formattedDate);
      const data = res.data;

      if (data) {
        setPost(data);
      }
      else {
        setPost({
          id: 0,
          title: 'No post for this day yet!',
          content: 'No content yet!',
          label: 'No label yet!',
          created_at: date,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDayClick = (selectedDate: Date) => {
    onChange(selectedDate);
    getPost(selectedDate);
  };

  const getTileColour = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const postForDate = posts.find((post: IPost) => moment(post.created_at).format('YYYY-MM-DD') === formattedDate);

    if (postForDate) {
      const postContent = postForDate.content;
      const contentLength = postContent.length;

      if (postContent && activeView === 'Length') {
        const minContentLength = Math.min(...posts.map(post => post.content.length + post.title.length));
        const maxContentLength = Math.max(...posts.map(post => post.content.length + post.title.length));

        const normalizedLength = (contentLength - minContentLength) / (maxContentLength - minContentLength);

        const backgroundColor = getBackgroundColor(normalizedLength);
        return backgroundColor;
      }
      else if (postContent && activeView === 'Label') {
        const label = postForDate.label;

        if (label === 'idea') {
          return '#498afb';
        }
        else if (label === 'fun') {
          return '#fa8142';
        }
        else if (label === 'work') {
          return '#09c372';
        }
        else {
          return '#ff3860';
        }
      }
    }

    return 'transparent';
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setBaseColor(value);
  };

  const getBackgroundColor = (normalizedLength: number) => {
    const hue = baseColor - normalizedLength * baseColor;
    const backgroundColor = `hsl(${hue}, 75%, 75%)`;
    return backgroundColor;
  };

  const lengthView = () => {
    return (
    <div className='mb-3'>
      <h3>Color Ranges:</h3>
      <Form.Range
        min={0}
        max={100}
        value={baseColor}
        onChange={handleSliderChange}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: 'hsl(60, 75%, 75%)' }}></div>
        <span style={{ marginLeft: '8px' }}>Lower Post Length</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: 'hsl(0, 75%, 75%)' }}></div>
        <span style={{ marginLeft: '8px' }}>Max Post Length</span>
      </div>
    </div>
    )
  }

  const labelView = () => {
    return (
      <div className='mb-3'>
        <h3>Labels:</h3>
        <span className='post-label post-label-idea'>
          #idea
        </span>
        <span className='post-label post-label-fun'>
          #fun
        </span>
        <span className='post-label post-label-work'>
          #work
        </span>
        <span className='post-label post-label-life'>
          #life
        </span>
      </div>
    )
  }

  const handleViewClick = (view: string) => {
    setActiveView(view);
  }
  return (
    <div className="calendar-container mt-3">
      <ButtonGroup>
        <Button
          variant={activeView === "Length" ? "secondary active" : "secondary"}
          onClick={() => {handleViewClick("Length")}}
        >
          Length
        </Button>
        <Button
          variant={activeView === "Label" ? "secondary active" : "secondary"}
          onClick={() => {handleViewClick("Label")}}
        >
          Label
        </Button>
      </ButtonGroup>
      <div className='mb-3 mt-3'>
        <Calendar
          onChange={()=>handleDayClick}
          value={value}
          onClickDay={(value, event) => {
            handleDayClick(value);
          }}
          tileContent={({ date, view }) => {
            const backgroundColor = getTileColour(date);
            return (
              <div
                className="calendar-tile"
                style={{
                  backgroundColor,
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                }}
                >
                X
              </div>
            );
          }}
          />
      </div>
      {activeView === "Length"
        ? lengthView()
        : labelView()
      }
      {/* <div>
        Selected Date {value!.toLocaleString('uk').split(', ')[0] || 'No date selected'}
      </div> */}
      <Post {...post} />
    </div>
  );
};
