import { MyCalendar } from "../Components/Calendar";
import { PostList } from "../Components/PostList";
import { YearOverviewChart } from "../Components/YearOverviewChart";
import { TodayView } from "../Components/TodayView";
import { useState } from "react";
import { ButtonGroup, Button, Tab } from "react-bootstrap";

export const HomePage = () => {
  const [activeView, setActiveView] = useState("TodayView");

  const handleViewClick = (view:string) => {
    setActiveView(view);
  };

  return (
    <div className="home-page">
      <div className="navigation-buttons d-flex justify-content-center mt-3">
        <ButtonGroup aria-label="Home page tab options">
          <Button
            variant="secondary"
            onClick={() => {
              handleViewClick("TodayView");
            }}
            active={activeView === "TodayView"}
            aria-label="Today's Quote"
          >
            Today
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              handleViewClick("PostList");
            }}
            active={activeView === "PostList"}
            aria-label="List of Quotes"
          >
            List
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              handleViewClick("MyCalendar");
            }}
            active={activeView === "MyCalendar"}
            aria-label="Calendar of Quotes"
          >
            Calendar
          </Button>
          {/* <Button
            variant="secondary"
            onClick={() => {
              handleViewClick("YearOverviewChart");
            }}
            active={activeView === "YearOverviewChart"}
          >
            Year
          </Button> */}
        </ButtonGroup>
      </div>
      <Tab.Container activeKey={activeView}>
        <Tab.Content>
          <Tab.Pane eventKey="TodayView" aria-label="Quote of the Day">
            <TodayView />
          </Tab.Pane>
          <Tab.Pane eventKey="PostList" aria-label="List of Quotes">
            <PostList />
          </Tab.Pane>
          <Tab.Pane eventKey="MyCalendar" aria-label="Quote Calendar">
            <MyCalendar />
          </Tab.Pane>
          {/* <Tab.Pane eventKey="YearOverviewChart">
            <YearOverviewChart />
          </Tab.Pane> */}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
