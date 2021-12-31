import client from "../client";

export default {
  CoffeeShop: {
    user: async ({ userId }) => {
      return await client.user.findUnique({ where: { id: userId } });
    },
    photos: ({ id }) => client.coffeeShopPhoto.findMany({ where: { coffeeShopId: id } }),
    categories: ({ id }) => client.category.findMany({ where: { shops: { some: { id } } } }),
  },
  Category: {
    totalShops: async ({ name }) => {
      console.log(name);
      return await client.coffeeShop.count({
        where: { categories: { some: { name } } },
      });
    },

    shops: ({ id }, { page }) => {
      if (page < 1) {
        page = 1;
      }
      return client.category.findUnique({ where: { id } }).shops({
        take: 9,
        skip: (page - 1) * 5,
      });
    },
  },
};
