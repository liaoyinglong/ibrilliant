import { removeCannotParsedContent } from "./index";

const arr = [
  {
    input:
      "#/components/schemas/Hopex.Infrastructure.Models.ApiResponseModel`1[[System.Collections.Generic.IEnumerable`1[[Hopex.News.ViewModels.NewsViewModel, Hopex.News, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]], System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]",
    output:
      "#/components/schemas/Hopex.Infrastructure.Models.ApiResponseModel.System.Collections.Generic.IEnumerable.Hopex.News.ViewModels.NewsViewModel",
  },

  {
    input:
      "#/definitions/Hopex.Framework.Web.Models.ApiRequestModel`1[[Hopex.ApiGateway.Api.ViewModels.Margin.AddMarginSortRequestModel, Hopex.ApiGateway.Api, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]",
    output:
      "#/definitions/Hopex.Framework.Web.Models.ApiRequestModel.Hopex.ApiGateway.Api.ViewModels.Margin.AddMarginSortRequestModel",
  },

  {
    input:
      "Hopex.Infrastructure.Models.ApiResponseModel`1[[System.Int64, System.Private.CoreLib, Version=5.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]]",
    output: "Hopex.Infrastructure.Models.ApiResponseModel.System.Int64",
  },

  {
    input:
      "Hopex.Framework.Web.Models.ApiRequestModel`1[[Hopex.Users.Models.Orders.ConditionOrdersSearch, Hopex.Users, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]",
    output:
      "Hopex.Framework.Web.Models.ApiRequestModel.Hopex.Users.Models.Orders.ConditionOrdersSearch",
  },

  {
    input: "application/json-patch+json",
    output: "application/json-patch+json",
  },
  {
    input: "收益率 (+3.20%)",
    output: "收益率 (+3.20%)",
  },
];
const inputStr = arr.map((item) => item.input);

const target = arr.map((item) => item.output);

describe("removeCannotParsedContent", function () {
  it("移除成功", () => {
    const res = removeCannotParsedContent(inputStr);

    expect(res).toEqual(target);
  });
});
