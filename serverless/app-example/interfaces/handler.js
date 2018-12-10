export default interface handler {
  // this will boot the application
  // get the handler type like aws-koa
  // setup the routes
  // setup the middlewars
  // REVIEW start will also know if its a queued job or http request
    // via the function name that is calling it
    // middlewares are potentially excluded
      // or need to be configured to be included / excluded
  start();
}
