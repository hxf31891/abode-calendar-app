const buildQueryOptionsFromPath = (path: string) => {
  // strip leading . then 'path.to.prop' -> ['path', 'to', 'prop']
  const pathArray = path.replace(/^\./, "").split(".");

  const fullQueryObj = { attributes: ["id"] };
  let lastQueryObj: any = fullQueryObj;

  pathArray.forEach((p, idx) => {
    if (idx === pathArray.length - 1) {
      lastQueryObj.attributes = [p];
    } else {
      const thisQueryObj = {
        attributes: ["id"],
        association: p,
      };

      lastQueryObj.include = thisQueryObj;
      lastQueryObj = thisQueryObj;
    }
  });

  return fullQueryObj;
};

const getNestedAttr = (
  obj: object | object[],
  path: string,
  options?: { includeMissing: boolean; debug?: boolean }
) => {
  const includeMissing = options?.includeMissing === undefined ? null : options.includeMissing;
  const debug = options?.debug === undefined ? false : options.debug;

  // obj = base object to get props of
  // path = path to prop in the form 'path.to.prop'
  // defaultValue = default value to return if value cannot be reteived
  // debug = whether or not to log invalid paths

  // strip leading . then 'path.to.prop' -> ['path', 'to', 'prop']
  const pathList = path.replace(/^\./, "").split(".");
  let value = obj;
  for (const attr of pathList) {
    if (Array.isArray(value)) {
      value = value.map((v) => getNestedAttr(v, attr, options)).flat();
      if (!includeMissing) {
        value = (value as any[]).filter((v) => v !== undefined);
      }
    } else {
      value = (value as any)?.[attr];
      if (value === undefined) {
        debug && console.log(`** path ${path} cannot be retrieved from`, obj);
        return value;
      }
    }
  }
  return value;
};

export const getNestedAttribute = (model: any, id: string, path: string) => {
  const queryOptions = buildQueryOptionsFromPath(path);
  console.log(queryOptions);

  return model.findByPk(id, queryOptions).then((data: any) => {
    const attr = getNestedAttr(data, path);
    return attr;
  });
};
