import { normalizeResponseType } from "./index";

import fs from "fs-extra";

const old = fs.readJSONSync("./old.json");

const newData = normalizeResponseType(old);

fs.writeJSONSync("./new.json", newData);
