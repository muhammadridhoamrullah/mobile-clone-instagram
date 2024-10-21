require("dotenv").config();
const { connect } = require("../config/mongo");

const data = [
  {
    content: "post pertama",
    tags: ["otomotif", "motogp"],
    imgUrl:
      "https://cdn-8.motorsport.com/images/mgl/0rG37m52/s8/marc-marquez-gresini-racing.jpg",
    authorId: "667a5c0f8ae12d3c8f727584",
    comments: [
      {
        content: "hai",
        username: "mango",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    likes: [
      {
        username: "mango",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    content: "post kedua",
    tags: ["teknologi", "inovasi"],
    imgUrl:
      "https://cdn.pixabay.com/photo/2016/11/29/12/54/code-1869268_960_720.jpg",
    authorId: "667a3bec6baca55402867098",
    comments: [
      {
        content: "artikel menarik!",
        username: "banana",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    likes: [
      {
        username: "banana",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    content: "post ketiga",
    tags: ["kesehatan", "fitness"],
    imgUrl:
      "https://cdn.pixabay.com/photo/2016/11/19/14/00/running-1834857_960_720.jpg",
    authorId: "667a391ec953480f611e172a",
    comments: [
      {
        content: "sangat informatif",
        username: "apple",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    likes: [
      {
        username: "apple",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    content: "post keempat",
    tags: ["kuliner", "resep"],
    imgUrl:
      "https://cdn.pixabay.com/photo/2016/11/18/15/27/salad-1834651_960_720.jpg",
    authorId: "66799be9503a05d42db719ee",
    comments: [
      {
        content: "mau coba resep ini!",
        username: "grape",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    likes: [
      {
        username: "grape",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    content: "post kelima",
    tags: ["travel", "wisata"],
    imgUrl:
      "https://cdn.pixabay.com/photo/2016/10/13/09/06/monument-valley-1733810_960_720.jpg",
    authorId: "66799ba0c64def87fdff82e4",
    comments: [
      {
        content: "pemandangannya indah sekali",
        username: "orange",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    likes: [
      {
        username: "orange",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedPost() {
  try {
    console.log("hai");
    const db = await connect();
    console.log(db, "ini db");
    await db.collection("posts").insertMany(data);

    console.log("success seed post");
  } catch (error) {
    console.log(error, "error di seed post");
  }
}

module.exports = seedPost;
