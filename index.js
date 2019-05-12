const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid/v4')
const md5 = require('md5');
/*
 * App Setup
 */
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use(session({
	genid: (req) => {
		return uuid() // use UUIDs for session IDs
	  },
	resave: false,
	saveUninitialized: false,
	secret: "s3cr3t",
}));

app.use(express.static("Public"));


const mongoose = require("mongoose");
const BlogPost = require("./models/blogSchema");
const LoginCreds = require("./models/loginSchema");
const mongoUrl = "mongodb+srv://elec:elec@maymay-b5q4y.mongodb.net/test?retryWrites=true"; //Connect URL - mongodb+srv://<username>:<pass>@<>.mongodb.net/test?retryWrites=true
mongoose.connect(mongoUrl,  { useNewUrlParser: true });

const CheckLogin = (req, res, next)=>{
	if(req.session.userID)
	{
		res.redirect('/');
	}
	else{
		next();
	}
}

/*
 * Express 
 */
app.get('/', (req, res)=>{ 
	if(req.session.userID)
		console.log(`GET /. ${req.session.userID} Logged in `);
	BlogPost.find({}, (err, posts)=>{
		if(req.session.userID)
			res.render("index", {posts:posts, username: req.session.username, userID: req.session.userID,  loggedIn: true});
		else
			res.render("index", {posts:posts, username:"Guest", userID: 0, loggedIn: false});
	})
});

//Login Route
app.route('/login')
	.get(CheckLogin, (req, res)=>{
		res.render("login");
	})
	.post(CheckLogin, (req, res)=>{

		var usr = req.body.email;
		var pass = md5(req.body.password);	//Stores the password in md5 cuz security
		usr = usr.toLowerCase();
	
		LoginCreds.find({email: usr, password: pass}, (err, cred)=>{
			if(err)
				return;
			console.log(cred);
			if(isEmpty(cred))
			{
				PageRedirect(res, "./login", "Login Failed... Redirecting to previous page.");
			}
			else
			{ 
				req.session.userID = cred[0].id;
				req.session.username = cred[0].username;
				PageRedirect(res, "	/", "Successfully Logged in...");
			}
		});
	});

//Register Route
app.route('/register')
	.get(CheckLogin, (req, res)=>{
		res.render("register");
	})
	.post(CheckLogin, (req, res)=>{
		var name = req.body.name;
		var eemail = req.body.email.toLowerCase();
		var pass = md5(req.body.password);
	
		
	
		const RegCreds = new LoginCreds({
			_id: new mongoose.Types.ObjectId(),
			username: name,
			email: eemail,
			password: pass
		})
	
		LoginCreds.find({email: eemail}, (err, cred)=>{
			if(err)
				return;
			if(isEmpty(cred))
			{
				RegCreds.save().then(result => {
					PageRedirect(res, "./login", "Successfully Registered...");
				}).catch(err=> console.log(err));
			}
			else
			{
				PageRedirect(res, "./register", "Email Already Registered...");
			}
		});
	});

//Logout
app.get('/logout', (req, res)=>{
	if(!req.session.userID)
	{
		PageRedirect(res, "./", "Invalid Request")
	}
	else
	{
		req.session.destroy();
		PageRedirect(res, "./", "Logged out");
	}
})

//Post
app.post('/post', (req, res)=>{
	//Add Validation code later

	if(!req.session.userID){
		PageRedirect(res, "./", "Why?");
		return;
	}

	var newBlog = new BlogPost({
		_id: new mongoose.Types.ObjectId(),
		TitleHeading: req.body.title,
		Author: req.session.username,
		AuthorId: req.session.userID,
		Time: new Date(),
		Content: req.body.content
	});

	newBlog.save().then(result=>{
		res.redirect("/");
	}).catch(err=>console.log(err));
});
//Post Delete
app.post('/DeletePost', (req, res)=>{
	BlogPost.deleteOne({_id: req.body.PostId, AuthorId: req.session.userID}, (err)=>{
		console.log(`Failed to delete post id ${req.body.PostId} requested by user id ${req.session.userID}`);
	});

	res.redirect('/');
});
//Post Edit
app.post('/editPost', (req,res)=>{
	if(req.body.submit == "cancel")
		res.redirect('/');
	else
	{
		BlogPost.findOne({_id: req.body.postId, AuthorId: req.session.userID}, (err, post)=>{
			if(isEmpty(post))
			{
				console.log("No post found when editing");
				res.redirect('/');
			}
			else{
				if(post.AuthorId == req.session.userID)
				{
					post.TitleHeading = req.body.title;
					post.Content = req.body.content;
					post.save().then(result=>{
						res.redirect('/');
					}).catch(err=>{
						if (err)
							console.log(err);
					})
				}
				else{
					console.log("Nani the F? AuthorId != UserId");
					res.redirect('/');
				}
			}
		})
	}
});

//User Page
app.get('/user/:id'), (req, res)=>{
	res.redirect('/');
}

 app.listen(8080, ()=>{
	 console.log("Listening on Port 8080.");
 });

/*
 *	Other Functions
 */

function isEmpty(obj) {
	var jsonstring = JSON.stringify(obj);
	if(jsonstring.length > 2)
		return false;
	else
		return true;
}

function PageRedirect(res, url, message)
{
	var rUrl = "2;" + url;
	res.render("redirect", {redirectUrl: rUrl, pageText: message});
}