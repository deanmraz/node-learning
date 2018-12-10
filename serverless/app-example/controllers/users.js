import ModelController from '@framework/controllers/model';
import UserAuthMiddleware from '@app/middlewares/user-auth';

export default class Controller extends ModelController {

  // REVIEW is this even possible in nodejs? Inject automatically
  constructor(UserAuth) {
    this.model = UserAuth;
  }

  // REVIEW koa requirement?
  async middlewares (ctx, next) {

    // REVIEW do we need to await here?
    //what happens when we want multiple middlewares like one right after this one?
    UserAuthMiddleware.handle(ctx, next);
  }

}
