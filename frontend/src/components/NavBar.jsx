import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { Base_url } from "../utils/BASE_URL";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${Base_url}/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar bg-[#6A50A7] text-black ">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-2xl font-semibold font-serif"
        >
          PeerConnect
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control">Welcome, {user.first_name}</div>
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.photo_url} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white  rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections </Link>
              </li>

              <li>
                <Link to="/requests">Requests</Link>
              </li>

              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavBar;
