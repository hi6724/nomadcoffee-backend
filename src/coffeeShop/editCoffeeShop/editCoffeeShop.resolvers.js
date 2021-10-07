import client from "../../client";
import { protectResolver } from "../../user/user.utils";

export default {
  Mutation: {
    editCoffeeShop: protectResolver(
      async (_, { id, name, photos, categories }, { loggedInUser }) => {
        let categoryObj;
        let photoObj;
        if (categories) {
          categoryObj = categories.map((category) => ({
            where: { name: category },
            create: { name: category, slug: category },
          }));
        }
        if (photos) {
          photoObj = photos.map((photo) => ({ url: photo }));
        }
        const oldCoffeeShop = await client.coffeeShop.findFirst({
          where: { id, userId: loggedInUser.id },
          include: {
            categories: {
              select: { name: true },
            },
            photos: true,
          },
        });
        if (!oldCoffeeShop) {
          return {
            ok: false,
            error: "Not allowed",
          };
        }
        await client.coffeeShop.update({
          where: { id },
          data: {
            name,
            ...(categories && {
              categories: {
                disconnect: oldCoffeeShop.categories,
                connectOrCreate: categoryObj,
              },
            }),
            ...(photos && {
              photos: {
                deleteMany: oldCoffeeShop.photos,
                createMany: { data: photoObj },
              },
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
