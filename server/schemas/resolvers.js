const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async ({ user = null, params }, res) => {
      return User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      });
    },
  },
  Mutation: {
    createUser: async ({ body }, res) => {
      const user = await User.create(body);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async ({user,body}, res) => {
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
        );
        return updatedUser;
    },
    deleteBook: async ({user, params}, res) => {
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId: params.bookId } } },
            { new: true }
        );
        return updatedUser;
    }


  },
};
module.exports = resolvers;