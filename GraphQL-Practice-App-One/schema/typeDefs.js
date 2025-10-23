const typeDefs = `
  type User {
    id: ID!
    username: String!
    name: String!
    email: String!
    age: Int
    password: String!
    gender: Gender
    friends: [User]
    favoriteMovies: [Movie]
  }

  type Movie {
    id: ID!
    title: String!
    year: Int!
    genre: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    movies: [Movie!]!
    movie(title: String!): Movie
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }
`;

module.exports = typeDefs;
