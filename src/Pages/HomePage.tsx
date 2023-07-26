import { MyCalendar } from "../Components/Calendar";
import { PostList } from "../Components/PostList";
import { useState } from "react";

export const HomePage = () => {
  const [showList, setShowList] = useState(false)

  const buttonText = showList ? "Show Calendar" : "Show List"

  const handleToggleClick = () => {
    setShowList(!showList)
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button className="btn btn-secondary" onClick={handleToggleClick}>{buttonText}</button>
      {showList ? <PostList /> : <MyCalendar />}
    </div>
  )
}
