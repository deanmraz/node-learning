import path from 'path';

class DemoClass {
  get() {
    return null;
  }
}

export default function() {
  new DemoClass().get();
  ['test', 'spacing', 'brackets'].map((item) => item);
  (a) => {
    return a;
  };
  const spread = { test: 1, two: 2 };
  const object = {
    bar: 'baz',
    qux: 'quux',
    ...spread,
  };
  const spreadArr = ['one', 'two'];
  const arr = ['baz', 'quux', ...spreadArr];
  const current = path.dirname();
  const wrap =
    'testing very long string so we ensure that wrapping is good for this project setup';
  return current + wrap + object.bar + arr[0];
}

export const asyncFunction = async () => {
  return null;
};
