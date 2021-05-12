const express = require("express");
const session = require("express-session");
var bodyParser = require('body-parser');

const path = require("path")
var fs = require('fs');
var formidable = require('formidable');
const { body,validationResult } = require('express-validator');
const utils = require("./utils")

exports.myaccount = async function(req, res, callback){
    var db;
    try{
        var id = req.session.customer_id;
        if(!id){
            res.redirect("/login");
        }
        var jsonData = "{\"_id\":\""+id+"\"}";
        console.log("customer id: "+jsonData);
        var json = JSON.parse(jsonData);
        db = new utils.DBUtils(utils.uri);
        await db.getAllData(utils.DBUtils.customerTable, json, {limit: 1}, {}, async doc => {
            if(doc){
                console.log("Login Successful !!!");
                var _doc = utils.isArray(doc)?doc.length>0?doc[0]:null:doc;
                callback(_doc);
                return;
            }else{
                console.log("Login Failed !!!");
            }
        });
        
    }catch(error){
        console.log(error);
    }
    return null;
}

exports.admin = async function(req, callback){
    var db;
    try{
        var sess = req.session;
        var id = sess.admin_id;
        db = new utils.DBUtils(utils.uri);
        var jsonData = "{\"_id\":\""+id+"\"}";
        var json = JSON.parse(jsonData);
        await db.getAllData(utils.DBUtils.adminTable, json, {limit: 1}, {}, async doc => {
            if(!utils.isEmpty(doc)){
                console.log("Login Successful !!!");
                var _doc = utils.isArray(doc)?doc.length>0?doc[0]:null:doc;
                callback(_doc);
                return;
            }else{
                console.log("Login Failed !!!");
            }
        });
        
    }catch(error){
        console.log(error);
    }
    return null;
}


exports.customerLogin = async function(req, callback){
    var db;
    try{
        var userData = "";
        //console.log(JSON.stringify(req.body));
        for(key in req.body){
            var value = req.body[key];
            userData += (userData?",":"")+("\"user-data."+key+"\": \""+value+"\"");
        }
        //userData = (userData?"\"user-data\":{"+userData+"}":"");
        if(userData){
            db = new utils.DBUtils(utils.uri);
            var jsonData = "{"+userData+"}";
            var json = JSON.parse(jsonData);
            console.log("customerlogin: "+jsonData);
            await db.getAllData(utils.DBUtils.customerTable, json, {limit: 1}, {"_id":1}, doc=> {
                console.log("result: "+JSON.stringify(doc));
                if(!utils.isEmpty(doc)){
                    console.log("Login Successful !!!");
                    var _doc = utils.isArray(doc)?doc.length>0?doc[0]:null:doc;
                    callback(_doc);
                    return;
                }else{
                    console.log("Login Failed !!!");
                }
            });
        }
    }catch(error){
        console.log(error);
    }
    return null;
}

exports.adminLogin = async function(req, callback){
    var db;
    try{
        var userData = "";
        //console.log(JSON.stringify(req.body));
        for(key in req.body){
            var value = req.body[key];
            userData += (userData?",":"")+("\"user-data."+key+"\": \""+value+"\"");
        }
        //userData = (userData?"\"user-data\":{"+userData+"}":"");
        if(userData){
            db = new utils.DBUtils(utils.uri);
            var jsonData = "{"+userData+"}";
            var json = JSON.parse(jsonData);
            //console.log("adminlogin: "+jsonData);
            var doc = await db.getAllData(utils.DBUtils.adminTable, json, {limit: 1}, {"_id":1}, doc=> {
                console.log("result: "+JSON.stringify(doc));
                if(!utils.isEmpty(doc)){
                    console.log("Login Successful !!!");
                    var _doc = utils.isArray(doc)?doc.length>0?doc[0]:null:doc;
                    callback(_doc);
                    return;
                }else{
                    console.log("Login Failed !!!");
                }
            });
        }
    }catch(error){
        console.log(error);
    }
    return null;
}

exports.customerRegistration = async function(req, callback){
    var db;
    try{
        var hexDatetime = Date.now().toString(16);
        var userData = "";
        for(key in req.body){
            var value = req.body[key];
            userData += (userData?",":"")+("\""+key+"\": \""+value+"\"");
        }
        userData = (userData?"\"user-data\":{"+userData+"}":"");
        if(userData){
            var jsonData = "{\"_id\":\""+hexDatetime+"\","+userData+"}";
            console.log(jsonData);
            db = new utils.DBUtils(utils.uri);
            var json = JSON.parse(jsonData);
            var email = json["user-data"].email;
            var reqJson = JSON.parse("{\"user-data.email\":\""+email+"\"}");
            await db.countRecords(utils.DBUtils.customerTable, reqJson, {}, async countBack => {
                console.log("count: "+countBack);
                if( countBack == 0){
                    db = new utils.DBUtils(utils.uri);
                    var isInserted = await db.storeData(utils.DBUtils.customerTable, jsonData);
                    callback(isInserted);
                    return;
                }
            });
        }
    }catch(error){
        console.log(error);
    }
}

exports.adminRegistration = async function(req, callback){
    var db;
    try{
        var hexDatetime = Date.now().toString(16);
        var userData = "";
        for(key in req.body){
            var value = req.body[key];
            userData += (userData?",":"")+("\""+key+"\": \""+value+"\"");
        }
        userData = (userData?"\"user-data\":{"+userData+"}":"");
        if(userData){
            var jsonData = "{\"_id\":\""+hexDatetime+"\","+userData+"}";
            //console.log(jsonData);
            db = new utils.DBUtils(utils.uri);
            var json = JSON.parse(jsonData);
            var email = json["user-data"].email;
            var reqJson = JSON.parse("{\"email\":\""+email+"\"}");
            var count = await db.countRecords(utils.DBUtils.adminTable, reqJson, {}, async countBack => {
                console.log("count: "+countBack);
                if( countBack == 0){
                    db = new utils.DBUtils(utils.uri);
                    var isInserted = await db.storeData(utils.DBUtils.adminTable, jsonData);
                    callback(isInserted);
                    return;
                }
            });
            
        }
    }catch(error){
        console.log(error);
    }
}