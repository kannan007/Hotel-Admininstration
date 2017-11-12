const express = require('express');
const Userrouter = express.Router();
const nodemailer = require("nodemailer");
const Userdetails = require('../models/user');
const session = require('express-session');
const verify = require('./verifysession');

let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "",
        pass: ""
    }
});
let rand,mailOptions,host,link;
/* GET users listing. */
Userrouter.route('/')
.get(verify,(req, res, next) => {
  Userdetails.find({}).then(users=> res.send(users)).catch(err=> next(err));
});
Userrouter.post('/register',(req,res,next) => {
	console.log("inside");
	console.log(req.body.mailid);
    rand=Math.floor((Math.random() * 100) + 54);
	host=req.get('host');
	link="http://"+req.get('host')+"/users/verify?id="+rand;
	mailOptions={
		to : req.body.mailid,
		subject : "Please confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
	}
	Userdetails.create({"emailid": req.body.mailid,"password": req.body.password}).then(() => {
		smtpTransport.sendMail(mailOptions, (error, response) => {
		   	if(error) {
		        console.log(error);
				res.end("Error sending mail");
			}
			else {
		        console.log("Message sent: " + response.message);
				res.end("An email is sent");
		    }
		});
	}).catch((err)=>{
		console.log(err);
		//res.end("Error" + err);
		next(err);
	});
});

Userrouter.get('/verify',(req,res,next) => {
	console.log(req.protocol+":/"+req.get('host'));
	if((req.protocol+"://"+req.get('host'))==("http://"+host))
	{
		console.log("Domain is matched. Information is from Authentic email");
		if(req.query.id==rand)
		{
			console.log("email is verified");
			Userdetails.findOneAndUpdate({ emailid: mailOptions.to },{ $set: { verified: true }}, { new: true }).then((user) => {
				res.end("<a href='http://localhost:3000'> Click here to login </a><h1>Email "+mailOptions.to+" is been Successfully verified.</h1>");
			}).catch(err=> next(err));
		}
		else
		{
			console.log("email is not verified");
			res.end("<h1>Bad Request</h1>");
		}
	}
	else
	{
		res.end("<h1>Request is from unknown source");
	}
});

Userrouter.post('/login',(req,res,next) => {
	console.log("Inside login router");
	Userdetails.findOne({emailid: req.body.mailid,password: req.body.password}).then((user)=> {
		console.log(user);
		if(user) {
			console.log(user.verified);
			if(user.verified) {
				req.session.mailid=user.emailid;
				req.session.userid=user._id;
				console.log("inside verified");
				res.json({userdetails:user});
			}
			else {
				res.end("verify");
			}
		}
		else {
			let err=new Error("Username or password is invalid");
			next(err);
		}
	}).catch(err=> next(err));
});
Userrouter.get('/logout',(req,res,next) => {
	req.session.destroy(() => {
	    console.log("user logged out.");
	    res.send("Logged out Succesfully");
	});
});

Userrouter.route('/:userId')
.get(verify,(req,res,next) => {
	Userdetails.findById(req.params.userId).then(user=>res.send(user)).catch(err=> next(err));
})
.put(verify,(req,res,next) => {
	Userdetails.findByIdAndUpdate(req.params.userId,{$set: req.body}, {new: true}).then(user=> res.send("Details Updated")).catch(err=> next(err));
});
Userrouter.post('/:userId/dishes',verify,(req,res,next) => {
	Userdetails.findById(req.params.userId).then((user)=> {
		user.dishdetails.push(req.body);
		user.save().then(dish=> res.send(dish)).catch(err=> next(err));
	}).catch(err=> next(err));
})
Userrouter.route('/:userId/dishes/:dishId')
.get(verify,(req,res,next) => {
	Userdetails.findById(req.params.userId).then(dish=> {
		res.send(dish.dishdetails.id(req.params.dishId));
	}).catch(err=> next(err));
})
.put(verify,(req,res,next) => {
	Userdetails.findById(req.params.userId).then((dishes)=> {
		console.log("inside");
		console.log(req.body);
		console.log(req.body.name);
		console.log(req.body.price);
		dishes.dishdetails.id(req.params.dishId).remove();
		dishes.dishdetails.push(req.body);
		dishes.save().then(dish=> res.end("Updated Dish")).catch((err) => {
			console.log(err);
			next(err)
		});
	}).catch(err=> next(err));
});
module.exports = Userrouter;
