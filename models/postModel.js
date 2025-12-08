const mongoose = require('mongoose');

const postSchema =new mongoose.schema(
  {
    title: {type: String, required:true},
    Content: {type: String, required:true},
    author: {type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  {timestamps: true}
);

module.exports =mongoose.model('Post', postSchema);