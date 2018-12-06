import path from "path";

class DemoClass {
  get() {
    return null;
  }
}

export default function() {
  (new DemoClass).get();
  ['test','spacing','brackets'].map(item => item);
  a => { return a }
  const object = {
    bar: 'baz',
    qux: 'quux'
  };
  const current = path.dirname();
  const wrap = 'testing very long string so we ensure that wrapping is good for this project setup';
  return current + wrap + object.bar;
}

export const asyncFunction = async () => {
  return null;
};
