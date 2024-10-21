const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
  


type follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
}

type followers {
 follower: user
}

type followings {
  following: user
}

type user {
  username: String
}

type SuccessResponse {
    message: String
}

input followUser {
    followingId: ID!
}
 

type Query {
    getFollower(followingId: ID!): [followers]
  getFollowing(followerId: ID!): [followings]
}

type Mutation {
    createFollow(input: followUser) : SuccessResponse
}


`;

const resolvers = {
  Query: {
    getFollower: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;

      const { userId, username } = await authentication();
      const { followingId } = args;

      const follow = db.collection("follows");

      const agg = [
        {
          $match: {
            followingId: new ObjectId(followingId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower",
          },
        },
        {
          $unwind: {
            path: "$follower",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            "follower.password": 0,
          },
        },
      ];

      const cursor = follow.aggregate(agg);
      const result = await cursor.toArray();
      console.log(result);
      return result;
    },
    getFollowing: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();
      const { followerId } = args;

      const following = db.collection("follows");
      const agg = [
        {
          $match: {
            followerId: new ObjectId(followerId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            "following.password": 0,
          },
        },
      ];

      const cursor = following.aggregate(agg);
      const result = await cursor.toArray();
      
      console.log(result);
      return result;
    },
  },
  Mutation: {
    createFollow: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();
      const { followingId } = args.input;
      const follow = db.collection("follows");

      const followUser = await follow.insertOne({
        followingId: new ObjectId(followingId),
        followerId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { message: "Success follow user" };
    },
  },
};

module.exports = { typeDefs, resolvers };
