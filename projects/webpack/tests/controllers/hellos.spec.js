import HellosController from '@app/controllers/hellos';

describe('@app/controllers/hellos', () => {
  test('empty', async () => {
    const response = await HellosController({},{});
    expect(response).toMatchSnapshot();
  });
});
