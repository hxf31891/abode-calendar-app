/**
 * This is a HACK to fetch all routes from an express
 * router with nested sub-routers
 *
 * It uses the regex pattern added to the sub-router and
 * tries to normalize it into something more human readable
 * since this doesn't appear to be stored elsewhere as far
 * as I could tell
 */
const replaceParams = (string: any) => {
  let curr = string;
  let last = "";
  let paramCount = 1;
  while (last !== curr) {
    last = curr.slice();
    // this is the pattern that express uses when you define your path param without a custom regex
    curr = curr.replace("(?:([^\\/]+?))", `:param${paramCount++}`);
  }
  return curr;
};

export const listRoutes = (initialRouter: any) => {
  const _listRoutes = (router: any, prefix = "") => {
    const routes: any = [];
    router.stack.forEach(({ route, handle, name, ...rest }: any) => {
      if (route) {
        // routes registered directly on the app
        const path = replaceParams(`${prefix}${route.path}`).replace(/\\/g, "");
        routes.push({ path, methods: route.methods });
      } else if (name === "router") {
        // router middleware
        const newPrefix = rest.regexp.source
          .replace("\\/?(?=\\/|$)", "") // this is the pattern express puts at the end of a route path
          .slice(1)
          .replace("\\", ""); // remove escaping to make paths more readable
        routes.push(..._listRoutes(handle, prefix + newPrefix));
      }
    });
    return routes;
  };
  return _listRoutes(initialRouter);
};
