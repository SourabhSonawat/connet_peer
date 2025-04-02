import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { Base_url } from "../utils/BASE_URL";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1); // Keep track of the current page
  const [loading, setLoading] = useState(true); // Loading state to track fetch status

  // Fetch feed based on the page number
  const getFeed = async () => {
    setLoading(true); // Set loading to true when the fetch starts
    try {
      const res = await axios.get(
        `${Base_url}/user/feed?page=${page}&limit=1`,
        {
          withCredentials: true,
        }
      );
      dispatch(addFeed(res?.data?.data)); // Update the feed with the new data
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false); // Set loading to false after the fetch is completed
    }
  };

  // Fetch the feed when the component mounts or when the page changes
  useEffect(() => {
    getFeed();
  }, [page]);

  // Function to fetch the next user after accepting or ignoring
  const fetchNextUser = () => {
    setPage(page + 1); // Move to the next page when a user is accepted or ignored
  };

  // Handle the case when no feed data is available or still loading
  if (loading) {
    return <h1 className="flex justify-center my-10">Loading...</h1>; // Show loading state while fetching
  }

  if (!feed || feed.length === 0) {
    return <h1 className="flex justify-center my-10">No new users found!</h1>; // Show message if no feed data
  }

  return (
    <div className="flex justify-center my-10 h-screen">
      {feed[0] && <UserCard user={feed[0]} fetchNextUser={fetchNextUser} />}
    </div>
  );
};

export default Feed;
