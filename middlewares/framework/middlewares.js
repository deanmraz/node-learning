
const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]) => {
  if (firstMiddleware) {
    return async request => firstMiddleware(request, chainMiddlewares(restOfMiddlewares));
  }
  // NOTE nothing us to run so return undefined
};

export const withMiddlewares = async (handler, middlewares = []) => {
  const wrapHandler = async (event, context) => {
    const Request = await handler(event, context);
    if (middlewares.length > 0) {
      return chainMiddlewares(middlewares)(Request);
    }
    return Request;
  };
  return wrapHandler;
};
