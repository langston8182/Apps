var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');

var User = require('./user');
var Admin = require('./admin');

var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/banque';
var jsonParser = bodyParser.json();
var login = "admin";
var mdp = "admin";
var authRoute = express.Router(); 
app.use('/', authRoute);

app.use(bodyParser.urlencoded())
mongoose.connect(config.database);
app.set('secret', config.secret);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/login', jsonParser, function(req, res) {
	Admin.findOne({
		login: req.body.login,
	}, function(err, admin) {
		if (err) {
			throw err;
		}
		if (!admin) {
			res.json({success: false, message: "Utilisateur inconnu"});
		} else if (admin) {
			if (admin.password != req.body.password) {
				res.json({success: false, message: "Mot de passe incorrect"});
			} else {
				var token = jwt.sign(admin, app.get('secret'), {
					expiresIn: 1440 //24h
				});
				res.json({
					success: true,
					token: token
				});
			}
		}
	});
});

/*app.post('/login', jsonParser, function(req, res) {
	var loginReq = req.body.login;
	console.log(loginReq);
	var mdpReq = req.body.password;
	var token;
	if (loginReq == login && mdpReq == mdp) {
		token = "azerty";
	}
	if (token) {
		result = {token:token,login:loginReq};
		res.json(result);
	} else {
		throw new Error("erreur");
	}
});*/

authRoute.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

app.get('/user', function(req, res){
	MongoClient.connect(url, function(err, db) {
		var id = req.query['id'];
		db.collection('users').find({_id:ObjectID(id)}).toArray(function(err, result) {
			res.json(result);
		});
	});
});

/*app.get('/ajout', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		var nom = req.query['nom'];
		var prenom = req.query['prenom'];
		db.collection('users').insertOne({nom:nom, prenom:prenom});
		db.close();
	});
});*/
app.get('/ajout', function(req, res) {
	var user = new User({
		nom: req.query['nom'],
		prenom: req.query['prenom']
	});
	user.save(function(err) {
		if (err) {
			throw err;
		}
		res.json({success: true});
	});
});

app.get('/modifierUtilisateur', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		var id = req.query['id'];
		var nom = req.query['nom'];
		var prenom = req.query['prenom'];
		db.collection('users').updateOne({_id:ObjectID(id)}, 
			{
				nom:nom,
				prenom:prenom
			});
	});
});

app.get('/supprime', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		var id = req.query['id'];
		db.collection('users').remove({_id:ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				console.log(err);
			}
		});
		db.close();
	});
});

app.listen(3000, function() {
	console.log("Listening 3000");
});