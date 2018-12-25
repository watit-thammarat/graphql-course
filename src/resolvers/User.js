export default {
  posts({ id }, args, { db }, info) {
    return db.posts.filter(p => p.author === id);
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter(c => c.author === id);
  }
};
