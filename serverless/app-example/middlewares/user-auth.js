export default class Middleware {

  jobQueue: false;

  constructor(UserAuth) {
    this.user = UserAuth;
  }

  async handle(ctx, next) {
    if (this.user.authenticated) {
      return await next();
    }
    //REVIEW throw validation error
  }

}
