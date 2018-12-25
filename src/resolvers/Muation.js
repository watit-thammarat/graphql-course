import uuid from 'uuid/v4';

export default {
  createUser(
    _,
    {
      data: { name, email, age }
    },
    { db }
  ) {
    if (db.users.some(u => u.email === email)) {
      throw new Error('Email is in use');
    }
    const user = { id: uuid(), name, email, age };
    db.users = db.users = [...db.users, user];
    return user;
  },
  updateUser(_, { id, data }, { db }) {
    const index = db.users.findIndex(u => u.id === id);
    if (index < 0) {
      throw new Error('User not found');
    }
    const user = { ...db.users[index], ...data };
    db.users[index] = user;
    return user;
  },
  deleteUser(_, { id }, { db }) {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      throw new Error('user does not exist');
    }
    db.users = db.users.filter(u => u.id !== id);
    db.posts = db.posts.filter(p => p.author !== id);
    db.comments = db.comments.filter(c => c.author !== id);
    return user;
  },
  createPost(
    _,
    {
      data: { title, body, published, author }
    },
    { db, pubsub }
  ) {
    if (!db.users.some(u => u.id === author)) {
      throw new Error('Invalid author');
    }
    const post = { id: uuid(), title, body, published, author };
    db.posts = [...db.posts, post];
    if (published) {
      pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    }
    return post;
  },
  updatePost(_, { id, data }, { db, pubsub }) {
    const index = db.posts.findIndex(p => p.id === id);
    if (index < 0) {
      throw new Error('Post not found');
    }
    const originalPost = db.posts[index];
    const post = { ...originalPost, ...data };
    db.posts[index] = post;

    if (originalPost.published && !post.published) {
      pubsub.publish('post', {
        post: { mutation: 'DELETED', data: post }
      });
    } else if (!originalPost.published && post.published) {
      pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    } else if (post.published) {
      pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
    }

    return post;
  },
  deletePost(_, { id }, { db, pubsub }) {
    const post = db.posts.find(u => u.id === id);
    if (!post) {
      throw new Error('post does not exist');
    }
    db.posts = db.posts.filter(p => p.id !== id);
    db.comments = db.comments.filter(c => c.post !== id);
    if (post.published) {
      pubsub.publish('post', { post: { mutation: 'DELETED', data: post } });
    }
    return post;
  },
  createComment(
    _,
    {
      data: { text, author, post }
    },
    { db, pubsub }
  ) {
    if (!db.users.some(u => u.id === author)) {
      throw new Error('Invalid author');
    }
    if (!db.posts.some(p => p.id === post && p.published)) {
      throw new Error('Invalid post');
    }
    const comment = { id: uuid(), text, author, post };
    db.comments = [...db.comments, comment];
    pubsub.publish(`comment_${post}`, {
      comment: { mutation: 'CREATED', data: comment }
    });
    return comment;
  },
  updateComment(_, { id, data }, { db, pubsub }) {
    const index = db.comments.findIndex(c => c.id === id);
    if (index < 0) {
      throw new Error('Comment not found');
    }
    const comment = { ...db.comments[index], ...data };
    db.comments[index] = comment;
    pubsub.publish(`comment_${comment.post}`, {
      comment: { mutation: 'UPDATED', data: comment }
    });
    return comment;
  },
  deleteComment(_, { id }, { db, pubsub }) {
    const comment = db.comments.find(c => c.id === id);
    if (!comment) {
      throw new Error('comment does not exist');
    }
    db.comments = db.comments.filter(c => c.id !== id);
    pubsub.publish(`comment_${comment.post}`, {
      comment: { mutation: 'DELETED', data: comment }
    });
    return comment;
  }
};
