import jwt from "jsonwebtoken";
import client from "../client";

export const getUSer = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const protectResolver = (resolvers) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "Please log in",
    };
  }
  return resolvers(root, args, context, info);
};
