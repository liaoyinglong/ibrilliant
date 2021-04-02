import { normalizeResponseType } from "./index";
import fs from "fs";
import path from "path";

function loadJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name)).toString());
}

const old = loadJson("./old.json");
const newData = loadJson("./new.json");

describe("normalizeResponseType", function () {
  it("格式化后必须符合", () => {
    const res = normalizeResponseType(old);

    expect(res).toEqual(newData);
  });
});
