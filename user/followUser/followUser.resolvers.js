import client from "../../client";
import { protectResolver } from "../user.utils";

export default {
  Mutation: {
    followUser: protectResolver(async (_, { username }, { loggedInUser }) => {
      const ok = await client.user.findUnique({ where: { username } });
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist",
        };
      }
      if (username === loggedInUser.username) {
        return {
          ok: false,
          error: "Cannot follow myself",
        };
      }
      await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            connect: {
              username,
            },
          },
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
