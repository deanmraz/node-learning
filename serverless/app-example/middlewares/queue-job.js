export default class Middleware {

  jobQueue: false;

  async handle(ctx, next) {

    if (this.request.queue) {
      // queue up request into sqs job

    }
    return await next();
  }

}
