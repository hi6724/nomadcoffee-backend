import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";
import { protectResolver } from "../user.utils";
import fs from "fs";

export default {
  Mutation: {
    editProfile: protectResolver(
      async (
        _,
        {
          avatarURL,
          username,
          email,
          name,
          location,
          password: newPassword,
          bio,
        },
        { loggedInUser }
      ) => {
        let newAvatarURL = null;
        if (avatarURL) {
          const { filename, createReadStream } = await avatarURL;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = fs.createWriteStream(
            process.cwd() + "/tempUpload/" + newFilename
          );
          readStream.pipe(writeStream);
          newAvatarURL = `http://localhost:4000/static/${newFilename}`;
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            username,
            email,
            name,
            location,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(newAvatarURL && { avatarURL: newAvatarURL }),
          },
        });
        if (updatedUser.id) {
          return { ok: true };
        } else {
          return { ok: false, error: "Could not update profile" };
        }
      }
    ),
  },
};
