import client from "../../client";
import { protectResolver } from "../user.utils";

export default {
  Query: {
    me: protectResolver(async (_, __, { loggedInUser }) =>
      client.user.findUnique({ where: { id: loggedInUser.id } })
    ),
  },
};
