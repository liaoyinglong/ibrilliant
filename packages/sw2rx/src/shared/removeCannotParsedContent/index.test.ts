import { normalize, removeCannotParsedContent } from "./index";
import * as assert from "assert";
import fs from "fs-extra";
import oldJson from "./old.json";
import path from "path";

// (async () => {
//   const res = removeCannotParsedContent(oldJson);
//   await fs.writeJSON(path.resolve(__dirname, "./new.json"), res);
// })();

const inputStr = [
  "#/components/schemas/Hopex.Infrastructure.Models.ApiResponseModel`1[[System.Collections.Generic.IEnumerable`1[[Hopex.News.ViewModels.NewsViewModel, Hopex.News, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]], System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]",

  "#/definitions/Hopex.Framework.Web.Models.ApiRequestModel`1[[Hopex.ApiGateway.Api.ViewModels.Margin.AddMarginSortRequestModel, Hopex.ApiGateway.Api, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]",

  "Hopex.Infrastructure.Models.ApiResponseModel`1[[System.Int64, System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]",

  "Hopex.Framework.Web.Models.ApiRequestModel`1[[Hopex.Users.Models.Orders.ConditionOrdersSearch, Hopex.Users, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]",
];

const res = removeCannotParsedContent(inputStr);

const target = [
  "#/components/schemas/Hopex.Infrastructure.Models.ApiResponseModel.System.Collections.Generic.IEnumerable.Hopex.News.ViewModels.NewsViewModel",
  "#/definitions/Hopex.Framework.Web.Models.ApiRequestModel.Hopex.ApiGateway.Api.ViewModels.Margin.AddMarginSortRequestModel",
  "Hopex.Infrastructure.Models.ApiResponseModel.System.Int64",
  "Hopex.Framework.Web.Models.ApiRequestModel.Hopex.Users.Models.Orders.ConditionOrdersSearch",
];

console.log("target = ", target);

assert.strictEqual(res.join(","), target.join(","), "与预期不符");

// const res1 = inputStr.map((item) => {
//   return normalize(item);
// });
//
// console.log(res1);
