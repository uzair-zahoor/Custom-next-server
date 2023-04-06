const { gql }= require('graphql-tag');
const typeDefs = gql`
type User {
    id: ID!
    uname: String,
    sname: String,
    email: String,
    contact: String
  
  }
  input UserInput{
    uname: String,
    sname: String,
    email: String,
    contact: String
  }
  type Query {
    user(ID: ID!): User!
    getUsers: [User]
  }
  type Mutation{
    createUser(userInput: UserInput): User!
    deleteUser(ID: ID!): Boolean!
    updateUser(ID: ID!, userInput: UserInput): Boolean
  }
  type Subscription {
    userCreated: User
    userDeleted: ID
    userUpdated: User
  }
`;

module.exports= {
  typeDefs,
};