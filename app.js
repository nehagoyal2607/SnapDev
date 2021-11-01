const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const fp = require("fingerpose");
const passport = require('passport');
const SnapchatStrategy = require('passport-snapchat').Strategy;

const users = require("./models/user");
const signs = require("./models/sign");
const webs = require('./models/webinar');
const threads = require('./models/thread');
const wordsmodel = require('./models/words');
const words = require("./models/words");

require('dotenv').config();
passport.use(new SnapchatStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/snapchat/callback',
    profileFields: ['id', 'displayName', 'bitmoji'],
    scope: ['user.display_name', 'user.bitmoji.avatar'],
    pkce: true,
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));
  passport.serializeUser(function(user, cb) {
	cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
  });


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use('/node_modules',express.static(__dirname+'/node_modules'))
app.use(express.json())
app.use(expressSanitizer());
app.use(flash());
app.use(session({
	secret:"Our first snap app",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(async function(req,res,next){
	const currentUser = await users.getUserById(req.session.user_id);
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	// console.log(currentUser);
	next();
})



const isLoggedIn = function(req,res,next){
	if(!req.session.user_id){
		// if(req.session){
		// 	req.session.redirectUrl = req.headers.referer || req.originalUrl || req.url;
		// }
		res.redirect('/login');
	}else{
		next();
	}
}
app.get('/login/snapchat',
  passport.authenticate('snapchat'));

app.get('/login/snapchat/callback',
  passport.authenticate('snapchat', { failureRedirect: "/login/snapchat" }),
  async function(req, res) {
	req.session.user_id = req.user.id;
	const existing = await users.getUserById(req.user.id);
	if(!existing){
		const newUser = await users.addUser({
			id: req.user.id,
			username: req.user.displayName
		});
	
		
		// req.flash("success", "Successfully Registered.")
		console.log("registered");
	}
	
	// console.log(req.user);
    res.redirect("/dash");
  });

app.get("/login", function(req, res){
	res.render("login");
})

// app.get("/inner", function(req, res){
// 	res.render("inner-page");
// })
app.get("/index", function(req, res){
	res.render("index");
})
app.get("/pagination", async function(req, res){
	const sample = await words.getSign();
	res.render("pagination", {words: sample});
})
app.get("/webinar", isLoggedIn, async function(req, res){
	const webinars = await webs.getWebinars();
	// console.log(webinars);
	res.render("webinar", {webinars:webinars});
})
app.get("/webinar/:id", isLoggedIn, async function(req, res){
	res.render("live", {meetingId:req.params.id});
})
app.get("/translate", async function(req, res){
	const data = await signs.getSign();
	// console.log(data[0]);
	res.render("translate", {sample: data[0]});
})
app.get("/translateTwo", async function(req, res){
	const data = await signs.getSign();
	// console.log(data[0]);
	res.render("translateTwo", {sample: data[0]});
})
app.get("/progress", isLoggedIn, async function(req, res){
	const userData = await users.getUsers();
	userData.sort(function (a, b) {
		return b.score - a.score;
	  });
	res.render("progress", {users:userData});
})
app.get("/profile", isLoggedIn, async function(req, res){
	const signData = await signs.getSign();
	const userData = await users.getUserById(req.session.user_id);
	const usersData = await users.getUsers();
	usersData.sort(function (a, b) {
		return b.score - a.score;
	  });
	res.render("profile", {signs:signData[0], user:userData, users:usersData});
})
app.get("/dash", isLoggedIn, async function(req, res){
	const data = await signs.getSign();

	res.render("dash", {sample: data[0]});
})
// app.get("/inner-page", function(req, res){
// 	res.render("inner-page", {symb: symbolll});
// })
// let symbolll = -1;
app.get("/practice/:symbol", isLoggedIn, async function(req, res){
	// symbolll = req.params.symbol;
	const data = await signs.getSign();
	const user = await users.getUserById(req.session.user_id);
	// console.log(user);
	res.render("inner-page", {sample:data[0], symb: req.params.symbol, user});
})
app.post("/login", async(req, res)=>{
	const {username, password} = req.body;
	
	const user = await users.getUserByName(username);
	if(user == null || user.length == 0){
		req.flash("error", "User doesn't exist")
		console.log("doesn't exist");
		res.redirect("/login");
	}else{
		const validPassword = await bcrypt.compare(password, user.password);
		if(validPassword){
			req.session.user_id = user.id;
			console.log(user.id);
			// req.flash("success", "Successfully Logged In.")
			var redirectionUrl ='/dash';
			res.redirect(redirectionUrl);

		}else{
			console.log("fail");
			req.flash("error", "Incorrect username or password")
			res.redirect("/login");
		}
	}
	// console.log(user);
	
})

app.get("/register", function(req, res){
	res.render("register");
})

app.post("/register", async function(req, res){
	const user = users.getUserByName(req.body.username);
		
			const {password, username} = req.body;
			const hash = await bcrypt.hash(password, 12);

			const newUser = await users.addUser({
				username: username,
				password: hash,
			});

			req.session.user_id = newUser.id;
			// req.flash("success", "Successfully Registered.")
			console.log("registered");
			res.redirect("/dash");
})
app.get("/logout", (req, res)=>{
	req.session.user_id = null;
	res.redirect("/");
})
app.post("/update", async function(req, res){
	await users.updateScore(req.session.user_id, req.body.score, req.body.symbol);
	console.log("updated");
})
app.post("/addWebinar", async function(req, res){
	const newWeb = await webs.addWebinar({
		title:req.body.title,
		meetingId:req.body.meetingId,
		timings:req.body.timings,
		host:req.body.host,
		description: req.body.description
	})
	res.redirect("/webinar");
})
app.post("/forum", isLoggedIn, async function(req, res){
	const user = await users.getUserById(req.session.user_id);
	const author = user.username;
	await threads.addThread({
		title:req.body.title,
		description:req.body.description,
		author:author,
		authorImg: req.user.bitmoji.avatarUrl
	})
	res.redirect("/forum");
})
app.get("/forum", isLoggedIn, async function(req, res){
	const threadData = await threads.getThreads();
	res.render("forum", {threads:threadData});
})
app.post("/forum/:id/addComment", isLoggedIn, async function(req, res){
	const user = await users.getUserById(req.session.user_id);
	const author = user.username;
	await threads.addComment(req.params.id, {
		title:req.body.title,
		description:req.body.description,
		author:author,
		authorImg: req.user.bitmoji.avatarUrl
	})
	res.redirect("/forum/"+req.params.id);
})
app.get("/forum/:id", isLoggedIn, async function(req, res){
	const data = await threads.getThreadByTitle(req.params.id);
	res.render("comments", {data:data});
})
app.get("/gesture", async function(req, res){
	res.render("gesture", {fp:fp});
})
app.get("/", async function(req, res){
	// await users.deleteUser();
	// const data = await users.getUsers();
	// console.log(data);
	// console.log(req.session.user_id);
	// const updated = await users.updateScore(req.session.user_id, 80);
	// console.log(updated);
	// const currentUser = await users.getUserById("AESIJFYBr5kbNStKXF+CfYGxU2L7Ev5uWtv6dkG3NeKP4rT");
	// console.log(currentUser);

	// const sample = await signs.getSign();
	// console.log(sample);
	// await webs.deleteWebinars();
	// await threads.deleteThreads();
	// const sample = await words.getSign();
	// console.log(sample);
	// await wordsmodel.addSign({
	
	// });
	const sample = await words.getSign();
	if(req.session.user_id!=null){
		res.redirect("dash");
	} else{
		res.render("index", {words: sample});
	}
  	
})
const port = process.env.PORT || 3000
app.listen(port, process.env.IP, function(){
	console.log("App is running.");
})