export class Base {
  constructor() {
    this.name = 'Base';
  }

  getName() {
    return this.name;
  }

  parentCallGetName() {
    return this.getName();
  }

  handle(method) {
    return this[method]();
  }

  get() {
    return 'GET BASE';
  }
}

export class One extends Base {
  getName() {
    return 'One';
  }

  get() {
    return 'GET ONE';
  }
}

export class Two extends Base {
  getName() {
    return `Two with parent ${super.getName()}`;
  }
}
