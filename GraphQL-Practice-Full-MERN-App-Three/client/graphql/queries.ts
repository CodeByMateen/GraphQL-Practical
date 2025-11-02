import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      name
      email
      age
      gender
      friends {
        id
        username
        name
      }
      favoriteMovies {
        id
        title
        year
        genre
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      name
      email
      age
      gender
      friends {
        id
        username
        name
      }
      favoriteMovies {
        id
        title
        year
        genre
      }
    }
  }
`;

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
      year
      genre
    }
  }
`;

export const GET_MOVIE = gql`
  query GetMovie($title: String!) {
    movie(title: $title) {
      id
      title
      year
      genre
    }
  }
`;

