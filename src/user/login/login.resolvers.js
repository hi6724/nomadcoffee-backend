import bcrypt from "bcrypt";
import client from "../../client";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // Find user
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: "User not found" };
      }
      //Check password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return { ok: false, error: "Incorrect password" };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
