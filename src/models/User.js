import mongoose from "mongoose";

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/app_users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const userSchema = mongoose.Schema({
    name: String,
})

export const userModel = mongoose.model("user", userSchema);