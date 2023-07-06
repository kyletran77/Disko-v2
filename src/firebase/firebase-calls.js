import { login, updateDP } from "features/user/userSlice";
import { signInWithEmailAndPassword, signInWithPhoneNumber, updateProfile,RecaptchaVerifier } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


import toast from "react-hot-toast";
import { auth, db, storage } from "./firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment, 
} from "firebase/firestore";

const allPostsCollection = collection(db, "allPosts");
const usersCollection = collection(db, "users");
const allCircles = collection(db, "allCircles");
const allFeed = collection(db, "allFeed");


const date = new Date().toLocaleDateString("en-IN", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const userLogin = async (
  email,
  password,
  dispatch,
  lastLocation,
  navigate
) => {
  try {
    const loader = toast.loading("Signing you in..");
    const userAuth = await signInWithEmailAndPassword(auth, email, password);
    dispatch(
      login({
        email: userAuth.user.email,
        uid: userAuth.user.uid,
        displayName: userAuth.user.displayName,
        photoURL: userAuth.user.photoURL,
      })
    );
    localStorage.setItem("authToken", userAuth.user.accessToken);
    toast.success(`Welcome back, ${userAuth.user.displayName}!`, {
      id: loader,
    });
    navigate(lastLocation);
  } catch (error) {
    toast.error("Couldn't log you in!");
    console.log(error.message);
  }
};
export const phoneLogin = async (
  phoneNumber,
  userID,
  name,
  dispatch,
) => {
  try {
    dispatch(
      login({
        phone: phoneNumber,
        id: userID
      })
    );
    await setDoc(
      doc(db, "users", userID),
      {
        uid: userID,
        bio: "Building things 🚀",
        phone: phoneNumber,
        joinedCircle: [],
        name: name,
        socials:[],
        coverPic:"https://firebasestorage.googleapis.com/v0/b/jooby-b9791.appspot.com/o/images%2Fundefined%2Fuser_default.png?alt=media&token=7df8b561-4914-4742-9bd6-0bccbf0e27af",
        followers: [],
        following: [],
      });

    toast.success(`Welcome, ${userID}!`, {
    });
  } catch (error) {
    toast.error("Couldn't log you in!");
    console.log(error.message);
  }
};



export const getUser = async (user, setUserData) => {
  try {
    const userDoc = doc(usersCollection, user?.uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("Could not retrieve user data");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const profileUpdate = async (
  userInfo,
  userData,
  currentUser,
  dispatch
) => {try{ await setDoc(
  doc(db, "users", currentUser?.uid),
  {
    coverPic: userInfo?.coverPic
      ? userInfo?.coverPic
      : userData.coverPic ?? "",
    bio: userInfo?.bio ? userInfo?.bio : userData.bio ?? "",
    name: userInfo?.name ? userInfo?.name : userData.name ?? "",
    Instagram: userInfo?.Instagram
? userInfo?.Instagram
: userData.Instagram ?? "",
Snapchat: userInfo?.Snapchat
? userInfo?.Snapchat
: userData.Snapchat ?? "",
LinkedIn: userInfo?.LinkedIn
? userInfo?.LinkedIn
: userData.LinkedIn ?? "",
Website: userInfo?.Website
? userInfo?.Website
: userData.Website ?? "",
Discord: userInfo?.Discord
? userInfo?.Discord
: userData.Discord ?? "",


  
  },
  { merge: true }
);
console.log(userInfo)
}

catch(e){
  toast.error("Couldn't update")
  console.log(e)
}
}
 

export const addSocials = async (
  currentUser,
  link
) => {
  try{await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      socials: arrayUnion(link)
    },
    { merge: true }
  );
  toast.success("Post sent." + link);

}
  catch(e){
    toast.error("failed"+ link)
  }
};

export const experienceAdd = async (
  currentUser,
  userData,
  userInfo,
  dispatch
) => {
  await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      experience: arrayUnion({"jobTitle":userInfo?.jobTitle, 
      "company":userInfo?.company, "workDates":userInfo?.workDates, 
      "description":userInfo?.description, "companyLogo": userInfo?.companyLogo})
    },
    { merge: true }
  );
  await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      allExp: arrayUnion({"jobTitle":userInfo?.jobTitle, 
      "company":userInfo?.company,
      "type": "Experience"
    })
    },
    { merge: true }
  );
  await updateProfile(currentUser, {
    photoURL: userData.avatar,
  });

  dispatch(updateDP(userData.avatar));
  console.log("Experience Added!")

};

