import RestController from '@framework/controllers/rest';

export default class Controller extends RestController {

  async post() {
    // do some authentication
    // set device token with user thats authed
    // update UserAuth service to reference new user
  }

}
