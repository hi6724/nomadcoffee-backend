import client from "../../client";

export default {
  Query: {
    searchCoffeeShop: (_, { name }) =>
      client.coffeeShop.findMany({
        where: {
          OR: [
            { name: { startsWith: name.toLowerCase() } },
            { name: { startsWith: name.toUpperCase() } },
          ],
        },
      }),
  },
};
