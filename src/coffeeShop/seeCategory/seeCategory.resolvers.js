import client from "../../client";

export default {
  Query: {
    seeCategory: async (_, { name }) => {
      return await client.category.findUnique({ where: { name }, include: { shops: true } });
    },
    seeCategories: async (_, { page }) => {
      if (page < 1) {
        page = 1;
      }
      return await client.category.findMany({
        take: 9,
        skip: (page - 1) * 9,
      });
    },
  },
};
