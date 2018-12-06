import path from 'path';

const current = path.dirname();

class DemoClass {
  get() {
    return null;
  }
}

export default function() {
  new DemoClass().get();
  return current;
}

export const asyncFunction = async () => {
  return null;
};
