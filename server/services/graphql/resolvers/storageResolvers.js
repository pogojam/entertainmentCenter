const fs = require("fs");
const path = require("path");
const baseName = path.basename("../../../storage/");

module.exports = {
  Query: {
    getFiles: async (obj, { input: dir }, { database }) => {
      const basePath = baseName + dir;
      const files = await fs.readdirSync(basePath);
      return files.map(file => {
        const split = file.split(".");
        const isFolder = fs.lstatSync(basePath + file).isDirectory();

        return {
          path: dir,
          name: split[0],
          fileName: file,
          extension: split[1],
          isFolder
        };
      });
    }
  },
  Mutation: {
    uploadFiles: async (obj, data, { database }) => {
      console.log(data);
      // fs.createWriteStream(basePath)
    }
  }
};
