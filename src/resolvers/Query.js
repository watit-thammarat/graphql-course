export default {
  users(_, { query = '' }, { db }, info) {
    if (query.trim().length === 0) {
      return db.users;
    }
    return db.users.filter(u => u.name.toLowerCase().includes(query));
  },
  posts(_, { query = '' }, { db }, info) {
    if (query.trim().length === 0) {
      return db.posts;
    }
    return db.posts.filter(p => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.body.toLowerCase().includes(query)
      );
    });
  },
  comments(_, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      id: '123',
      name: 'Watit Thammart',
      email: 'tongnakub@hotmail.com',
      age: null
    };
  },
  post() {
    return { id: '123', title: 'title', body: 'body', published: false };
  }
};
