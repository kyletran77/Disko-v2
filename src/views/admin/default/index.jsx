import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

import { auth } from "../../../firebase/firebase";
import { useSelector } from "react-redux";
import { getUser } from "../../../firebase/firebase-calls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  //Data from the old dashboard
  const options = { month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric'};

  const {allCircles} = useSelector((State) => State.allCircles);
  const [userData, setUserData] = useState([])

  //add check for authentication
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {navigate("/auth")}
  //
  const currentUser = auth?.currentUser
  console.log("current user:" + currentUser.displayName);

  var eventViews = 0;
  var responses = 0;
  var yes = 0;
  var no = 0;
  var maybe = 0;
  var allResponses = []

  const filteredCircles = allCircles?.filter(
      (circle) => circle.circleCreator === currentUser?.uid
  );
  
  filteredCircles.map((circle)=>{
      eventViews+=circle.views;
      responses+=circle.memberCount.length;
      allResponses.push(circle.memberCount)
     
  })

  allResponses = allResponses.flatMap(array => array)
  allResponses.forEach((response) => {
      const choice = response.response;
      if (choice === "Yes") {
        yes += 1;
      } else if (choice === "No") {
        no += 1;
      } else if (choice === "Maybe") {
        maybe += 1;
      }
    });

  const { maxCircle, maxRatio } = filteredCircles.reduce((acc, circle) => {
      const ratio = circle.memberCount.length / circle.views;
      if (ratio > acc.maxRatio) {
        return { maxCircle: circle?.circleName, maxRatio: ratio };
      } else {
        return acc;
      }
    }, { maxCircle: null, maxRatio: 0 });
    useEffect(
      () => {
        if (userData.length == 0) {
          getUser(currentUser, setUserData);
          
        }
      },
      // eslint-disable-next-line
      [currentUser]
    );
  
console.log(eventViews)

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
      <Widget
      icon={<MdBarChart className="h-7 w-7" />}
      title={"Profile Views"}
      subtitle={userData?.views ? userData.views : 0}
    />
    <Widget
      icon={<IoDocuments className="h-6 w-6" />}
      title={"Event Views"}
      subtitle={eventViews}
    />
    <Widget
      icon={<MdBarChart className="h-7 w-7" />}
      title={"Event Responses"}
      subtitle={responses}
    />
    <Widget
      icon={<MdDashboard className="h-6 w-6" />}
      title={"CTR (Click Through Rate)"}
      subtitle={`${(responses/eventViews * 100).toFixed(2)}%`}
    />
    <Widget
      icon={<MdBarChart className="h-7 w-7" />}
      title={"Number of Events"}
      subtitle={filteredCircles?.length}
    />
    <Widget
      icon={<IoMdHome className="h-6 w-6" />}
      title={"Best CTR Event"}
      subtitle={`${maxCircle} @ ${(maxRatio * 100).toFixed(2)}% CTR`}
    />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
