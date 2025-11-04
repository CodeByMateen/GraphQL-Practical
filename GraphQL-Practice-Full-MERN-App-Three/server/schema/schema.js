import User from '../models/user.js';
import Task from '../models/task.js';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId);
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return Task.find();
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.id);
      },
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: { 
    createTask: {
      type: TaskType,
      args: { 
        title: { type: GraphQLString }, 
        description: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Task.create(args);
      },
    },
    updateTask: {
      type: TaskType,
      args: { 
        id: { type: GraphQLID }, 
        title: { type: GraphQLString }, 
        description: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        return Task.findByIdAndUpdate(args.id, args, { new: true });
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findByIdAndDelete(args.id);
      },
    },
    createUser: {
      type: UserType,
      args: { 
        username: { type: GraphQLString }, 
        name: { type: GraphQLString }, 
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        return User.create(args);
      },
    },
    updateUser: {
      type: UserType,
      args: { 
        id: { type: GraphQLID }, 
        username: { type: GraphQLString }, 
        name: { type: GraphQLString }, 
        email: { type: GraphQLString }
      },
      resolve(parent, args) {
        return User.findByIdAndUpdate(args.id, args, { new: true });
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findByIdAndDelete(args.id);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
});

