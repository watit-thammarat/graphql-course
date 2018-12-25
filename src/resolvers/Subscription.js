export default {
  comment: {
    subscribe(_, { postId }, { pubsub, db }, info) {
      const post = db.posts.find(p => p.id === postId && p.published);
      if (!post) {
        throw new Error('Post not found');
      }
      return pubsub.asyncIterator(`comment_${postId}`);
    }
  },
  post: {
    subscribe(_, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    }
  }
};
