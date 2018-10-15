jest.setTimeout(60000);

test('Should be a test env', () => {
  expect(process.env['NODE_ENV']).toEqual('test');
});
