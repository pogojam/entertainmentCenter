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
    addFolder: (obj, { path, name }) => {
      console.log("will add folder", name, path);
      // fs.mkdir(path, { recursive: true },(err)=>{
      //   if(err) throw err
      // })
    }
  }
};