export const educationAdd = async (
  currentUser,
  userData,
  userInfo,
  dispatch
) => {
  await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      education: arrayUnion({"jobTitle":userInfo?.jobTitle, 
      "company":userInfo?.company, "workDates":userInfo?.workDates, 
      "description":userInfo?.description, "companyLogo": userInfo?.companyLogo})
    },
    { merge: true }
  );
  await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      allExp: arrayUnion({"jobTitle":userInfo?.jobTitle, 
      "company":userInfo?.company,
      "type": "Education"
    })
    },
    { merge: true }
  );
  await updateProfile(currentUser, {
    photoURL: userData.avatar,
  });
  dispatch(updateDP(userData.avatar));
  console.log("Education Added!")

};
export const uploadImage = async (user, file) => {
  try {
    const path = `images/${user?.uid}/${file?.name}`;
    const imageRef = ref(storage, path);
    const response = file && (await uploadBytesResumable(imageRef, file));
    const pathName = response?.ref;
    const url = await getDownloadURL(pathName);
    return url;
  } catch (error) {
    toast.error("Could not upload image!");
    console.log(error.message);
  }
};

export const createPost = async (user, post) => {
  try {
    const loader = toast.loading("Posting...");
    const postDoc = await addDoc(allPostsCollection, {
      author: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      caption: post.caption,
      createdAt: new Date().toLocaleString(),
      imageURL: post.imageURL,
      company: post.company,
      likes: [],
      comments: [],
    });

    await setDoc(
      doc(allPostsCollection, postDoc.id),
      {
        postID: postDoc.id,
      },
      { merge: true }
    );
    toast.success("Post sent.", { id: loader });
  } catch (error) {
    toast.error("Post not sent. Try again!");
  }
};
export const createFeed = async (user, post) => {
  try {
    const userDoc = doc(usersCollection, user);
    const docSnap = await getDoc(userDoc);
    const userData = docSnap.data();
   

    const postDoc = await addDoc(allFeed, {
      author: userData.name,
      uid: userData.uid,
      photoURL: userData.coverPic,
      caption: post.caption,
      createdAt: new Date().toLocaleString(),
      eventPic: post?.eventPic,
      eventName: post.eventName,
      eventID: post.eventID,
      likes: [],
      comments: [],
    });

    await setDoc(
      doc(allFeed, postDoc.id),
      {
        postID: postDoc.id,
      },
      { merge: true }
    );
    toast.success("added")
  } catch (error) {
    toast.error("Not added to feed")
    console.log(error)
  }
};

export const editPost = async (post, updatePost) => {
  try {
    await setDoc(
      doc(allPostsCollection, post.postID),
      {
        caption: updatePost.caption,
        imageURL: updatePost.imageURL,
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't update post. Try again!");
  }
};

export const deletePost = async (post) => {
  try {
    await deleteDoc(doc(allPostsCollection, post.postID));
    toast.success("Post deleted");
  } catch (error) {
    toast.error("Couldn't delete post. Try again!");
  }
};

export const likePost = async (postID, user) => {
  try {
    await setDoc(
      doc(allPostsCollection, postID),
      {
        likes: arrayUnion({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't like post. Try again!");
  }
};

export const dislikePost = async (postID, user) => {
  try {
    await setDoc(
      doc(allPostsCollection, postID),
      {
        likes: arrayRemove({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't dislike post. Try again!");
  }
};

export const postComment = async ({ postID }, comment, user, currentCircle) => {
  try {
    console.log(postID);
    await setDoc(
      doc(allPostsCollection, postID),
      {
        comments: arrayUnion({
          avatar: user.coverPic,
          displayName: user.name,
          userID: user.uid,
          comment: comment,
          date: date,
        }),
      },
      { merge: true }
    );
    const feedData = {caption: `${comment} to ${currentCircle?.circleName}!`, eventName: currentCircle.circleName, eventID:currentCircle.circleID, eventPic: currentCircle.pic}
    createFeed(user.uid, feedData);
    
  } catch (error) {
    // toast.error("Couldn't post the comment. Try again!");
    console.log(error);
  }
};
export const postCommentOpportunities = async ({ postID }, comment, user) => {
  try {
    console.log(postID);
    await setDoc(
      doc(allCircles, postID),
      {
        comments: arrayUnion({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
          comment: comment,
          date: date,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't post the comment. Try again!");
    console.log(error);
  }
};

export const deleteComment = async (post, comment) => {
  try {
    await setDoc(
      doc(allPostsCollection, post.postID),
      {
        comments: arrayRemove(comment),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't delete the comment. Try again!");
  }
};

export const followUser = async (currentUser, userToFollow) => {
  try {
    await setDoc(
      doc(collection(db, "users"), currentUser?.uid),
      {
        following: arrayUnion(userToFollow.uid),
      },
      { merge: true }
    );
    await setDoc(
      doc(collection(db, "users"), userToFollow.uid),
      {
        followers: arrayUnion(currentUser?.uid),
      },
      { merge: true }
    );
    toast.success(`You are now following ${userToFollow.name}`);
  } catch (error) {
    console.log(error)
    toast.error(`Couldn't follow ${userToFollow.name}. Try again!`);
  }
};

export const unfollowUser = async (currentUser, userToUnfollow) => {
  try {
    await setDoc(
      doc(collection(db, "users"), currentUser?.uid),
      {
        following: arrayRemove(userToUnfollow.uid),
      },
      { merge: true }
    );

    await setDoc(
      doc(collection(db, "users"), userToUnfollow.uid),
      {
        followers: arrayRemove(currentUser?.uid),
      },
      { merge: true }
    );
    toast.success(`Unfollowed ${userToUnfollow.name}`);
  } catch (error) {
    console.log(error)
    toast.error(`Couldn't unfollow ${userToUnfollow.name}. Try again!`);
  }
};

export const archivePost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        archives: arrayUnion(post),
      },
      { merge: true }
    );
    await deleteDoc(doc(allPostsCollection, post.postID));
    toast.success("Post archived");
  } catch (error) {
    toast.error("Couldn't archive post. Try again!");
  }
};

export const unarchivePost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        archives: arrayRemove(post),
      },
      { merge: true }
    );
    await setDoc(doc(allPostsCollection, post.postID), post, { merge: true });
    toast.success("Post unarchived");
  } catch (error) {
    toast.error("Couldn't unarchive post. Try again!");
  }
};

export const bookmarkPost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        bookmarks: arrayUnion(post),
      },
      { merge: true }
    );
    toast.success("Post bookmarked");
  } catch (error) {
    toast.error("Couldn't bookmark post. Try again!");
  }
};

export const undoBookmarkPost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        bookmarks: arrayRemove(post),
      },
      { merge: true }
    );
    toast.success("Removed from bookmarks");
  } catch (error) {
    toast.error("Couldn't remove from bookmarks. Try again!");
  }
};
//         Firebase Calls for Circles Section
 
