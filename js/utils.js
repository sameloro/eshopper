const { MongoClient } = require("mongodb");
const utils = require("./utils");
require('dotenv').config();


/**
 * constants
 */
exports.uri = process.env.DB_PROTOCOL+"://"+process.env.DB_DOMAIN+":"+process.env.DB_PORT+"/"+process.env.DB_NAME;
//const uri = "mongodb+srv://admin:Evaachu123@eshopper.lblg9.mongodb.net/eshopper?retryWrites=true&w=majority";

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

exports.DBUtils = class {
    static productTable = "products";
    static customerTable = "customers";
    static adminTable = "admin";
    constructor(uri) {
        try{
            this.client = new MongoClient(uri, { useUnifiedTopology: true });
            this.client.connect();
            this.db = this.client.db();
        }catch (error) {
            console.error("error:", error);
        }
    }

    async storeData(tablename, data){
        try{
            data = utils.isObject(data)?data:JSON.parse(data);
            var result = await this.db.collection(tablename).insertOne(data);
            return true;
        } catch (error) {
            console.error("error:", error);
            return false;
        }
    }

    async countRecords(tablename, query, projection){
        try{
            query = utils.isObject(query)?query:JSON.parse(query);
            projection = utils.isObject(projection)?projection:JSON.parse(projection);
            var count = await this.db.collection(tablename).find(query).project(projection).count();
            return count;
        } catch (error) {
            console.error("error:", error);
        }
    }

    async getAllData(tablename, query, optons, projection){
        try{
            query = utils.isObject(query)?query:JSON.parse(query);
            optons = utils.isObject(optons)?optons:JSON.parse(optons);
            projection = utils.isObject(projection)?projection:JSON.parse(projection);
            var jsondata = '';
            jsondata = await this.db.collection(tablename).find(query, optons).project(projection).toArray();
            return jsondata;
        } catch (error) {
            console.error("error:", error);
        }
    }

    async getAllDataAggregate(tablename, query){
        try{
            query = utils.isObject(query)?query:JSON.parse(query);
            var jsondata = '';
            jsondata = await this.db.collection(tablename).aggregate(query).toArray();
            return jsondata;
        } catch (error) {
            console.error("error:", error);
        }
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