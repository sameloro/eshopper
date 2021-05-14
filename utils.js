//const { MongoClient } = require("mongodb");
const {MongoClient} = require('mongodb');
const utils = require("./utils");
require('dotenv').config();


/**
 * constants
 */
//exports.uri = process.env.DB_PROTOCOL+"://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@"+process.env.DB_DOMAIN+"/"+process.env.DB_NAME+"?retryWrites=true&w=majority";
//exports.uri = "mongodb://localhost:27017/eshopper";
exports.uri = "mongodb+srv://admin:admin123@eshopper.bzn0n.mongodb.net/eshopper?retryWrites=true&w=majority";


exports.isObject = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Object;
}

exports.isArray = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Array;
}

exports.isBoolean = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Boolean;
}

exports.isFunction = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Function;
}

exports.isNumber = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Number;
}

exports.isString = function (obj)
{
    return obj !== undefined && obj !== null && obj.constructor == String;
}

exports.isInstanced = function (obj)
{
    if(obj === undefined || obj === null) { return false; }

    if(isArray(obj)) { return false; }
    if(isBoolean(obj)) { return false; }
    if(isFunction(obj)) { return false; }
    if(isNumber(obj)) { return false; }
    if(isObject(obj)) { return false; }
    if(isString(obj)) { return false; }

    return true;
}

exports.timeoutPromise = function(time) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(Date.now());
      }, time)
    })
  }

  exports.isEmpty = function(obj){
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }

exports.listDatabases = async function(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

exports.DBUtils = class {
    static productTable = "products";
    static customerTable = "customers";
    static adminTable = "admin";
    constructor(uri) {
        try{
            this.db=null;
            console.log(uri);
            this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            //this.client.connect();
            
            
        }catch (error) {
            console.error("error:", error);
        }
    }

    async storeData(tablename, data, callback){
        this.client.connect(async err =>  {
            try{
                this.db = this.client.db();
                data = utils.isObject(data)?data:JSON.parse(data);
                console.log(JSON.stringify(data));
                var result = await this.db.collection(tablename).insertOne(data);
                callback(result);
                return;
            } catch (error) {
                console.error("error:", error);
                return false;
            }finally{
                this.close();
            }
        });
    }

    async countRecords(tablename, query, projection, callback){
        var count = this.client.connect( async err =>  {
            try{
                this.db = this.client.db();
                query = utils.isObject(query)?query:JSON.parse(query);
                projection = utils.isObject(projection)?projection:JSON.parse(projection);
                console.log("countRecords query: "+JSON.stringify(query));
                console.log("countRecords projection: "+JSON.stringify(projection));
                var count = await this.db.collection(tablename).find(query).project(projection).count();
                console.log("countRecords() count:"+count);
                callback(count);
                return;
            } catch (error) {
                console.error("error:", error);
            }finally{
                this.close();
            }
        });
    }

    async getAllData(tablename, query, optons, projection, callback){
        this.client.connect(async err =>  {
            try{
                this.db = this.client.db();
                query = utils.isObject(query)?query:JSON.parse(query);
                optons = utils.isObject(optons)?optons:JSON.parse(optons);
                projection = utils.isObject(projection)?projection:JSON.parse(projection);
                var jsondata = '';
                console.log(query);
                console.log(optons);
                console.log(projection);
                jsondata = await this.db.collection(tablename).find(query, optons).project(projection).toArray();
                callback(jsondata);
                return;
            } catch (error) {
                console.error("error:", error);
            }finally{
                this.close();
            }
        });
    }

    async getAllDataAggregate(tablename, query, result){
        this.client.connect(async err =>  {
            try{
                this.db = this.client.db();
                query = utils.isObject(query)?query:JSON.parse(query);
                var jsondata = '';
                jsondata = await this.db.collection(tablename).aggregate(query).toArray();
                result(jsondata);
                return;
            } catch (error) {
                console.error("error:", error);
            }finally{
                this.close();
            }
        });
    }

    async close(){
        try{
            if(this.client){
                this.client.close()
            }
        }catch(error){
            console.log(error);
        }
    }

}