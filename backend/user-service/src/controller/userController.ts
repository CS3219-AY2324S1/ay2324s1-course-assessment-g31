import { Request, Response } from "express";
import { AccountType, User, userFunctions } from "../model/userModel";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new user
 *
 * @param req Incoming HTTP request with the user's credentials
 * @param res Outgoing HTTP response indicating success of user creation
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Parameters for users table
    const user_id = uuidv4();
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // TODO: Not sure how future implementation of admin vs user role. By default is user role
    const account_type: AccountType = "User";

    // TODO: should only email be unique or username as well
    const emailTaken = await userFunctions.isEmailTaken(email);

    if (emailTaken) {
      return res.status(400).json({ message: "That email is already in use" });
    }

    const hashed_pw = await bcrypt.hash(password, 8);
    const user: User = {
      user_id,
      account_type,
      username,
      email,
      hashed_pw,
    };

    const userInsertResult = await userFunctions.insertUser(user);
    return res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while registering user" });
  }
};

/**
 * Attempts to login a user and authorizes the user if successful
 *
 * @param req Incoming HTTP request with the user's credentials
 * @param res Outgoing HTTP response indicating success of user login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userFunctions.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashed_pw);

    if (passwordMatch) {
      // TODO: Generate session token for user

      res.status(200).json({ user_id: user.user_id });
    } else {
      res.status(400).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;
    const user = await userFunctions.getUserById(user_id);

    if (!user) {
      return res.status(400).json({ message: "User profile does not exists." });
    }

    // TODO: should we pass hashed_pw
    const username = user.username;
    const email = user.email;
    const hashed_pw = user.hashed_pw;

    res
      .status(200)
      .json({ username: username, email: email, hashedPassword: hashed_pw });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retreiving profile." });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;

  try {
    const result = await userFunctions.deleteUserById(user_id);

    res.status(201).json({ message: "Successfully deleted profile" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the profile." });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;
  const { email, username } = req.body;

  try {
    const result = await userFunctions.updateUserProfile(
      user_id,
      email,
      username
    );

    return res.status(201).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to update profile: ", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const result = await userFunctions.changeUserPassword(
      user_id,
      oldPassword,
      newPassword
    );

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: error });
  }
};
