import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { Base_url } from "../utils/BASE_URL";

const UserCard = ({ user, fetchNextUser }) => {
  const { id, first_name, last_name, photo_url, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      // Send a request to the backend to update the status
      const res = await axios.post(
        `${Base_url}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));

      // Call fetchNextUser to re-fetch the next user
      fetchNextUser(); // This will increment the page number and trigger a re-fetch
    } catch (err) {
      console.error("Error sending request", err);
      // Handle error here
    }
  };

  return (
    <div className="card bg-base-300 w-96 mt-6 shadow-xl mb-auto">
      <figure>
        <img className="w-fit mt-4" src={photo_url} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{first_name + " " + last_name}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <></>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => handleSendRequest("ignored", id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => handleSendRequest("interested", id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
