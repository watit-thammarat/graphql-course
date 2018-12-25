import { GraphQLServer } from 'graphql-yoga';

const users = [
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

const posts = [
  { id: '1', title: 'title 1', body: 'body 1', author: '1', published: false },
  { id: '2', title: 'title 2', body: 'body 2', author: '2', published: true },
  { id: '3', title: 'title 3', body: 'body 3', author: '1', published: true }
];

const comments = [
  { id: '1', text: 'comment 1', author: '1', post: '1' },
  { id: '2', text: 'comment 2', author: '1', post: '1' },
  { id: '3', text: 'comment 3', author: '2', post: '2' },
  { id: '1', text: 'comment 1', author: '3', post: '3' }
];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    users(_, { query = '' }, context, info) {
      if (query.trim().length === 0) {
        return users;
      }
      return users.filter(u => u.name.toLowerCase().includes(query));
    },
    posts(_, { query = '' }, context, info) {
      if (query.trim().length === 0) {
        return posts;
      }
      return posts.filter(p => {
        return (
          p.title.toLowerCase().includes(query) ||
          p.body.toLowerCase().includes(query)
        );
      });
    },
    comments(_, args, context, info) {
      return comments;
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
  },
  Post: {
    author({ author }, args, context, info) {
      return users.find(u => u.id === author);
    },
    comments({ id }, args, context, info) {
      return comments.filter(c => c.post === id);
    }
  },
  User: {
    posts({ id }, args, ctx, info) {
      return posts.filter(p => p.author === id);
    },
    comments({ id }, args, ctx, info) {
      return comments.filter(c => c.author === id);
    }
  },
  Comment: {
    author({ author }, args, context, info) {
      return users.find(u => u.id === author);
    },
    post({ id }, arg, context, info) {
      return posts.find(p => p.id === id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up');
});
