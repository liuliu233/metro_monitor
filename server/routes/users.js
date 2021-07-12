var express = require('express');
var router = express.Router();
var user = require('../models/user');
var role = require('../models/role');


/* GET users listing. */

router.post('/register', function (req, res) {
   user.findByUsername(req.body.username, function (err, userSave) {
       if(userSave.length !== 0){
           res.json({status: 1, message: "用户已注册", data:req.body});
       }else {
           var registerUser = new user({
               username: req.body.username,
               password: req.body.password,
               userPhone: req.body.userPhone,
               department: '',
               role: [],
               state: 'on'
           });
           registerUser.save(function () {
               res.json({status: 0, message:"注册成功", data:req.body})
           })
       }
   })
});
router.post('/login', function (req, res){
    user.findUserLogin(req.body.username, req.body.password, function (err, userSave) {
        if(userSave.length !== 0){
            res.json({status: 0, message: "登录成功"});
        }else{
            res.json({status: 1, message: "用户名或密码错误"});
        }
    })
});
router.post('/update', function(req, res){
    user.update({username:req.body.username},
        {...req.body},function (err) {
            if(err){
                res.json({status: 1, message: "更新失败"});
            }else{
                res.json({status: 0, message: "更新成功", data:req.body});
            }
        })
});
router.post('/get',function (req,res) {
    user.find({},function(err, doc) {
        if (err) {
            res.json({status: 1, message:err.message})
        } else {
            res.json({status: 0, data:doc})
        }
    })
});
router.post('/delete',function(req,res){
    user.remove({username:req.body.username},function(err){
        if (err) {
            res.json({status: 1, message:err.message})
        }
        else {
            res.json({status: 0, message:"删除成功"})
        }
    })
});
router.post('/updatePassword',function (req, res) {
    user.update({username:req.body.username, password:req.body.password},{password:req.body.newPassword}, function(err, data){
        if(err){
            res.json({status: 1, message: "更新失败"});
        }else{
            if(data.n===0){
                res.json({status: 1, message: "更新失败"});
            }else{
                res.json({status: 0, message: "更新成功"});
            }
        }
    })
});

router.post('/getRole',function (req,res) {
    role.find({},function(err, doc) {
        if (err) {
            res.json({status: 1, message:err.message})
        } else {
            res.json({status: 0, data:doc})
        }
    })
});
router.post('/addRole', function (req, res) {
    role.find({roleName: req.body.roleName}, function(err, roleSave) {
        if(roleSave.length !== 0){
            res.json({status: 1, message: "角色名已存在", data:req.body});
        }else {
            var newRole = new role({
                roleName: req.body.roleName,
                roleType: req.body.roleType,
                roleNote: req.body.roleNote,
                roleOperation: req.body.roleOperation,
            });
            newRole.save(function () {
                res.json({status: 0, message:"添加成功", data:req.body})
            })
        }
    })
});
router.post('/deleteRole',function(req,res){
    role.remove({roleName:req.body.roleName},function(err){
        if (err) {
            res.json({status: 1, message:err.message})
        }
        else {
            res.json({status: 0, message:"删除成功"})
        }
    })
});
router.post('/updateRole', function(req, res){
    role.update({roleName:req.body.roleName},
        {...req.body},function (err) {
            if(err){
                res.json({status: 1, message: "更新失败"});
            }else{
                res.json({status: 0, message: "更新成功"});
            }
        })
});

module.exports = router;
