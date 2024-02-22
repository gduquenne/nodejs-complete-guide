import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import url from 'url';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoSession from 'connect-mongodb-session';
const MongoDBStore = mongoSession(session);

import { get404 } from './controllers/error.js';
import User, { findById, findOne } from './models/user.js';

const MONGO_URI =
	'mongodb+srv://greg:AzertY123*@atlascluster.ibqsnir.mongodb.net/?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
	uri: MONGO_URI,
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
	.connect(MONGO_URI)
	.then(() => {
		findOne()
			.then(user => {
				if (!user) {
					const user = new User({
						name: 'Max',
						email: 'max@test.com',
						cart: {
							items: [],
						},
					});
					user.save();
				}
			})
			.catch(err => console.log(err));
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});
