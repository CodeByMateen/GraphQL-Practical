
# REST vs GraphQL Practical Example

In REST APIs, if we want only **specific user fields**, we often end up creating **multiple endpoints**.  

For example:  
- If we want only the user’s **email**, **first name**, and **last name**,  
  we might create:  
  ```
  GET /users/:id/basic
  ```  
- If we only want to fetch the **user’s profile picture**,  
  we might create:  
  ```
  GET /users/:id/profile
  ```  

Over time, this leads to **too many endpoints** for different use cases.  
And not just that — REST often requires **multiple API calls** to fetch related data.

### 💥 Example of Multiple API Calls in REST
Let’s say you want to fetch a user’s **address** which is stored in another table.

In REST:
1. First, you call `/users/:id` to get user details (and the userId).  
2. Then, you use that `userId` to call `/addresses/:userId` to fetch the address.  

That means:
```
GET /users/1       → gives user data
GET /addresses/1   → gives user address
```

👉 Two separate API calls for related data.

In GraphQL, this can be done in a **single request** — no need for separate calls.

Example:
```graphql
query {
  user(id: 1) {
    firstName
    lastName
    email
    address {
      city
      country
    }
  }
}
```

This query returns both **user info** and **address** in one go ⚡

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
To get specific data like profile image or basic info, we would have to create **separate endpoints** like:  
- `/users/:id/basic`  
- `/users/:id/profile`  
- `/users/:id/email`  
...and so on.  

Plus, for related data (like user address), we must make **another API call**, increasing latency and network usage.  

This makes the system **hard to scale** and **complex to maintain**.

---

## ⚡ GraphQL Example

### Scenario
We can specify exactly what we want — no extra data, and even fetch **related data** in the same query.

### Code (Apollo Server)
```js
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Address {
    city: String
    country: String
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    profileImage: String
    address: Address
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
    address: { city: "Lahore", country: "Pakistan" },
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
    address {
      city
      country
    }
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
      "email": "mateen@example.com",
      "address": {
        "city": "Lahore",
        "country": "Pakistan"
      }
    }
  }
}
```

### ✅ Benefits
- Fetch only the fields you need  
- Fetch related data (user + address) in **one query**  
- One single endpoint (`/graphql`)  
- No multiple endpoints for different data  
- More efficient and flexible  

---

## 🔥 Final Comparison

| Feature | REST API | GraphQL |
|----------|-----------|-----------|
| Endpoint | `/users/:id`, `/users/:id/basic`, `/users/:id/profile`, etc. | `/graphql` |
| Data Control | Fixed | Customizable |
| Over-fetching | Yes | No |
| Multiple Endpoints | Required | Not needed |
| Multiple API Calls | Yes | No (single query) |
| Query Flexibility | Low | Very High |

---

**Author:** Mateen Shahzad  
**Topic:** REST vs GraphQL Practical Difference
