const mongoose = require("mongoose");

const BlogPost = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		TitleHeading: String,
		Author: String,
		AuthorId: mongoose.Schema.Types.ObjectId,
		Time: Date,
		Content: String
	}
);
module.exports = mongoose.model('BlogPost', BlogPost)