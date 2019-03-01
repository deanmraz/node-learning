import BaseController from '@app/controllers/base';

class Controller extends BaseController {
  async get(/*event , context*/) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        users: true,
      }),
    };
  }
}

export default async (event, context) => {
  return await new Controller().handle(event, context);
};
