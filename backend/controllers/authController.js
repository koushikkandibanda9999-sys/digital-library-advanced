const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "library_secret_key";

// REGISTER USER
exports.register = async (req, res) => {

  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users_login (username,email,password,role) VALUES (?,?,?,?)",
    [username,email,hashed,"admin"],
    (err)=>{
      if(err) return res.status(500).json({message:"User already exists"});

      res.json({message:"Registration successful"});
    }
  );

};


// LOGIN USER
exports.login = (req,res)=>{

  const { email,password } = req.body;

  db.query(
    "SELECT * FROM users_login WHERE email=?",
    [email],
    async (err,result)=>{

      if(result.length==0){
        return res.json({message:"User not found"});
      }

      const user=result[0];

      const valid=await bcrypt.compare(password,user.password);

      if(!valid){
        return res.json({message:"Wrong password"});
      }

      const token=jwt.sign({id:user.id},SECRET,{expiresIn:"2h"});

      res.json({token});
    }
  );

};