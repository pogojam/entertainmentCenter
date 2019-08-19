const fs = require("fs");
const path = require("path");

const pagesPath = path.resolve(__dirname) + "/../src/pages/";

const pagesTest = fs.readdir(pagesPath, (err, files) => {
  files = files.filter(e => e !== "index.js" && e.endsWith(".js"));
  const pages = files.map(fl => {
    fl = fl.replace(".js", "");
    fl = fl[0].toUpperCase() + fl.slice(1);

    return {
      path: fl,
      name: fl
    };
  });

  const data = JSON.stringify({ pages }, null, 2);
  fs.writeFile(
    path.resolve(__dirname) + "/../src/pages/build.json",
    data,
    err => err && console.log(err)
  );
});

console.log(pagesTest);
