# REST vs GraphQL Practical Example

This document explains the key difference between REST API and GraphQL with a **practical Node.js example**.

---

## 🧩 REST API Example

### Scenario
We want to get user details (first name, last name, and email), but the REST endpoint returns **all fields** including password and profile image.

### Code (Express.js)
```js
import express from "express";
const app = express();

const users = [
  {
    id: 1,
    firstName: "Mateen",
    lastName: "Shahzad",
    email: "mateen@example.com",
    password: "123456",
    profileImage: "https://example.com/mateen.jpg",
  },
];

app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.json(user);
});

app.listen(4000, () => console.log("REST API running on port 4000"));
```

### Request
```
GET /users/1
```

### Response
```json
{
  "id": 1,
  "firstName": "Mateen",
  "lastName": "Shahzad",
  "email": "mateen@example.com",
  "password": "123456",
  "profileImage": "https://example.com/mateen.jpg"
}
```

### ❌ Problem
We only needed **firstName**, **lastName**, and **email**, but the endpoint returned everything (over-fetching).

---

## ⚡ GraphQL Example

### Scenario
We can specify exactly what we want — no extra data.

### Code (Apollo Server)
```js
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    profileImage: String
  }

  type Query {
    user(id: ID!): User
  }
`;

const users = [
  {
    id: 1,
    firstName: "Mateen",
    lastName: "Shahzad",
    email: "mateen@example.com",
    password: "123456",
    profileImage: "https://example.com/mateen.jpg",
  },
];

const resolvers = {
  Query: {
    user: (_, { id }) => users.find(u => u.id === parseInt(id)),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(() => console.log("GraphQL API running on port 4000"));
```

### Query
```graphql
query {
  user(id: 1) {
    firstName
    lastName
    email
  }
}
```

### Response
```json
{
  "data": {
    "user": {
      "firstName": "Mateen",
      "lastName": "Shahzad",
      "email": "mateen@example.com"
    }
  }
}
```

### ✅ Benefits
- Fetch only the fields you need  
- One single endpoint (`/graphql`)  
- No multiple endpoints for different data  
- More efficient and flexible

---

## 🔥 Final Comparison

| Feature | REST API | GraphQL |
|----------|-----------|-----------|
| Endpoint | `/users/:id` | `/graphql` |
| Data Control | Fixed | Customizable |
| Over-fetching | Yes | No |
| Multiple Endpoints | Required | Not needed |
| Query Flexibility | Low | Very High |

---

**Author:** Mateen Shahzad  
**Topic:** REST vs GraphQL Practical Difference
