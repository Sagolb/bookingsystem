
const express = require("express");
const bodyParser = require("body-parser");
const encoded = bodyParser.urlencoded();

const connection = require("./connection")


const app = express();
app.use("/assets",express.static("assets"));

app.set('view-engie', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));



// connect to database
connection.connect(function(error){
    if(error) throw error
    else console.log("Connected to database sucessfully!")

});


app.get("/",function(req,res){
    res.render('index.ejs');
})

app.post("/", encoded, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?";

    connection.query(sql, [username, password], function(error, results, fields) {
        if (username == "admin@gmail.com" && password == "admin") {
            res.redirect("/admin");
        } else if (results.length > 0) {
            res.redirect("/welcome");
        }
        else {
            res.render("index.ejs", { message: "Invalid username or password" });
        }
    });
  });


app.get("/register",function(req,res){
    res.render('register.ejs');
})
app.post("/register",encoded, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("insert into loginuser(user_name,user_pass) values(?,?) ",[username,password], function(error,results,fields){
        let loginuser = ("SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?", [username, password])
        if(username == loginuser || results.length < 0){
            res.render("register.ejs" , {message: "User already exists"})
        } else {
            res.render("index.ejs" , {message: "User Registered"})
            
        }
        res.end();
    })
})


// when login is sucess
app.get("/admin",encoded,function(req,res){
    connection.connect(function(error){
        if(error) console.log(error)

        connection.query("SELECT * from timetable", function(error,results,fields){
            if(error) console.log(error)
            res.render("admin.ejs" , {show: results})
        })
    })
})

    // connection.connect(function(error){
    //     if(error) console.log(error)

    //     var sql = "SELECT * FROM loginuser"
    
        // connection.query(sql, function (err, result) {
        //     if (err) console.log(err);
        //     res.render(__dirname+"/views/welcome.ejs", {show: result})
        //     //res.render("welcome.ejs" , {timetable: result})
 
//     connection.query("SELECT * from timetable where id ", function(error,results,fields){
//         if (results.length > 0) {
//             res.redirect("/welcome");
            
//         } else {
//             res.redirect("/");
            
            
//         }
//         res.end();

// app.post("/admin",encoded, function(req,res){
//     connection.connect(function(error){
//         if(error) console.log(error)
//         var sql = "SELECT * FROM loginuser"
//         connection.query(sql, function (err, result) {
//             if (err) console.log(err);
//             res.render("admin.ejs", {show: result})
//         })
//     })
// })



app.get("/delete",encoded, function(req,res){
    connection.connect(function(error){
        if(error) console.log(error)
        var sql = "DELETE FROM timetable WHERE id = ?"
        var id = req.query.id
        connection.query(sql,[id],function(error,results,fields){
            if(error) console.log(error)
            res.redirect("/admin")
        })
    })
})


    // connection.query("DELETE FROM loginuser WHERE user_id = ?",[req.query.id],function(error,results,fields){
    //     if(error) console.log(error)
    //     res.redirect("/admin")
    // })


app.get("/welcome",encoded, function(req,res){
    connection.query("SELECT * from timetable", function(error,results,fields){
    if(error) console.log(error)
    res.render(__dirname+"/views/welcome.ejs" , {timetable: results})
})
})

app.post("/welcome",encoded, function(req,res){
    var available_time = req.body.available_time;
    var court_type = req.body.court_type;
    var court_location = req.body.court_location;

    connection.query("insert into timetable(court_type,court_location,available_time) values(?,?,?) ",[court_type,court_location,available_time], function(error,results,fields){
        if(error) console.log(error)
        res.redirect("/welcome")
    })
})

app.get("/update",function(req,res){
    connection.connect(function(error){
        if(error) console.log(error)
        var sql = "SELECT * FROM timetable WHERE id = ?"
        var id = req.query.id

        connection.query(sql,[id],function(error,results,fields){
            if(error) console.log(error)
            res.render("update.ejs" , {show: results})
        })
    })
})

app.post("/update",encoded, function(req,res){
    connection.connect(function(error){
        if(error) console.log(error)
        
        var sql = "UPDATE timetable SET Start_time = ?, End_time = ?, court_type = ?, court_location = ? WHERE id = ?"
        var id = req.body.id;
        var Start_time = req.body.Start_time;
        var End_time = req.body.End_time;
        var court_type = req.body.court_type;
        var court_location = req.body.court_location;

        connection.query(sql,[Start_time,End_time,court_type,court_location,id],function(error,results,fields){ 
            if(error) console.log(error)
            res.redirect("/admin")
        })
    })
})




app.get("/main" , function(req,res){
    connection.query("SELECT * from timetable", function(error,results,fields){
        if(error) console.log(error)
        res.render("main.ejs" , {timetable: results})  
    })
})

app.post("/main",encoded, function(req,res){
    var available_time = req.body.available_time;
    var court_type = req.body.court_type;
    var court_location = req.body.court_location;

    connection.query("insert into timetable(court_type,court_location,available_time) values(?,?,?) ",[court_type,court_location,available_time], function(error,results,fields){
        if(error) console.log(error)
        res.redirect("/main")
    })
})


app.get("/about",function(req,res){
    res.render("about.ejs");
})

app.get("/contact",function(req,res){
    res.render("contact.ejs");
})



//set app port
app.listen(3000, () => {
    console.log(`Serving on port 3300`)
})