// const { finished } = require("stream/promises");
import { GraphQLUpload } from "graphql-upload";
import { finished } from "stream/promises";

export default {
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();

      const out = require("fs").createWriteStream("local-file-output.txt");
      stream.pipe(out);
      await finished(out);

      return { filename, mimetype, encoding };
    },
  },
};
