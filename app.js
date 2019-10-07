// Dependencies
var express = require("express");
var mongoose=require("mongoose");
var methodoverride=require("method-override");
// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Create express app instance.
var app = express();

//title, image, body, created

mongoose.connect("mongodb://localhost/restful_blog_app");

const connection = mongoose.connection;
connection.on('connected', () => {
    console.log("Mongoose connected successfully");
});

connection.on('error', (err) => {
    console.log("Mongoose default connection error: " + err);
});


//App config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));

//schema

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});

var Blog=mongoose.model("Blog", blogSchema);

/* Blog.create({title:"Colon Creek", 
            image:"https://oregondiscovery.com/wp-content/uploads/2017/08/P7220020Auth-1.jpg",
            body: "This is the best creek I have been to"
            },function(err,blog){
    if (err) {
        console.log(err);
    } else {
        console.log("Newly Created Campground");
        console.log(blog);
    }
}); */

//Restful Routes

//root

app.get("/", function(req,res){
    res.redirect("/blogs");
})

//index
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
    //res.render("index");
})

//new route
app.get("/blogs/new", function(req,res){
    res.render("new");
})

//create post

app.post("/blogs",function(req,res){
    //get data from form and add to campgrounds array
/*     var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var newBlog= {title:title,image:image,bod:body} */
    
    Blog.create(req.body.blog,function(err, newBlog){
     if (err){
         res.render("new");
     }else {
        res.redirect("/blogs");
     }
    });
    //campgrounds.push(newCampground);
    });

    //new
    app.get("/blogs/:id", function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog){
            if (err){
                console.log(err);
            } else {
                res.render("show",{Blog:foundBlog}); 
            }
            
        });
          
    });
    
//edit route

app.get ("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:foundBlog});
        }
    })
})


//update Route

app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})

//Delete Route

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndDelete(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/");
        }
    })
})

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
