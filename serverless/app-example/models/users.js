import Model from '@framework/models/dynamodb';

export default class User extends Model {

  constructor(Dynamodb) {
    this.db = Dynamodb;
  }

}