//getCircle --> Obtains Circle Data
/* Takes ID and creates entire circle */
export const getCircle = async (circle, setCircleData) => {
  try {
    const circleDoc = doc(collection(db, "allCircles"), circle);
    const docSnap = await getDoc(circleDoc);
    if (docSnap.exists()) {
      setCircleData(docSnap.data());
    } else {
      console.log("Could not retrieve circle data");
    }
  } catch (error) {
    console.log(error);
  }
 };
  
 //Create Circle
 export const createCircle = async (currentUser, circleData, date, start, end) => {
  try {
    //UI
    const loader = toast.loading("Creating Circle...");
  
    //Create Blank Circles
    const circleDoc = await addDoc(collection(db, "allCircles"), {
      circleName: circleData?.title,
      circleBio: circleData?.address,
      circleDescription: circleData?.description,
      circleCosts: circleData?.costs,
      circleCreator: currentUser?.uid,
      memberCount: [],
      creatorName: currentUser?.name,
      creatorPic: currentUser?.coverPic,
      hostPhone: currentUser?.phone,
      pic: circleData?.coverPic,
      date: date,
      createdAt: new Date().toLocaleString(),
      views: 0,
      start: start.toLocaleString(),
      end: end.toLocaleString(),
    });
  
    await setDoc (
      doc(collection(db, "allCircles"), circleDoc.id), {
        circleID: circleDoc.id,
        memberCount: arrayUnion({"uid": currentUser.uid, response: "Yes", number: currentUser.phone })
      },
      { merge: true }
    );

  const initialPostState = {
    author: currentUser?.name,
    uid: currentUser?.uid,
    imageURL: "",
    email: "",
    caption: "Chat",
    createdAt: "",
    imageURL: "",
    postID: "",
    company: "",
  };
  createQuestion(currentUser,circleDoc.id, initialPostState)
  await setDoc(
    doc(collection(db, "users"), currentUser?.uid),
    {
      joinedCircle: arrayUnion({"uid":circleDoc.id, "response": "Yes", number: currentUser.phone}),
    },
    { merge: true });

  
    //UI
    toast.success("Event created.", { id: loader }  );
  return circleDoc.id;

    } catch (error) {
      toast.error("Circle not created. Try again!");
  console.log(error)
    }
  };
  
 export const editCircle = async (
  userInfo,
  circleData,
  startTime,
  endTime,
  selectedDay,
  dispatch
 ) => {
  await setDoc (
    doc(db, "allCircles", circleData?.circleID),
    {
        pic: userInfo?.pic
  ? userInfo?.pic
  : circleData.pic ?? "",
  circleName: userInfo?.circleName
  ? userInfo?.circleName
  : circleData.circleName ?? "",
  circleCosts: userInfo?.circleCosts
  ? userInfo?.circleCosts
  : circleData.circleCosts ?? "",
  circleDescription: userInfo?.circleDescription
  ? userInfo?.circleDescription
  : circleData.circleDescription ?? "",
  start: startTime
  ? startTime.toLocaleString()
  : circleData.start ?? "",
  end: endTime
  ? endTime.toLocaleString()
  : circleData.end ?? "",
  date: selectedDay
  ? new Date(`${selectedDay.year}/${selectedDay.month}/${selectedDay.day}`)
  : circleData.date ?? "",
  
 },
  
    { merge: true }
  )
 // dispatch(updateDP(userData.avatar));
  };
  export const textBlast = async (currentCircle) => {
    const options = { month: 'long', day: 'numeric'};
    try{
      for(const user of currentCircle?.memberCount){
        if ('number' in user){
          await setDoc(
            doc(collection(db, "messages")),
            {
              to: `${user?.number}`,
              body: `I want to check if you are still going to ${currentCircle?.circleName} happening on ${new Date(currentCircle?.date?.seconds*1000).toLocaleString("en-US", options)}. If you change your mind, please change your RSVP here: https://disko.rsvp/circle/`+ currentCircle?.circleID,
              // body:  "https://disko.vercel.app/circle/"+ currentCircle?.circleID
            },
            { merge: true });
        }
      }
      toast.success("Message sent to Attendees")
    }
    catch(error){
      toast.error("Message not sent")
      console.log(error)}
  }

  
  export const joinCircle = async (currentUser, currentCircle, response, userData) => {
    const options = { month: 'long', day: 'numeric'};
    try {
      //if include both joined and no join, get the array and change to set
      if (currentCircle.memberCount.some(user => user.uid == currentUser.uid) ) {


        const memberCount = currentCircle.memberCount;

        //remove from array
        const filteredmembers = memberCount.filter(
          (member) => member.uid != currentUser.uid
        );
        console.log(filteredmembers);
        filteredmembers.push({"uid":currentUser.uid, "response": response, number: currentUser.phoneNumber})



        await setDoc(
          doc(collection(db, "allCircles"), currentCircle?.circleID),
          {
            memberCount: filteredmembers
          },
          { merge: true }
        );
        await setDoc(
          doc(collection(db, "users"), currentUser?.uid),
          {
            joinedCircle: arrayUnion({"uid":currentCircle?.circleID, "response": response, number: currentUser.phoneNumber}),
          },
          { merge: true });


      }
      else{
            //join based on the response
          await setDoc(
            doc(collection(db, "allCircles"), currentCircle?.circleID),
            {
              memberCount: arrayUnion({"uid":currentUser.uid, "response": response, number: currentUser.phoneNumber}),
            },
            { merge: true }
          );
      //users get to see their history
          await setDoc(
            doc(collection(db, "users"), currentUser?.uid),
            {
              joinedCircle: arrayUnion({"uid":currentCircle?.circleID, "response": response, number: currentUser.phoneNumber}),
            },
            { merge: true });

          }
  

  //Request into Messages for host
  if (response == "Yes" || response =="Maybe"){
        console.log("she said YES");
        
        await setDoc(
        doc(collection(db, "messages")),
        {
          to: `${currentCircle?.hostPhone}`,
          body: `Someone signed up to your event. Check out who it is: https://disko.rsvp/circle/`+ currentCircle?.circleID
        },
        { merge: true }
      );
      //messages for partyer
      await setDoc(
        doc(collection(db, "messages")),
        {
          to: `${currentUser?.phoneNumber}`,
          body: `You signed up to ${currentCircle?.circleName} happening on ${new Date(currentCircle?.date?.seconds*1000).toLocaleString("en-US", options)}. Visit the event flyer: https://disko.rsvp/circle/`+ currentCircle?.circleID,
          // body:  "https://disko.vercel.app/circle/"+ currentCircle?.circleID
        },
        { merge: true });
  }
    //end
      toast.success(`You said ${response} to ${currentCircle?.circleName}`);
      // const feedData = {caption: `I said ${response} to ${currentCircle?.circleName}!`, eventName: currentCircle.circleName, eventID:currentCircle.circleID, eventPic: currentCircle.pic}
      // createFeed(currentUser?.uid, feedData);
      // console.log("create Feed should have been called")
    } catch (error) {
      console.log('cant join')

      console.log(error);
      // navigate("/")
      console.log('cant join')
      // localStorage.setItem("prevPath", `/circle/${currentCircle.circleID}`);
      toast.error(`Couldn't follow ${currentCircle?.circleName}. Try again!`);


    }
  };

  export const viewCount = async(circleID) => {
    try{
        await updateDoc(
        doc(collection(db, "allCircles"), circleID),
        {
          views: increment(1)
        },
        { merge: true })
        console.log("count initiated")
      
     
    } catch (error){
      console.log(error)
    }
    
  }

  export const archiveCircle = async(circleID) => {
    try{
        await updateDoc(
        doc(collection(db, "allCircles"), circleID),
        {
          archive: true
        },
        { merge: true })
        toast.success("Event Archived!")
    } 
    catch (error){
      console.log(error)
    }
    
  }

  export const userViewCount = async(userID) => {
    try{
        await updateDoc(
        doc(collection(db, "users"), userID),
        {
          views: increment(1)
        },
        { merge: true })
      
     
    } catch (error){
      console.log(error)
    }
    
  }
  export const logReactionEyes = async(circleID) => {
    try{
        await updateDoc(
        doc(collection(db, "allCircles"), circleID),
        {
          eyesEmoji: increment(1)
        },
        { merge: true })
      
    } catch (error){
      console.log(error)
    }
    
  }
  export const logReactionAlarm = async(circleID) => {
    try{
        await updateDoc(
        doc(collection(db, "allCircles"), circleID),
        {
          alarmEmoji: increment(1)
        },
        { merge: true })
      
    } catch (error){
      console.log(error)
    }
  }
  export const logReactionFire = async(circleID) => {
    try{
        await updateDoc(
        doc(collection(db, "allCircles"), circleID),
        {
          fireEmoji: increment(1)
        },
        { merge: true })
      
    } catch (error){
      console.log(error)
    }
    
  }


