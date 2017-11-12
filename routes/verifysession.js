const session = require('express-session');
verifysession = function(req,res,next) {
    if(req.session.mailid) {
    	console.log("mailid " + req.session.mailid);
    	console.log("userid " + req.session.userid);
        next();
    }
    else {
        var err = new Error("Not logged in!");
        console.log(req.session.mailid);
        next(err);  //Error, trying to access unauthorized page!
    }
};
module.exports=verifysession;