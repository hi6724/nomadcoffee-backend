import client from "../../client";

export default {
  Query: {
    seeCoffeeShop: async (_, { id }) => client.coffeeShop.findUnique({ where: { id } }),

    seeCoffeeShops: async (_, { page }) => {
      const totalPages = await client.coffeeShop.count();
      const coffeeShops = client.coffeeShop.findMany({
        skip: (page - 1) * 3,
        take: 3,
        orderBy: {
          id: "desc",
        },
      });
      return {
        CoffeeShops: coffeeShops,
        totalPages: Math.ceil(totalPages / 3),
      };
    },
  },
};
