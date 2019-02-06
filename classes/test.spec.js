import { Base, One, Two } from './app/demo';

describe('Class Hierarchy Tests', () => {

  test('Base', () => {
    const baseObject = new Base();
    expect(baseObject.getName()).toEqual('Base');
  });

  test('one', () => {
    const oneObject = new One();
    expect(oneObject.getName()).toEqual('One');
  });

  test('two', () => {
    const twoObject = new Two();
    expect(twoObject.getName()).toEqual('Two with parent Base');
  });

  test('one parentCallGetName', () => {
    const oneObject = new One();
    expect(oneObject.parentCallGetName()).toEqual('One');
  });

  test('two parentCallGetName', () => {
    const twoObject = new Two();
    expect(twoObject.parentCallGetName()).toEqual('Two with parent Base');
  });

  test('one handle(get)', () => {
    const oneObject = new One();
    expect(oneObject.handle('get')).toEqual('GET ONE');
  });

  test('two handle(get)', () => {
    const twoObject = new Two();
    expect(twoObject.handle('get')).toEqual('GET BASE');
  });

});
