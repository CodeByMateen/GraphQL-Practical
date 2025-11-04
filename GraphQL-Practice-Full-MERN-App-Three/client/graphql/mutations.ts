import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $name: String!, $email: String!, $password: String!) {
    createUser(
      username: $username
      name: $name
      email: $email
      password: $password
    ) {
      id
      username
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $username: String, $name: String, $email: String) {
    updateUser(
      id: $id
      username: $username
      name: $name
      email: $email
    ) {
      id
      username
      name
      email
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

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!, $userId: ID!) {
    createTask(
      title: $title
      description: $description
      userId: $userId
    ) {
      id
      title
      description
      completed
      user {
        id
        username
        name
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $completed: Boolean) {
    updateTask(
      id: $id
      title: $title
      description: $description
      completed: $completed
    ) {
      id
      title
      description
      completed
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      title
      description
    }
  }
`;

