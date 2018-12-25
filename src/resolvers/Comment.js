export default {
  author({ author }, args, { db }, info) {
    return db.users.find(u => u.id === author);
  },
  post({ post }, arg, { db }, info) {
    return db.posts.find(p => p.id === post);
  }
};
