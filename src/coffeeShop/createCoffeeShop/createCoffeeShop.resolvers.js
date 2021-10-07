import client from "../../client";
import { protectResolver } from "../../user/user.utils";

export default {
  Mutation: {
    createCoffeeShop: protectResolver(
      async (
        _,
        { name, latitude, longitude, photos, categories },
        { loggedInUser }
      ) => {
        let categoryObj;
        let photoObj;
        const ok = await client.coffeeShop.findFirst({ where: { name } });
        if (ok) {
          return {
            ok: false,
            error: "This name is already exist",
          };
        }
        if (categories) {
          categoryObj = categories.map((category) => ({
            where: { name: category },
            create: { name: category, slug: category },
          }));
        }
        if (photos) {
          photoObj = photos.map((photo) => ({ url: photo }));
        }
        await client.coffeeShop.create({
          data: {
            name,
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
