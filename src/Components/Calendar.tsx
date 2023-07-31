import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { axiosInstance } from "../Api/Api.js"
import { IPost } from '../types/data.js';
import moment, { Moment } from 'moment';
import { Post } from './Post';

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
      const postTitle = postForDate.title;
      const contentLength = postContent.length + postTitle.length;

      if (postContent) {
        const minContentLength = Math.min(...posts.map(post => post.content.length + post.title.length));
        const maxContentLength = Math.max(...posts.map(post => post.content.length + post.title.length));

        const normalizedLength = (contentLength - minContentLength) / (maxContentLength - minContentLength);

        const hue = 60 - normalizedLength * 60;

        const backgroundColor = `hsl(${hue}, 75%, 75%)`;

        return backgroundColor;
      }
    }

    return 'transparent';
  };

  return (
    <div className="calendar-container">
      <div>
        <h3>Color Ranges:</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'hsl(60, 75%, 75%)' }}></div>
          <span style={{ marginLeft: '8px' }}>Lower Post Length</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: 'hsl(0, 75%, 75%)' }}></div>
          <span style={{ marginLeft: '8px' }}>Max Post Length</span>
        </div>
      </div>
      <div>
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
      {/* <div>
        Selected Date {value!.toLocaleString('uk').split(', ')[0] || 'No date selected'}
      </div> */}
      <Post {...post} />
    </div>
  );
};
