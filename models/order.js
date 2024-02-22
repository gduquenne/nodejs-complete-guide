import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	products: [
		{
			product: { type: Object, required: true },
			quantity: { type: Number, required: true },
		},
	],
	user: {
		name: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
});

export default new mongoose.model('Order', orderSchema);
