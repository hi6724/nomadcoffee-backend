import client from "../../client";

export default {
  Query: {
    seeCoffeeShop: async (_, { id }) =>
      client.coffeeShop.findUnique({ where: { id } }),

    seeCoffeeShops: async (_, { lastId }) =>
      client.coffeeShop.findMany({
        skip: lastId !== 0 ? 1 : 0,
        take: 5,
        ...(lastId !== 0 && { cursor: { id: lastId } }),
      }),
  },
};
