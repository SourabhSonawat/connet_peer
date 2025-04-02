const validateUser = (email, password) => {
  const validEmail = typeof email === "string" && email.trim() !== "";
  const validPassword =
    typeof password === "string" && password.trim().length > 8;
  return validEmail && validPassword;
};

export default validateUser;
