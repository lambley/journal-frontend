import { MyCalendar } from "../Components/Calendar";
import { PostList } from "../Components/PostList";
import { YearOverviewChart } from "../Components/YearOverviewChart";
import { useState } from "react";

export const HomePage = () => {
  const [showCalendar, setShowCalendar] = useState<Boolean>(false)
  const [showPostList, setShowPostList] = useState<Boolean>(true)
  const [showYearOverviewChart, setShowYearOverviewChart] = useState<Boolean>(false)

  const handleViewClick = (view:string) => {
    if (view === "PostList") {
      setShowPostList(true)
      setShowCalendar(false)
      setShowYearOverviewChart(false)
    } else if (view === "MyCalendar") {
      setShowPostList(false)
      setShowCalendar(true)
      setShowYearOverviewChart(false)
    } else if (view === "YearOverviewChart") {
      setShowPostList(false)
      setShowCalendar(false)
      setShowYearOverviewChart(true)
    }
  }

  return (
    <div>
      <h1>Home Page</h1>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button className="btn btn-secondary" onClick={()=>{handleViewClick("PostList")}}>List</button>
        <button className="btn btn-secondary" onClick={()=>{handleViewClick("MyCalendar")}}>Calendar</button>
        <button className="btn btn-secondary" onClick={()=>{handleViewClick("YearOverviewChart")}}>Year</button>
      </div>
      {showPostList && <PostList />}
      {showCalendar && <MyCalendar />}
      {showYearOverviewChart && <YearOverviewChart />}
    </div>
  )
}
