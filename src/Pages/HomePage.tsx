import { MyCalendar } from "../Components/Calendar";
import { PostList } from "../Components/PostList";
import { useState } from "react";

export const HomePage = () => {
  const [showCalendar, setShowCalendar] = useState(false)

  const buttonText = showCalendar ? "List View" : "Calendar View"

  const handleToggleClick = () => {
    setShowCalendar(!showCalendar)
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button className="btn btn-secondary" onClick={handleToggleClick}>{buttonText}</button>
      {showCalendar ? <MyCalendar /> : <PostList />}
    </div>
  )
}
