const express = require("express");
const session = require("express-session");
const path = require("path");
require('dotenv').config();

var bodyParser = require('body-parser');
var shopper = require('./js/shoppers');
var auth = require('./js/authentication');
var utils = require('./js/utils');


//var cookieParser = require('cookie-parser');


/*
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
*/
const app = express();
//const router = express.Router();
//const port =20000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"images")));
app.use(express.static(path.join(__dirname,"css")));
app.use(express.static(path.join(__dirname,"js")));
app.use(express.static(path.join(__dirname,"fonts")));
app.use(express.static(__dirname + '/public'));

/*
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
*/

/*
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
*/

/*
app.use(
    session({
      secret: ['veryimportantsecret','notsoimportantsecret','highlyprobablysecret'], 
       name: "secretname", 
       cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 600000 // Time is in miliseconds
    },
      store: new RedisStore({ client: redisClient ,ttl: 86400}),   
      resave: false
    })
  )
*/

/*
app.use(session({secret: "eshopper",saveUninitialized: true,resave: true,
    name: "secretname",
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 600000 // Time is in miliseconds
    }
}));
*/

app.use(session({secret: "eshopper",saveUninitialized: true,resave: true}));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({extended: true}));



/*
app.use(function(req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        var query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});
*/


app.get("/", async (req, res) =>{
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://shopper:shopper123@eshopper.bzn0n.mongodb.net/eshopper?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("eshopper").collection("products");
        console.log(" perform actions on the collection object");
        client.close();
    });

    var grids = await shopper.getProducts(600);
    var categories = await shopper.getCategories();
    var brands = await shopper.getBrands();
    var id = (req.session && req.session.customer_id)?req.session.customer_id:null;
    //console.log("S.ID="+req.sessionID+" : index customer id: "+id);
    res.render("index", {
        grids: grids,
        categories: categories,
        brands: brands,
        customer_id: id
    });
});

app.get("/index", async (req, res) =>{
    var grids = await shopper.getProducts(600);
    var categories = await shopper.getCategories();
    var brands = await shopper.getBrands();
    var id = (req.session && req.session.customer_id)?req.session.customer_id:null;
    //console.log("S.ID="+req.sessionID+" : index customer id: "+id);
    res.render("index", {
        grids: grids,
        categories: categories,
        brands: brands,
        customer_id: id
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/logout", (req, res) => {
    //console.log("session id:" + JSON.stringify(req.session));
    req.session.destroy();
    res.redirect("/");
});

app.post("/signup", async (req, res) => {
    var signup = await auth.customerRegistration(req);
    res.render("login");
});

app.get("/login_admin", (req, res) => {
    res.render("login_admin");
});

app.post("/signup_admin", async (req) => {
    var signup = await auth.adminRegistration(req);
    res.render("login_admin");
});

app.post("/signin", async (req, res) => {
    var doc = await auth.customerLogin(req);
    if(!utils.isEmpty(doc)){
        req.session.customer_id = doc._id;
        res.redirect("/");
    }else{
        res.redirect("login");
    }

});

app.post("/signin_admin", async (req, res) => {
    var doc = await auth.customerLogin(req);
    if(!utils.isEmpty(doc)){
        req.session.admin_id = doc._id;
        res.redirect("/admin");
    }else{
        res.redirect("/login_admin");
    }
});

app.get("/myaccount", async (req, res) => {
    var doc = await auth.myaccount(req, res);
    //console.log(doc);
    if(doc){
        res.render("myaccount", {
            name: doc["user-data"].name,
            email: doc["user-data"].email,
            password: doc["user-data"].password,
            phone: doc["user-data"].phone,
            customer_id: req.session.customer_id
        });
    }
});

app.get("/admin", async (req, res) => {
    var doc = await auth.admin(req)
    if(doc){
        res.render("admin", {
            name: doc["user-data"].name,
            email: doc["user-data"].email,
            password: doc["user-data"].password,
            phone: doc["user-data"].phone,
            admin_id: req.session.admin_id
        });
    }
});

app.get("/4-0-4", (req, res) => {
    res.render("4-0-4");
});

app.get("/blogs", (req, res) => {
    res.render("blogs");
});

app.get("/blog-single", (req, res) => {
    res.render("blog-single");
});

app.get("/basket", (req, res) => {
    res.render("basket");
});

app.get("/checkout", (req, res) => {
    res.render("checkout");
});

app.get("/contact-us", (req, res) => {
    res.render("contact-us");
});

app.get("/product_details", (req, res) => {
    res.render("product_details");
});

app.get("/shelf", (req, res) => {
    res.render("shelf");
});

app.get("/header", (req, res) => {
    res.render("header");
});

app.get("/footer", (req, res) => {
    res.render("footer");
});

app.get("/add-product", (req, res) => {
    res.render("addproduct");
});

app.post("/saveproduct", (req, res) => {
    
    shopper.addProduct(req, res);
    
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listining at http://localhost:${process.env.PORT}`);
})