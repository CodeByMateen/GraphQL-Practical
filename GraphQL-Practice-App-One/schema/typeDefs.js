const typeDefs = `
  type User {
    id: ID!
    username: String!
    name: String!
    email: String!
    age: Int
    password: String!
    gender: Gender
    friends: [User!]
    favoriteMovies: [Movie!]
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

  input UserInput {
    username: String!
    name: String!
    email: String!
    age: Int = 0
    password: String!
    gender: Gender = OTHER
  }

  input UpdateUserInput {
    username: String
    name: String
    email: String
    age: Int
    password: String
    gender: Gender
  }

  input MovieInput {
    title: String!
    year: Int!
    genre: String!
  }

  input UpdateMovieInput {
    title: String
    year: Int
    genre: String
  }

  # for mutations

  type Mutation {
    createUser(user: UserInput!): User
    updateUser(id: ID!, user: UpdateUserInput!): User
    deleteUser(id: ID!): User
    createMovie(movie: MovieInput!): Movie
    updateMovie(id: ID!, movie: UpdateMovieInput!): Movie
    deleteMovie(id: ID!): Movie
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }
`;

module.exports = typeDefs;
