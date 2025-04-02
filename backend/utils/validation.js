export const validateEditProfileData = (req) => {
  const {
    first_name,
    last_name,
    email_id,
    age,
    gender,
    photo_url,
    about,
    skills,
  } = req.body;

  if (!first_name || !last_name || !email_id || !gender) {
    return false;
  }

  if (age && age < 18) {
    return false;
  }

  return true;
};
