import BaseController from '@app/controllers/base';

class Controller extends BaseController {
  async get(/*event , context*/) {
    const spreadObject = {
      spread: true,
    };
    const spreadArray = ['spreading'];
    const trimLeft = '   /trimLeft/'.trimLeft();
    // const trimStart = '/trimStart/'.trimStart('/');
    return {
      statusCode: 200,
      body: JSON.stringify({
        hellos: true,
        object: { ...spreadObject },
        array: [...spreadArray],
        trimLeft,
        // trimStart,
      }),
    };
  }

  async post(/*event , context*/) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        hellos: 'POSTED',
      }),
    };
  }
}

export default async (event, context) => {
  return await new Controller().handle(event, context);
};
