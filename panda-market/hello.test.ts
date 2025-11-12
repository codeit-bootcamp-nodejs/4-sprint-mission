import hello from './hello';

test('안녕 Jest', () => {
  const value = hello();
  expect(value).toEqual('Hello Jest');
});

