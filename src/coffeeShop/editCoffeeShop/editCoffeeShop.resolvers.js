import client from "../../client";
import { deleteFileS3, uploadToS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../user/user.utils";

export default {
  Mutation: {
    editCoffeeShop: protectResolver(
      async (_, { id, name, photos, categories }, { loggedInUser }) => {
        let categoryObj = null;
        let unresolved;
        let photoObj = null;
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
        if (categories) {
          categoryObj = categories.map((category) => ({
            where: { name: category },
            create: { name: category, slug: category },
          }));
        }

        if (photos) {
          if (oldCoffeeShop.photos.length > 0) {
            unresolved = oldCoffeeShop.photos.map(
              async (photo) => await deleteFileS3(photo.url, "photos")
            );
            await Promise.all(unresolved);
          }
          unresolved = photos.map(async (photo) => {
            const photoUrl = await uploadToS3(photo, loggedInUser.id, "photos");
            return { url: photoUrl };
          });
          photoObj = await Promise.all(unresolved);
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
