import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

import { auth } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { getUser } from "../../firebase/firebase-calls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Admin(props) {
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



  //end of old dashboard
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashb";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <div>all circles:           {filteredCircles.map((circle) => (
            <li className="my-1 flex items-center gap-1" key={circle.circleID}>
              <img
                src={
                  circle?.img
    
                }
                alt="user-dp"
                className="aspect-square h-9 w-fit rounded-full object-cover"
              />
              <div className="flex w-full items-center justify-between hover:bg-gray-200 rounded-lg">
                <div>

                  {/* <p className="text-xs text-gray-500">
                    @{otherUser?.email?.split("@")[0]}
                  </p> */}
                </div>
                {/* {user?.following?.some((id) => id === otherUser?.userID) ? (
                  <button
                    className="rounded-full border-2 border-transparent bg-blue-200 py-1 px-2 text-sm text-gray-700 hover:brightness-95"
                    onClick={() => handleFollow(auth?.currentUser, otherUser)}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="rounded-full  border-2 border-transparent bg-blue-500 py-1 px-2 text-sm text-gray-50 hover:brightness-90"
                    onClick={() => handleFollow(auth?.currentUser, otherUser)}
                  >
                    Follow
                  </button>
                )} */}
              </div>
            </li>
          ))}</div>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
