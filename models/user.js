const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const dishSchema= new Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Currency,
		required: true
	}
});
const User = new Schema({
    emailid: {
    	type: String,
    	required: true,
    	unique: true
    },
    password: {
    	type: String,
    	required: true
    },
    verified: {
    	type: Boolean,
    	default: false
    },
    restaurantdetails: {
    	name: {
			type: String
		},
		address: {
			type: String
		},
		latlng: {
			lat: {
				type: Number
			},
			lng: {
				type: Number
			}
		}
    },
    dishdetails: [dishSchema]
},{
	timestamps: true
});

module.exports = mongoose.model("User",User);