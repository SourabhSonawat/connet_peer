import axios from "axios";
// import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import { Base_url } from "../utils/BASE_URL";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, id) => {
    try {
      const res = axios.post(
        // BASE_URL + "/request/review/" + status + "/" + _id,
        `${Base_url}/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${Base_url}/user/requests/received`, {
        withCredentials: true,
      });

      console.log("fethingRequest", res);
      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-black font-serif font-semibold h-screen ">
        No Requests Found
      </h1>
    );

  return (
    <div className="text-center my-10 h-screen    ">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

      {requests.map((request) => {
        const {
          request_id,
          first_name,
          last_name,
          photo_url,
          age,
          gender,
          about,
        } = request;
        // const { id, first_name, last_name, photo_url, age, gender, about } =
        //   request.fromUserId;

        return (
          <div
            key={request_id}
            className=" flex justify-between items-center m-4 p-4 rounded-lg bg-base-300  mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20  rounded-full"
                src={photo_url}
              />
            </div>
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {first_name + " " + last_name}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <div>
              <button
                className="btn btn-outline btn-primary mx-2"
                onClick={() => reviewRequest("rejected", request.request_id)}
              >
                Reject
              </button>
              <button
                className="btn btn-outline btn-secondary mx-2"
                onClick={() => reviewRequest("accepted", request.request_id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
