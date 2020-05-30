var Chance = require("chance");
var chance = new Chance();
var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send(generateEmails())
});

app.listen(3000, function(){
    console.log('Accepting HTTP requests on port 3000.')
});

function generateEmails(){
    var numberOfEmails = chance.integer({
	min:0,
	max:10
    });

    console.log(numberOfEmails);

    var emails = [];
    
    for(var i=0;i<numberOfEmails;i++){
	var domain = chance.domain();
	var email = chance.email({domain: domain});
	var ip = chance.ip();
	var company = chance.company();
	emails.push({
	    domain: domain,
	    email: email,
	    ip: ip,
	    company: company
	});
    }

    console.log(emails);

    return emails;
}
