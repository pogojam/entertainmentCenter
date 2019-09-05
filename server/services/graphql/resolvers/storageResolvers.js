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
          fileName: file,
          dir: dir,
          extension: split[1],
          isFolder
        };
      });
    }
  },
  Mutation: {
    uploadFiles: async (obj, { file, meta: { path } }, { database }) => {
      const { filename, createReadStream, ...rest } = await file;
      const basePath = baseName + path + "/";
      //   const wrightStream = fs.createWriteStream(basePath + filename);
      const readStream = createReadStream();
      //   console.log(readStream);
      readStream.on("data", () => {
        console.log("DATA");
      });

      //   readStream.pipe(wrightStream);

      //   if (!fs.existsSync(basePath)) {
      //     fs.mkdirSync(basePath);
      //   }
    }
  }
};
