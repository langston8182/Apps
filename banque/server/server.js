var app = require('express')();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/banque';
var jsonParser = bodyParser.json();
var login = "admin";
var mdp = "admin";

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/login', jsonParser, function(req, res) {
	var loginReq = req.body.login;
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
});

app.get('/users', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		db.collection('users').find().toArray(function(err, result) {
			res.json(result);
		});
		db.close();
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

app.get('/ajout', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		var nom = req.query['nom'];
		var prenom = req.query['prenom'];
		db.collection('users').insertOne({nom:nom, prenom:prenom});
		db.close();
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