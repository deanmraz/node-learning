import { withMiddlewares } from './middlewares';

export const timeout = async (ms) => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

const runtimeMiddleware = async (request, next) => {
  const start = Date.now();
  // await timeout(1000);
  console.log(next);
  const response = await next(request);
  console.log(response);
  response.headers['run-time'] = Date.now() - start;
  return response;
};
const mainMiddleware = async (request, next) => {
  console.log('should be undefined', next);
  const { aws } = request;
  return {
    statusCode: 200,
    body: JSON.stringify(aws),
    headers: {
      'Content-Type': 'text/plain',
    },
  };
};

const AwsHandler = async (event, context) => {
  return {
    aws: {
      event,
      context,
    },
  };
};

describe('Middlewares', () => {
  test('Return Handler Request Data', async () => {
    const handler = await withMiddlewares(AwsHandler);
    const response = await handler({ event: 1 }, { context: 1 });
    expect(response).toMatchSnapshot();
  });
  test('Chain Middlewares', async () => {
    const handler = await withMiddlewares(AwsHandler, [runtimeMiddleware, mainMiddleware]);
    const response = await handler({ event: 1 }, { context: 1 });
    expect(response).toMatchSnapshot();
  });
});
