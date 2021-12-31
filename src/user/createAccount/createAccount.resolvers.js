import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (_, { name, username, password, location, email }) => {
      try {
        const existUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existUser) {
          throw new Error("This username/password is already taken.");
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            name,
            username: username.toLowerCase(),
            password: uglyPassword,
            location,
            email,
          },
        });
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
        };
      }
    },
  },
};
