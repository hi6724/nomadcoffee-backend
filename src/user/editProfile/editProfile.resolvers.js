import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";
import { protectResolver } from "../user.utils";
import fs from "fs";
import { deleteFileS3, uploadToS3 } from "../../shared/shared.utils";

export default {
  Mutation: {
    editProfile: protectResolver(
      async (_, { avatarURL, name, location, password: newPassword, bio }, { loggedInUser }) => {
        let newAvatarURL = null;
        if (avatarURL) {
          if (loggedInUser.avatarURL) {
            await deleteFileS3(loggedInUser.avatarURL, "avatars");
          }
          newAvatarURL = await uploadToS3(avatarURL, loggedInUser.id, "avatars");
          console.log(newAvatarURL);
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
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
