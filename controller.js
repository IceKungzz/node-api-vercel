const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'Fullstack-login';

module.exports = {
    register: (req,res) =>{
        const db = req.db;
        const data = {
            email: req.body.email,
            password:req.body.password,
            fname:req.body.fname,
            lname:req.body.lname
        };
        bcrypt.hash(data.password,10 ,(err,hash) =>{
            if(err){
                console.log('hash password error '+err);
                return res.status(500).send('Error hashing password');
            }else{
                data.password = hash;
                db.query('INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)',
                [data.email, data.password, data.fname, data.lname], (err, result) => {
                if (err) {
                    console.log('Insert error: ' + err);
                    res.status(500).send('Error inserting data');
                } else {
                    res.send({status: 'ok', message: 'เพิ่มข้อมูลเรียบร้อยแล้ว'});
                }
            }
        );
            }
        })

        
    },
    login: (req,res) =>{
        const db = req.db;
        db.query('select * from users where email = ?', [req.body.email] , (err,result) =>{
            if(err){
                return res.status(500).json({status: 'error', message: 'เกิดข้อผิดพลาด'});
            }
            if(result.length === 0){
                return res.status(401).json({status: 'error', message: "email หรือ password ไม่ถูกต้อง"})
            }
            const hashpassword = result[0].password;

            bcrypt.compare(req.body.password, hashpassword,(err,result_login) =>{
                if(err || !result_login){
                    return res.status(401).json({status: 'error',message:"email หรือ password ไม่ถูกต้อง"})
                }
                    const token = jwt.sign({email: result[0].email },secret,{expiresIn: '1h'});
                    res.status(200).json({status: 'ok' ,message: "login successfully", token});
                    
            });
            
        });
    },
    auth: (req,res) =>{
        try{
            const token =req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, secret)
            const email = decoded.email;
            res.json({status: 'ok', decoded,email})
        }catch(err){
            res.json({status: 'error', message: "not found token"})
        }

    }
};
