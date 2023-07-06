import { configureStore } from "@reduxjs/toolkit";
import userReducer from "features/user/userSlice";
import allPostsReducer from "features/allPosts/allPostsSlice";
import usersReducer from "features/allUsers/usersSlice";
import allCirclesReducer from "features/allCircle/circleSlice"
import allFeedReducer from "features/allFeed/allFeedSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    allPosts: allPostsReducer,
    allUsers: usersReducer,
    allCircles: allCirclesReducer,
    allFeed: allFeedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //Ignored Paths but wildcard is not working
        ignoredPaths: ['allCircles.allCircles.1.date'],



      },
    }),
});
