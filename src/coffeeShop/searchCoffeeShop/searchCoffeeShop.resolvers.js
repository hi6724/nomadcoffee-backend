import client from "../../client";

export default {
  Query: {
    searchCoffeeShop: async (_, { keyword }) => {
      const categories = await client.category.findMany({
        where: { name: { contains: keyword.toLowerCase() } },
      });
      const coffeeShops = await client.coffeeShop.findMany({
        where: { name: { contains: keyword.toLowerCase() } },
      });
      return { coffeeShops, categories };
    },
  },
};
