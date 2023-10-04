import { Request, Response } from "express";
import { User, userFunctions } from "../model/userModel";

/**
 * Creates a new user
 *
 * @param req Incoming HTTP request with the user's credentials
 * @param res Outgoing HTTP response indicating success of user creation
 */
export const register = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.userid;
    const username = req.body.username;
    const user_role = req.body.user_role;

    const user: User = {
      user_id,
      username,
      user_role,
    };

    await userFunctions.insertUser(user);
    return res.status(200).json({ message: "User registered " + user.user_id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while registering user" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;
    const user = await userFunctions.getUserById(user_id);
    if (!user) {
      const newUser: User = {
        user_id: user_id,
        username: "Your_Username",
        user_role: "User",
      };
      await userFunctions.insertUser(newUser);
      res
        .status(200)
        .json({ username: newUser.username, user_role: newUser.user_role });
    } else {
      res
        .status(200)
        .json({ username: user.username, user_role: user.user_role });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retreiving profile." });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;
    const user = await userFunctions.getUserById(user_id);
    if (!user) {
      res.status(200).json({ user_role: "User" });
    } else {
      res.status(200).json({ user_role: user.user_role });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retreiving user role." });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;

  try {
    const user = await userFunctions.getUserById(user_id);

    if (!user) {
      res.status(201).json({ message: "Successfully deleted profile" });
    } else {
      const result = await userFunctions.deleteUserById(user_id);
      res.status(201).json({ message: "Successfully deleted profile" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the profile." });
  }
};

export const changeUsername = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;
  const { newUsername } = req.body;

  try {
    const result = await userFunctions.updateUsername(user_id, newUsername);

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: error });
  }
};
