import _ from "lodash";

interface Data {
  components: {
    schemas: Record<string, Record<string, any>>;
  };
}

export function normalizeResponseType(data: Data) {
  const schemas = _.get(data, "components.schemas");

  _.forEach(schemas, (obj, key) => {
    // 有这些属性的说明 后台文档已经包了 一层 BaseRes
    const shouldNormalize =
      _.has(obj, "properties.ret") &&
      _.has(obj, "properties.errCode") &&
      _.has(obj, "properties.errStr") &&
      _.has(obj, "properties.data");
    if (!shouldNormalize) {
      return;
    }
    schemas[key] = obj.properties.data;
  });

  return data;
}
