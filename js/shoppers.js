
const path = require("path")
var fs = require('fs');
var formidable = require('formidable');
const { body,validationResult } = require('express-validator');
const utils = require("./utils")


exports.addProduct = function(req, res, callback){
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.
            console.log("Error")
        }else {
            // Data from form is valid.
            console.log("Valid")
        }
    }
    //upload files
    var formData = new formidable.IncomingForm();
    formData.parse(req, async function (error, fields, files) {
        var db = null;
        try{
            var htmlData = '';
            var fileArray = '';
            var fieldJson = '';
            var hexDatetime = Date.now().toString(16);
            for(var key in files){
                var file = files[key];
                if(file && file.name){
                    var extension = file.name.substr(file.name.lastIndexOf("."));
                    var nameWithoutExt = file.name.substr(0, file.name.lastIndexOf("."));
                    var newPath = "images/products/" + nameWithoutExt+"_"+hexDatetime + extension;
                    var ismainImage = key == 'mainImage';
                    fileArray += (fileArray?",":"")+"{\"image\":\""+newPath+"\",\"main-image\":"+ismainImage+"}";
                    //htmlData += `<p>value for ${key} is ${newPath}</p>`;
                    fs.rename(file.path, newPath, function (errorRename) {
                        //console.log("File saved = " + newPath);
                    });
                }
            }
            fileArray = (fileArray?"\"images\":["+fileArray+"]":"");
            
            //Read other properties
            for (var key in fields) {
                let value = fields[key];
                fieldJson += (fieldJson?",":"")+"\""+key+"\":\""+value+"\"";
                //htmlData += `<p>value for ${key} is ${value}</p>`;
            }
            var _data = "\"fields\":{"+fieldJson+"}"+(fileArray?",":"")+fileArray;
            if(_data){
                var jsonData = "{\"_id\":\""+hexDatetime+"\","+_data+"}";
                //console.log(jsonData);
                db = new utils.DBUtils(utils.uri);
                await db.storeData(utils.DBUtils.productTable, jsonData, async result => {
                    //var count = await db.countRecords(utils.DBUtils.productTable,'{}');
                    //htmlData += `<p>Total documents in products collection : ${count}.</p>`
                    callback(result);
                    return;
                });
            }
            //res.send(htmlData);
        }catch(error){
            console.log("ERROR: "+error)
        }
    });
}

exports.getCategories = async function(){
    return new Promise((resolve, reject) => {
        var db = null;
        try{
            db = new utils.DBUtils(utils.uri);
            var query = `[
                { 
                    "$match": {
                        "fields.category": { 
                            "$exists": true, 
                            "$ne": null,
                            "$ne": "" 
                        }
                    }    
                },
                { 
                    "$group": {
                        "_id": "$fields.category", 
                        "subcategories": { 
                            "$push": {
                                "$cond":[
                                    {"$ne": ["$fields.subcategory", ""]},
                                    "$fields.subcategory",
                                    null
                                ]
                            }
                        },
                        "count": { 
                            "$sum": 1
                        }
                    }   
                },
                {
                    "$sort": {
                        "subcategories" : -1,
                        "_id": 1
                    }
                }  
            ]`;

            db.getAllDataAggregate(utils.DBUtils.productTable, query, async result => {
                var grid ='';
                for (i in result){
                    var doc = result[i];
                    grid += createCategoryGrid(doc);
                    //console.log("catagories: "+ doc);
                }
                resolve(grid);
                return;
            });
        
        }catch(error){
            console.log("getCategory: "+error)
        }
    });
}

