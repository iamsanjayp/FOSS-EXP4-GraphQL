const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

// Temporary task data
let tasks = [
  {
    id: "1",
    title: "Learn GraphQL",
    description: "Study GraphQL basics",
    completed: false
  },
  {
    id: "2",
    title: "Build API",
    description: "Create GraphQL CRUD API",
    completed: true
  }
];

// GraphQL Schema
const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    addTask(
      title: String!
      description: String
      completed: Boolean
    ): Task

    updateTask(
      id: ID!
      title: String
      description: String
      completed: Boolean
    ): Task

    deleteTask(id: ID!): Task
  }
`);

// Resolvers
const root = {

  // READ - Get all tasks
  tasks: () => tasks,

  // READ - Get one task
  task: ({ id }) => {
    return tasks.find(task => task.id === id);
  },

  // CREATE - Add task
  addTask: ({ title, description, completed = false }) => {
    const newTask = {
      id: String(tasks.length + 1),
      title,
      description,
      completed
    };

    tasks.push(newTask);
    return newTask;
  },

  // UPDATE - Update task
  updateTask: ({ id, title, description, completed }) => {
    const task = tasks.find(task => task.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    return task;
  },

  // DELETE - Delete task
  deleteTask: ({ id }) => {
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new Error("Task not found");
    }

    const deletedTask = tasks[index];
    tasks.splice(index, 1);

    return deletedTask;
  }
};

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

// Start server
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000/graphql");
});