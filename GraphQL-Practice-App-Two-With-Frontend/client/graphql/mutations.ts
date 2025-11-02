import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      id
      username
      name
      email
      age
      gender
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      username
      name
      email
      age
      gender
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
      name
    }
  }
`;

export const CREATE_MOVIE = gql`
  mutation CreateMovie($movie: MovieInput!) {
    createMovie(movie: $movie) {
      id
      title
      year
      genre
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($id: ID!, $movie: UpdateMovieInput!) {
    updateMovie(id: $id, movie: $movie) {
      id
      title
      year
      genre
    }
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      id
      title
    }
  }
`;

