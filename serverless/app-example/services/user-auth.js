import UserModel from '@app/models/users';

export default class ServiceProvider {

  constructor(Request) {
    defer = true;
    this.request = Request;
  }

  async register() {
    const deviceToken = this.request.deviceToken;
    const UserAuth = await UserModel.byDeviceToken(deviceToken);
    if (UserAuth) {
      return UserAuth;
    }
  }

  provides() {
    return ['UserAuth'];
  }
}
