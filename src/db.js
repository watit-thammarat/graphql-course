let users = [
  {
    id: '1',
    name: 'user 1',
    email: 'user1@test.com',
    age: 10
  },
  {
    id: '2',
    name: 'user 2',
    email: 'user2@test.com',
    age: null
  },
  {
    id: '3',
    name: 'user 3',
    email: 'user3@test.com',
    age: 20
  }
];

let posts = [
  { id: '1', title: 'title 1', body: 'body 1', author: '1', published: true },
  { id: '2', title: 'title 2', body: 'body 2', author: '2', published: true },
  { id: '3', title: 'title 3', body: 'body 3', author: '1', published: true }
];

let comments = [
  { id: '1', text: 'comment 1', author: '1', post: '1' },
  { id: '2', text: 'comment 2', author: '1', post: '1' },
  { id: '3', text: 'comment 3', author: '2', post: '2' },
  { id: '4', text: 'comment 1', author: '3', post: '3' }
];

export default {
  users,
  posts,
  comments
};
