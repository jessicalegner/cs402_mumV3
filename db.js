var mongoose = require('mongoose');
var qs = require('querystring');
var url = require('url');
var encrypt = require('./encrypt.js');
var events = require('events');
//Variables
//events to be triggered when action are done
var eventDb;
exports.eventDb = eventDb = new events.EventEmitter();
//Create database scheme
	var myschema = new mongoose.Schema({
		"login": String,
		"password": String
		//"buddies": [type: string]
	});
//Create database model
var credentialModel = mongoose.model('credential', myschema);

//Adds encrypted user's credential
//GETTERS
function getUser(username,response){
	mongoose.connect('mongodb://localhost/cs402mum',function(err){
		if (err){
			throw err;
		}
	});
	
	credentialModel.find({"login": username},function(err,found){
		if(err){
		throw err;
		}
		/* Optional to check if no results
		if(!found){
			var res = 'noresult';
			//user_data event is triggered
			eventDb.emit('user_data',res);
			return res;
		}*/
		
		//var result = '"' + found[0].password + '"';
			mongoose.connection.close();
			var res = JSON.stringify(found[0]);
			//console.log(res);
			if(response){
				response.writeHead(200,
				{
					'Content-type': "text/html",
					'Access-Control-Allow-Origin' : '*',
					//"Content-Length": content.length
				}
				);
				response.end(res);
			}
			//user_data event is triggered
			eventDb.emit('user_data',res);
			return res;
		
		
	});
	//console.log(resDb);
	//return resDb;
	
	
}
//SETTERS
function addUser(login,password,response){
	mongoose.connect('mongodb://localhost/cs402mum',function(err){
		if (err){
			throw err;
		}
	});
	
	var userData = {};
	//userData["login"] = qs.parse(url.parse(fullurl).query).login;
	userData["login"] = login;
	//debug
	console.log(userData["login"]);
	//userData["password"] = qs.parse(url.parse(fullurl).query).password;
	userData["password"] = password;
	//debug
	console.log(userData["login"]);
	var user = new credentialModel({
		"login" : userData["login"],
		"password": encrypt.hashPasswd(userData["password"],encrypt.salt,true) 
	});
	
	//Save infos
	user.save(function(err){
		if(err){ throw err;}
		console.log('User ' + userData["login"] + ' saved!');
	});
	mongoose.connection.close();
	//return 'New user has been saved';
	response.writeHead(200,
		{
			'Content-type': "text/html",
			'Access-Control-Allow-Origin' : '*',
			//"Content-Length": content.length
		}
	);
	response.write('{"status" : "saved"}');
	response.end();
	
}

exports.addUser = addUser;
exports.getUser = getUser;

// DEBUG
//getUser('sebastien.pic');
//addUser('toto','superhero');
