import http from "http";

//This is your "router"
import pathToRegexp from "path-to-regexp";
import parse from "parseurl";

function decode(val) {
  return val ? decodeURIComponent(val) : "";
};

function makeRoutes(routes) {
  return routes.map(r => ({ ...r, regex: pathToRegexp(r.url) }));
}

function matchRoute(req, routes) {
  const parsed = parse(req);
  let route, match;
  for (route of routes) {
    match = route.regex.exec(parsed.path);
    if (match) break;
  }
  return match ? { route, args: match.slice(1).map(decode) } : undefined;
}

//This is your app code.

//localhost:8080
async function homePage({req, res}) {
  res.end("Hey, you're home.");
}

//localhost:8080/sum/100/200
async function getSumService({req, res}, a, b) {
  res.end(`Sum of ${a} and ${b} is ${parseInt(a) + parseInt(b)}`);
}

const routes = makeRoutes([
  { url: `/`, method: "GET", handler: homePage },
  { url: `/sum/:a/:b`, method: "GET", handler: getSumService }
]);

const server = http.createServer((req, res) => {
  const match = matchRoute(req, routes)
  if (match) {
    match.route.handler.apply(undefined, [{req, res}].concat(match.args))
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(8080);
