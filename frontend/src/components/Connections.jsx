import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";
import { Base_url } from "../utils/BASE_URL";
const Connections = () => {
  const [loading, setLoading] = useState(true); // Add a loading state
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  // Fetch connections data from the backend
  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${Base_url}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // If loading, display loading message or spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-black">
        Loading connections...
      </div>
    );
  }

  // If no connections found
  if (connections.length === 0) {
    return (
      <h1 className="h-screen flex items-center justify-center text-xl text-black">
        No Connections Found
      </h1>
    );
  }

  return (
    <div className="text-center my-10 px-4">
      <h1 className="font-bold text-white text-3xl">Connections</h1>

      {connections.map((connection) => {
        const { id, first_name, last_name, photo_url, age, gender, about } =
          connection;

        return (
          <div
            key={id}
            className="bg-gradient-to-b from-black to-gray-800 flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg w-full sm:w-3/4 md:w-1/2 mx-auto mt-4 relative"
          >
            <div className="mb-4 sm:mb-0">
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photo_url}
              />
            </div>

            <div className="text-center sm:text-left mx-4 flex-1">
              <h2 className="font-bold text-xl bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text">
                {first_name + " " + last_name}
              </h2>
              {age && gender && (
                <p className="text-gray-400">{age + ", " + gender}</p>
              )}
              <p className="text-gray-500">{about}</p>
            </div>

            <Link to={"/chat/" + id}>
              <button className="mt-4 sm:mt-0 sm:absolute sm:right-4 btn btn-accent btn-outline">
                Chat
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
