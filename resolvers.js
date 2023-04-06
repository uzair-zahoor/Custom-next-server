const { PubSub } = require('graphql-subscriptions');
const {User}= require('./models/user')

const pubsub = new PubSub();

const resolvers = {
  Query: {
    user: async (_, { ID }) => {
      const user = await User.findById({ _id: ID }, { uname: 1, sname: 1, email: 1, contact: 1 });
      return user || null;
    },
    getUsers: async () => {
      return await User.find();
    },
    //.sort({createtAt: 1});
  },
  Mutation: {
    createUser: async (_, { userInput: { uname, sname, email, contact } }) => {
      const createUser = new User({ uname, sname, email, contact });
      const res = await createUser.save();
      const userCreated = { id: res.id, ...res._doc };
      pubsub.publish('USER_CREATED', { userCreated }); // publish event on USER_CREATED channel
      console.log(userCreated)
      return userCreated;
    },
    deleteUser: async (_, { ID }) => {
      try {
        const deletedUser = (await User.findOneAndDelete({ _id: ID }));
        if (deletedUser) {
          pubsub.publish('USER_DELETED', { ID });
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete user.');
      }
    },
    updateUser: async (_, { ID, userInput: { uname, sname, email, contact } }) => {
      const userUpdated = await User.findOneAndUpdate({ _id: ID }, { uname, sname, email, contact },  { new: true });
      if (userUpdated) {
        console.log(userUpdated)
        pubsub.publish('USER_UPDATED', { userUpdated }); // publish event on USER_UPDATED channel
        return true;
      }
      return false;
    },    
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator('USER_CREATED'), // listen for USER_CREATED events
    },
    userDeleted: {
      subscribe: () => pubsub.asyncIterator('USER_DELETED'),
      resolve: (payload) => {
        return payload.ID;
      }
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator('USER_UPDATED'), // listen for USER_UPDATED events
    },
  },
};

module.exports = {
  resolvers
};