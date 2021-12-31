import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../user/user.utils";

export default {
  Mutation: {
    createCoffeeShop: protectResolver(
      async (_, { name, latitude, longitude, photos, categories }, { loggedInUser }) => {
        let categoryObj = null;
        let unresolved;
        let photoObj = null;
        const ok = await client.coffeeShop.findFirst({ where: { name } });
        if (ok) {
          return {
            ok: false,
            error: "This name is already exist",
          };
        }
        if (categories) {
          categoryObj = categories.map((category) => ({
            where: { name: category.toLowerCase() },
            create: { name: category.toLowerCase(), slug: category.toLowerCase() },
          }));
        }
        if (photos) {
          unresolved = photos.map(async (photo) => {
            const photoUrl = await uploadToS3(photo, loggedInUser.id, "photos");
            console.log(photoUrl);
            return { url: photoUrl };
          });
          photoObj = await Promise.all(unresolved);
        }
        await client.coffeeShop.create({
          data: {
            name: name.toLowerCase(),
            latitude,
            longitude,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(categories && {
              categories: {
                connectOrCreate: categoryObj,
              },
            }),
            ...(photos && {
              photos: { createMany: { data: photoObj } },
            }),
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
