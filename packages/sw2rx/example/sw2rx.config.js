const path = require("path");

function resolvePath(str) {
  return path.resolve(__dirname, str);
}

module.exports = {
  outputPath: resolvePath("./src/apis/lib"),
  swaggerUrls: [
    // {
    //   name: "gateway",
    //   desc: "Hopex Api Gateway Doc",
    //   url: "http://192.168.70.131:5003/swagger/v1/swagger.json",
    // },
    // {
    //   name: "news",
    //   desc: "Hopex News Doc 资讯api",
    //   url: "http://192.168.70.131:5007/swagger/v1/swagger.json",
    // },
    // {
    //   name: "oc",
    //   desc:
    //     "Hopex Operation Center Doc,运营中心api文件（公告/banner/app版本更新等）",
    //   url: "http://192.168.70.131:5100/swagger/v1/swagger.json",
    // },
    {
      name: "user",
      desc: "Hopex User System API Doc",
      url: "http://192.168.70.131:5001/swagger/v1/swagger.json",
    },
    // {
    //   name: "cbbcApi",
    //   desc: "Hopex CBBC ApiGateway",
    //   url: "http://192.168.70.153:53030/swagger/v1/swagger.json",
    // },
    // {
    //   name: "otc",
    //   desc: "Hopex OTC System Doc",
    //   url: "http://192.168.70.131:5105/swagger/v1/swagger.json",
    // },
  ],
};
