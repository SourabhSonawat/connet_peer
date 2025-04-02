import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Base_url } from "../utils/BASE_URL";
const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email_id || ""); // Added email field
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    console.log(user);

    try {
      const res = await axios.patch(
        `${Base_url}/profile/edit`,
        {
          first_name: firstName,
          last_name: lastName,
          email_id: email,
          photo_url: photoUrl,
          age,
          gender,
          about,
          skills,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(addUser(res?.data?.user));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Something went wrong.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center my-10 ">
        <div className="flex justify-center mx-10 sm:w-1/2">
          <div className="card bg-base-300 w-full  sm:w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                {/* First Name */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>

                {/* Last Name */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>

                {/* Email */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Email:</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled={true}
                    className="input input-bordered w-full"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                {/* Photo URL */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Photo URL:</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>

                {/* Age */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>

                {/* Gender */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender:</span>
                  </div>
                  <input
                    type="text"
                    value={gender}
                    className="input input-bordered w-full"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>

                {/* About */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>

                {/* Skills (optional, you can improve it with multi-select or tags if you want) */}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Skills:</span>
                  </div>
                  <input
                    type="text"
                    value={skills.join(", ")}
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setSkills(
                        e.target.value.split(",").map((skill) => skill.trim())
                      )
                    }
                  />
                </label>
              </div>

              {/* Error message */}
              <p className="text-red-500">{error}</p>

              {/* Save Button */}
              <div className="card-actions justify-center m-2">
                <button
                  className="btn btn-outline btn-secondary w-full"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display the updated user profile */}
        <div className="sm:w-1/2 sm:ml-10">
          <UserCard user={user} />
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
