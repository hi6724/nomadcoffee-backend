import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword, lastId }) => {
      const users = await client.user.findMany({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: {
          OR: [
            { username: { startsWith: keyword.toLowerCase() } },
            { username: { startsWith: keyword.toUpperCase() } },
          ],
        },
      });
      return users;
    },
  },
};