exports.getBrands = async function(){
    return new Promise((resolve, reject) => {
        var db = null;
        try{
            db = new utils.DBUtils(utils.uri);
            var query = `[
                { 
                    "$match": {
                        "fields.brand": { 
                            "$exists": true, 
                            "$ne": null,
                            "$ne": "" 
                        }
                    }    
                },
                { 
                    "$group": {
                        "_id": "$fields.brand",
                        "count": { 
                            "$sum": 1 
                        }
                    }   
                },
                {
                    "$sort": {
                        "count" : -1
                    }
                }        
            ]`;

            db.getAllDataAggregate(utils.DBUtils.productTable, query, result => {
                var grid ='';
                for (i in result){
                    var doc = result[i];
                    grid += `<li><a href="#"> <span class="pull-right">(${doc.count})</span>${doc._id}</a></li>`;
                    //console.log("Brands: "+ JSON.stringify(doc));
                }
                resolve(grid);
                return;
            });
            
        }catch(error){
            console.log("getCategory: "+error)
        }
    });
}

module.exports.getProducts = async function(limit, pagination){
    return new Promise((resolve, reject) => {
        var db = null;
        try{
            pagination = pagination?pagination<2?0:pagination:0;
            var skip = limit * pagination;
            db = new utils.DBUtils(utils.uri);
            db.countRecords(utils.DBUtils.productTable, {}, {"_id":1}, async count => {
                //console.log("("+count+" >= "+skip+") = "+(count >= skip));
                if(count >= skip){
                    db = new utils.DBUtils(utils.uri);
                    await db.getAllData(utils.DBUtils.productTable, {}, {limit: limit, skip: skip}, {"fields.name":1,"fields.price":1,"images":1}, async result => {
                        //console.log(result);
                        var grids = '';
                        for(var i in result){
                            var doc = result[i];
                            grids += createProductGrid(doc);
                        }
                        resolve(grids);
                        return;
                    });
                }
            });  
        }catch(error){
            console.log("Get Product Error:"+error);
        }
    });
}

var createProductGrid = function(doc){
    var image = 'products/default.jpg';
    for(var j in doc.images){
        var img = doc.images[j];
        image = img.image;
        filename = path.join(__dirname, "../"+image);
        if (fs.existsSync(filename)) {
            image = image.substr(image.indexOf("/")+1);
        }else{
            image = 'products/default.jpg';
            continue;
        }
        if(img["main-image"]){
            break;
        }
        //console.log("is main image: "+img["main-image"] +" URL: "+img.image);
    }
    var price = doc.fields.price?"£"+doc.fields.price:"Out of Stock";
    var displayName = doc.fields.name?doc.fields.name:"It's yours!!";
    
    var grid=`<div class="col-sm-4">
                    <div class="product-image-wrapper">
                        <div class="single-products">
                                <div class="productinfo text-center">
                                    <img class="grid-image" src="${image}" alt="" />
                                    <h2>${price}</h2>
                                    <p>${displayName}</p>
                                    <a href="#" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</a>
                                </div>
                                <div class="product-overlay">
                                    <div class="overlay-content">
                                        <h2>${price}</h2>
                                        <p>${displayName}</p>
                                        <a href="#" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</a>
                                    </div>
                                </div>
                        </div>
                        <div class="choose">
                            <ul class="nav nav-pills nav-justified">
                                <li><a disabled="disabled" data-toggle="tooltip" title="Comming Soon!!"><i class="fa fa-plus-square"></i>Add to wishlist</a></li>
                                <li><a disabled="disabled" data-toggle="tooltip" title="Comming Soon!!"><i class="fa fa-plus-square"></i>Add to compare</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                `;

                return grid;
}

var createCategoryGrid = function(doc){
   
    var category = doc._id;

    var subcategories = '';
    for(i in doc.subcategories){
        var subcategory = doc.subcategories[i];
        subcategories += `${subcategory?`<li><a href="#">${subcategory}</a></li>
        `:``}`;
    }
    
    var grid=`<div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordian" href="#${category}">
                        ${subcategories?`<span class="badge pull-right"><i class="fa fa-plus"></i></span>`:``}
                            ${category}
                        </a>
                    </h4>
                </div>
                ${subcategories?
                `<div id="${category}" class="panel-collapse collapse">
                    <div class="panel-body">
                        <ul>
                            ${subcategories}
                        </ul>
                    </div>
                </div>`: ''}
            </div>
                `;

                return grid;
}


