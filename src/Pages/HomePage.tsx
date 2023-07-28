import { MyCalendar } from "../Components/Calendar";
import { PostList } from "../Components/PostList";
import { YearOverviewChart } from "../Components/YearOverviewChart";
import { useState } from "react";
import { ButtonGroup, Button, Tab, Tabs } from "react-bootstrap";

export const HomePage = () => {
  const [activeView, setActiveView] = useState("PostList");

  const handleViewClick = (view:string) => {
    setActiveView(view);
  };

  return (
    <div className="home-page">
      <ButtonGroup aria-label="Basic example">
        <Button
          variant="secondary"
          onClick={() => {
            handleViewClick("PostList");
          }}
          active={activeView === "PostList"}
        >
          List
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleViewClick("MyCalendar");
          }}
          active={activeView === "MyCalendar"}
        >
          Calendar
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleViewClick("YearOverviewChart");
          }}
          active={activeView === "YearOverviewChart"}
        >
          Year
        </Button>
      </ButtonGroup>
      <Tab.Container activeKey={activeView}>
        <Tab.Content>
          <Tab.Pane eventKey="PostList">
            <PostList />
          </Tab.Pane>
          <Tab.Pane eventKey="MyCalendar">
            <MyCalendar />
          </Tab.Pane>
          <Tab.Pane eventKey="YearOverviewChart">
            <YearOverviewChart />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
