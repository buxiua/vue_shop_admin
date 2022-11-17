const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname, "./src/assets/addrData.json");
console.log("start");
fs.readFile(dir, function (err, data) {
  if (err) {
    throw err;
  }
  data = JSON.parse(data.toString());
  console.log("读取成功");
  const result = [];
  data.forEach((item) => {
    deal(result, item);
  });
  fs.writeFile("./addr.json", JSON.stringify(result), function (err) {
    if (err) {
      console.log(err);
    }
    console.log("写入成功");
  });
});

/**
 *
 * @param {Array} result 结果数组
 * @param { Object } target 带处理对象
 */
function deal(result, target) {
  const data = {
    id: target.c,
    value: target.c,
    label: target.n,
  };
  if (Array.isArray(target.d)) {
    data.children = [];
    target.d.forEach((item) => {
      deal(data.children, item);
    });
  }
  result.push(data);
}