export const createOpportunities = async (user, Circle, post) => {
  // try {
  //   const loader = toast.loading("Posting...");
  //   await setDoc(
  //     doc(collection(db, "allCircles"), Circle),
  //     {
  //       Opportunities: arrayUnion({
  //         author: user.displayName,
  //         uid: user.uid,
  //         photoURL: user.photoURL,
  //         caption: post.caption,
  //         createdAt: new Date().toLocaleString(),
  //         imageURL: post.imageURL,
  //         company: post.company,
  //         likes: [],
  //         comments: [],
  //         circleID: Circle
  //       }),
  //     },
  //     { merge: true }
  //   );

  //   toast.success("Opportunities sent.", { id: loader });
  //   completeChallenge(user, Circle);
  // } catch (error) {
  //   toast.error("Opportunities not sent. Try again!");
  //   console.log(error)
  // }
  try {
    // const loader = toast.loading("Posting...");
    const postDoc = await addDoc(allPostsCollection, {
      author: user.name,
      uid: user.uid,
      photoURL: user.coverPic,
      caption: post.caption,
      createdAt: new Date().toLocaleString(),
      imageURL: post.imageURL,
      company: post.company,
      likes: [],
      comments: [],
      circle: Circle,
      type: "Opportunities",

    });

    await setDoc(
      doc(allPostsCollection, postDoc.id),
      {
        postID: postDoc.id,
      },
      { merge: true }
    );
    // toast.success("Post sent.", { id: loader });
  } catch (error) {
    // toast.error("Post not sent. Try again!");
    console.log("chat section failed")
  }

};

//Opportunities



// Create Q & A
// use above as template
export const createQuestion = async (user, Circle, post) => {
  try {
    // const loader = toast.loading("Posting...");
    const postDoc = await addDoc(allPostsCollection, {
      author: user.name,
      uid: user.uid,
      photoURL: user.coverPic,
      caption: post.caption,
      createdAt: new Date().toLocaleString(),
      imageURL: post.imageURL,
      company: post.company,
      likes: [],
      comments: [],
      circle: Circle,
      type: "QA",

    });

    await setDoc(
      doc(allPostsCollection, postDoc.id),
      {
        postID: postDoc.id,
      },
      { merge: true }
    );
    // toast.success("Post sent.", { id: loader });
  } catch (error) {
    console.log(error)
    // toast.error("Post not sent. Try again!");
  }
};
export const updateDiamonds = async(circleID, diamond, engagementScore) => {
  try {
    await setDoc(
      doc(collection(db, "allCircles"), circleID),
      {
        diamondCount: diamond,
        challenges: [],
        engagement: 0,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error)
  }
  
  
}