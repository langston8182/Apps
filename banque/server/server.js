var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');

var User = require('./user');
var Admin = require('./admin');

var cors = require('cors');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/banque';
var jsonParser = bodyParser.json();
var login = "admin";
var mdp = "admin";
var authRoute = express.Router(); 
app.use('/auth', authRoute);
app.use(jsonParser);
authRoute.use(jsonParser);
app.use(cors());
authRoute.use(cors());

app.use(bodyParser.urlencoded())
mongoose.connect(config.database);
app.set('secret', config.secret);

authRoute.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.header['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			if (err) {
				return res.json({success: false, message: "Erreur d'authentification du token"});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: "Pas de token fournit"
		});
	}
});

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
			res.status(401).send({success: false, message: "Utilisateur inconnu"});
		} else if (admin) {
			if (admin.password != req.body.password) {
				res.status(401).send({success: false, message: "Mot de passe incorrect"});
			} else {
				var token = jwt.sign(admin, app.get('secret'), {
					expiresIn: 1400 //24h
				});
				res.json({
					success: true,
					token: token,
					login: login
				});
			}
		}
	});
});

authRoute.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

authRoute.get('/user', function(req, res) {
	var id = req.query['id'];
	User.find({_id: id}, function(err, user) {
		if (err) {
			throw err;
		}
		res.json(user);
	});
});

authRoute.get('/ajout', function(req, res) {
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

authRoute.get('/modifierUtilisateur', function(req, res) {
	var id = req.query['id'];
	var nom = req.query['nom'];
	var prenom = req.query['prenom'];
	User.findOne({_id: id}, function(err, user) {
		if (err) {
			throw err;
		}
		user.nom = nom;
		user.prenom = prenom;
		user.save(function(err) {
			if (err) {
				throw err;
			}
		});
		res.json({success: true});
	});
});

authRoute.get('/supprime', function(req, res) {
	var id = req.query['id'];
	User.findOne({_id: id}, function(err, user) {
		if (err) {
			throw err;
		}
		user.remove(function(err) {
			if (err) {
				throw err;
			}
		});
		res.json({success: true});
	});
});

app.listen(3000, function() {
	console.log("Listening 3000");
});