export default interface middleware {

  jobQueue: boolean;

  async handle();

  // REVIEW: if we want to use for koa then its going to be
  // async handle(ctx, next);
}
