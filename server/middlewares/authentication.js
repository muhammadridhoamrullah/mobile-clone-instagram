const { connect } = require("../config/mongo");
const { verifyToken } = require("../helpers/jwt");
const { ObjectId } = require("mongodb");

const auth = async (req, db) => {
  try {
    await connect();

    let { authorization } = req.headers;
    // console.log(req.headers.authorization, "ini db");

    if (!authorization) {
      throw new Error("Invalid token");
    }

    let token = authorization.split(" ")[1];

    let payload = verifyToken(token);

    console.log(payload, "<<< payload");

    const findUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(payload.id) });

    if (!findUser) {
      throw new Error("User not found");
    }
    console.log(findUser._id, "finduser");

    return { userId: findUser._id, username: findUser.username };
    // return { userId: }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
