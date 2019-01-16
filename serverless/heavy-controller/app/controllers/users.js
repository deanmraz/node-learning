class Controller {
  static async handle(event /*, context*/) {
    try {
      // TODO check if job queued, function or http request. Run middleware if http.
      return await Controller.get(event);
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: true }),
      };
    }
  }

  static async get(/*event , context*/) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        users: true,
      }),
    };
  }
}

export default Controller.handle;
