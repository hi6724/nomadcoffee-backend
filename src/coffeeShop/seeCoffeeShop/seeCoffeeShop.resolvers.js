import client from "../../client";

export default {
  Query: {
    seeCoffeeShop: async (_, { id }) => client.coffeeShop.findUnique({ where: { id } }),

    seeCoffeeShops: async (_, { offset }) => {
      const coffeeShops = client.coffeeShop.findMany({
        skip: offset,
        take: 3,
        orderBy: {
          id: "desc",
        },
      });
      return coffeeShops;
    },
  },
};
