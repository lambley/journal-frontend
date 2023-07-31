import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { axiosInstance } from "../Api/Api.js"
import { IPost } from '../types/data.js';
import moment from 'moment';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [posts, setPosts] = useState<IPost[]>([])
  const [isUpdated, setIsUpdated] = useState<Boolean>(false)
  const [postDates, setPostDates] = useState<Date[]>([])
  const [postToBeDisplayed, setPostToBeDisplayed] = useState<IPost[]>([])
  useEffect(() => {
    setPostDates(posts.map((post: IPost) => post.created_at))
    setIsUpdated(false)
  }, [isUpdated, posts])

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
    <div className="calendar-container">
      <button className="btn btn-secondary" onClick={getPosts}>Get Posts</button>
      <div>
        <Calendar
          onChange={onChange} value={value}
          tileClassName={({ date, view }) => {
            if(postDates.find(x=>moment(x).format('DD-MM-YYYY')===moment(date).format("DD-MM-YYYY"))){
              return  'highlight'
              }
            // if(moment(date).format('YYYY-MM-DD') == moment(postDates[0]).format('YYYY-MM-DD')){
            //   return 'highlight'
            // }
          }}
          onClickDay={(value, event) => {
            if (moment(value).format('YYYY-MM-DD') == moment(postDates[0]).format('YYYY-MM-DD')) {
              // Show the post
              // setPostToBeDisplayed()
            }
          }}
        />
      </div>
      <div>
        Selected Date {value!.toLocaleString("uk").split(', ')[0] || "No date selected"}
      </div>
    </div>
  );
}
