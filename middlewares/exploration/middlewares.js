
export const withMiddlewares = async (handler, middlewares = []) => {

  const wrapHandler = async (event, context) => {
    const Request = await handler(event, context);

    const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]) => {
      if (firstMiddleware) {
        console.log('setup', firstMiddleware.toString());
        const wrapMiddleware = async (request) => {
          console.log('calling', firstMiddleware);
          return firstMiddleware(request, chainMiddlewares(restOfMiddlewares));
        };
        return wrapMiddleware;
      } else {
        console.log('no more middlewares to wrap');
        return 'END';
      }
    };

    if (middlewares.length > 0) {
      const wrappedMiddlewares = chainMiddlewares(middlewares);
      return wrappedMiddlewares(Request);
    }
    return Request;
  };
  return wrapHandler;
};
