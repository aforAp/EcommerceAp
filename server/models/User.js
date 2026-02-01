import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
   name: {type: String, required:true},
   email: {type: String, unique: true, required: true},
   name: {type: String, required: true},
   password: {type: String, required: true},
   cartItems: {type: Object, default: {}},
   //once the user created we need to crare one empty object to store the cart datas,.

    }, {minimize: false});

const User = mongoose.models.user ||mongoose.model('user', UserSchema);


export default User;
