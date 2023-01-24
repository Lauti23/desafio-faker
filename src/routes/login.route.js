// import express from "express";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import { userModel } from "../models/User.js";

// export const loginRoute = express.Router();

// loginRoute.get('/', (req, res) => {
//     res.render("login.handlebars")
// })

// loginRoute.post('/', (req, res) => {
//     let user = new userModel({
//         name: req.body.name
//     })
//     user.save((err, docs) => {
//         if(err) {
//             res.redirect('/login')
//         } else {
//             req.session.user = docs
//             res.redirect('/');
//         }
//     })
// })