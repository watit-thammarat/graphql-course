export default {
  author({ author }, args, { db }, info) {
    return db.users.find(u => u.id === author);
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter(c => c.post === id);
  }
};
