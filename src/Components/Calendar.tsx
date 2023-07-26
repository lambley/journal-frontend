import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { axiosInstance } from "../Api/Api.js"
import { IPost } from '../types/data.js';
import { on } from 'events';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)
  const [postDates, setPostDates] = useState<Date[]>([])

  useEffect(() => {
    setPostDates(posts.map((post: IPost) => post.created_at))
    setIsUpdated(false)
  }, [isUpdated])

  const getPosts = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/posts')
      const data = res.data

      setPosts(data.reverse())
      setIsUpdated(true)
    } catch(error: any) {
      console.log(error);
    }
  }

  return (
    <>
      <button className="btn btn-secondary" onClick={getPosts}>Get Posts</button>
      <div>
        <Calendar
          onChange={onChange} value={value}
          tileClassName={({ date, view }) => {
            if(postDates.find(postDate => new Date(postDate)==date)){
              console.log('match');

              return 'highlight'
            }
          }}
        />
      </div>
      <div>
        Selected Date {value!.toLocaleString("uk").split(', ')[0] || "No date selected"}
      </div>
    </>
  );
}
