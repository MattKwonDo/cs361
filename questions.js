module.exports = function(){
    var express = require('express');
    var router = express.Router();

  // Display categories for ask question page
  
    function getCategories(res, mysql, context, complete){
        mysql.pool.query("SELECT cname FROM QuestionCategories;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.category  = results;
            complete();
        });
}

  // When page loads, display all doctors
  
  router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getCategories(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('questionMain', context);
            }

        }
    });
    
    // When user submits a new doctor, add it to the database and refresh page to display new row
    /*
    router.post('/', function(req, res){       
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Hosp_Doctor (Fname, Lname, License) VALUES (?,?,?);";
        var inserts = [req.body.Fname, req.body.Lname, req.body.License];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/doctor');
            }
        });
});
  */  
    
    return router;
}();
