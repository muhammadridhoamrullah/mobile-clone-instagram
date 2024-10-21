const { ObjectId } = require("mongodb");
const redis = require("../config/redisConfig");

const typeDefs = `#graphql
  


  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    createdAt: String
    updatedAt: String
    comments: [Comment]
    likes: [Like]
    author: Author
}

type Author {
  name: String
}

type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
}

type Like {
    username: String!
    createdAt: String
    updatedAt: String
}

type SuccessResponse {
  message: String
}

type JumlahLike {
  jumlahLike: Int
}


input CreatePosting {
    content: String!
    tags: [String]
    imgUrl: String

}

input createComment {
    PostId: ID!
    content: String!
}

input createLike {
    PostId: ID!
}
 
type Query {
    getPost: [Post]
    getPostById(_id: ID!): Post
    getTotalLike(_id: ID!) : JumlahLike
}

type Mutation {
    createPost(input: CreatePosting): SuccessResponse
    createCommentPost(input: createComment): SuccessResponse
    createLikePost(input: createLike): SuccessResponse
}
`;

const resolvers = {
  Query: {
    getPost: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();
      console.log(authentication, "authen");

      console.log(userId, "user id di post");
      console.log(username, "user di get post");

      const cacheKey = "posts";
      const cachedPosts = await redis.get(cacheKey);

      if (cachedPosts) {
        console.log("Data dari cache Redis");
        return JSON.parse(cachedPosts);
      }

      const posts = db.collection("posts");
      const agg = [
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const cursor = await posts
        .aggregate(agg)
        .sort({ createdAt: -1 })
        .toArray();

      console.log(cursor);

      await redis.set(cacheKey, JSON.stringify(cursor), "EX", 3600);

      return cursor;
    },
    getPostById: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;
      const { _id } = args;
      const { userId, username } = await authentication();
      const posts = db.collection("posts");

      const agg = [
        {
          $match: {
            _id: new ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const result = await posts.aggregate(agg).toArray();
      return result[0];

      // const agg = [
      //   {
      //     '$match': {
      //       '_id': new ObjectId('667bdfeb29e4641909717de0')
      //     }
      //   }, {
      //     '$lookup': {
      //       'from': 'users',
      //       'localField': 'comments.username',
      //       'foreignField': 'username',
      //       'as': 'username'
      //     }
      //   }, {
      //     '$unwind': {
      //       'path': '$username',
      //       'preserveNullAndEmptyArrays': true
      //     }
      //   }, {
      //     '$project': {
      //       'username._id': 0,
      //       'username.password': 0
      //     }
      //   }
      // ];

      // const client = await MongoClient.connect(
      //   ''
      // );
      // const coll = client.db('instagram-gc01-ridho').collection('posts');
      // const cursor = coll.aggregate(agg);
      // const result = await cursor.toArray();
      // await client.close();
    },
    getTotalLike: async (_, args, contextValue) => {
      const { _id } = args;
      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();

      const posts = db.collection("posts");

      const jumlahLikePost = await posts.findOne({ _id: new ObjectId(_id) });

      // console.log(jumlahLikePost.likes.length);
      const result = jumlahLikePost.likes.length;
      return { jumlahLike: result };
    },
  },
  Mutation: {
    createPost: async (_, args, contextValue) => {
      console.log(args, "ini args create post");

      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();
      console.log(userId, "userId");
      const { content, imgUrl, tags } = args.input;

      const posts = db.collection("posts");

      const newPost = await posts.insertOne({
        content,
        imgUrl,
        tags,
        authorId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(newPost, "Ini post baru");
      return { message: "Success post something" };
    },
    createCommentPost: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;
      const { userId, username } = await authentication();
      // console.log(contextValue, " <<< ini context");

      const { content, PostId } = args.input;

      const post = db.collection("posts");

      await post.updateOne(
        { _id: new ObjectId(PostId) },
        {
          $push: {
            comments: {
              content: content,
              username: username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      return { message: "Success commenting post" };
    },
    createLikePost: async (_, args, contextValue) => {
      const { db, authentication } = contextValue;

      const { userId, username } = await authentication();

      const { PostId } = args.input;

      const post = db.collection("posts");

      await post.updateOne(
        { _id: new ObjectId(PostId) },
        {
          $push: {
            likes: {
              username: username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      return { message: "Success like post" };
    },
  },
};

module.exports = { typeDefs, resolvers };
