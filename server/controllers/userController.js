//Register User: /api/user/register
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Register the User
export const register = async (req, res) => {
    try {
       const {name, email, password} = req.body;

       if(!name || !email || !password) {
        return res.json({success: 'false', message: 'Missing Details'})
       }

       const existingUser = await User.findOne({
        email
       });
       if(existingUser) 
        return res.json({success: 'false', message: 'User already Exists'})

       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await User.create({name, email, password: hashedPassword});
//Once create a user we are using the user id to create jsonwebtoken.
       const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
        {
            expiresIn: '7d'
        }
       );
       res.cookie('token', token, {
        httpOnly: true,
        //it will prevent javascript to access the cookie
        secure: process.env.NODE_ENV === 'production',
        //whenver the node-env in production it will start secure teh application
        sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict',
        //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
       });
       return res.json({sucess : true, user:{email :user.email, name: user.name}})
    }
    catch (error) {
        console.log(error.message);
       res.json({
        success: false, message: error.message
       })
    }
} 


//Login User : /api/user/login

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.json({
                success: false,
                message: 'Email and password are required'
            });
        }
         const user = await User.findOne({
            email
        });
        if(!user) {
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) 
        return res.json({success: false, message: "invalid email or password"});
    const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

    res.cookie('token', token, {
        httpOnly: true,
        //it will prevent javascript to access the cookie
        secure: process.env.NODE_ENV === 'production',
        //whenver the node-env in production it will start secure teh application
        sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict',
        //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
       });
  return res.json({
    success: true, user: {email: user.email, name: user.name}
})    } catch(error) {
console.log(error.message);
res.json({success: false, message: error.message});
    }
}

//Check Auth: /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
const {userId} = req.body;
const user = await User.findById(userId).select("-password")
//- exclude the password
return res.json({
    success:true, user
})
  } catch (error) {
console.log(error.message);
res.json({success: false, message: error.message});
  }
}

//Logout User : /api/user/logout

export const logout = async (req, res) => {
    try {
  res.clearCookie('token', {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
  });
  return res.json({sucsess: true, message: "logged out"})
    }
    catch (error) {
  console.log(error.message);
  res.json({success: false, message: error.message});
    }
}