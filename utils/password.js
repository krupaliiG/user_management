import { hash, genSalt, compare } from "bcrypt";

const hashPassword = async (password) => {
  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  return hashPassword;
};

const comparePassword = async (passwordAttempt, hashedPassword) => {
  const comparePass = await compare(passwordAttempt, hashedPassword);
  return comparePass;
};

export default { hashPassword, comparePassword };
