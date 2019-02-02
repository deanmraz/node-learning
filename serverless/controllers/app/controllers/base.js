export default class Controller {
  async handle(event, context) {
    try {
      const method = event.httpMethod.toLowerCase();
      return await this[method](event, context);
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: true }),
      };
    }
  }
}
