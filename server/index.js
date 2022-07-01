const express = require('express');
const app = express();
const port = 5000;
const axios = require('axios');
const { Pool, Client } = require("pg");
const HtmlTableToJson = require('html-table-to-json');
var fs = require('fs');
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

var client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'company',
  password: 'root',
  port: 5432,
});

client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'company',
    password: 'root',
    port: 5432,
});

const execute = async (query) => {
    try {
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
    }
};

const insertData = async (cin, companyName) => {
    try {
        console.log(companyName);
        await client.query(
            `INSERT INTO "companies" ("cin", "companyName")  
             VALUES ($1, $2)`, [cin, companyName]); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
    }
};

// API to get list of all companies by scraping through each webpage elements
app.get('/', function (req, res) {
    var result = {};
    var search = req.params.file;;
    var doSome = new Promise(function(resolve, reject){
        resolve('I am doing something');
        var str = "";
        console.log(search);
        let url = `https://www.zaubacorp.com/company-list`;
        axios({
            method:'get',
            url
        })
        .then( (response) => {
            console.log(JSON.stringify(response.data));
            str = response.data;
            
            var i1 = str.search("<table");
            var i2 = str.search("</table>");
            str = str.substring(i1, i2) + "</table>";
            console.log(str);
            var jsonTables = HtmlTableToJson.parse(`${str}`);
            result = {resultTable : jsonTables.results};

            fs.readFile('./data.json', function (err, data) {
                if(err) {
                    console.log(err);
                    return;
                }
                var json = JSON.parse(data);
                var doSmall1 = new Promise(function(resolve, reject){
                    resolve("test");
                    json.concat(result.resultTable[0]);
                });
                doSmall1.then(function(value){
                    console.log(json);
                    fs.writeFile("./test.json", json);
                })
                .catch(err => console.log(err));

            })
            res.json(result.resultTable[0]);
        })
        .catch( (error) => {
            console.log(error);
        });
    });
})

// api to get details of a specific company by companyName and CIN
app.get('/company/:companyName/:cin', (req, res) => {
    var cin = req.params.cin;
    const companyName = req.params.companyName;
    var str = "";
    var url = "https://www.zaubacorp.com/company/" + companyName + "/" + cin;
    var output = {};
    
    axios({
        method:'get',
        url
    })
    .then( (response) => {
        str = response.data;
        // console.log(str);
        console.log(`<td><p><a href=${url}>${cin}</a></p></td>`);
        var index = str.search(`<td><p><a href="${url}">${cin}</a></p></td>`);
        if(index === -1) {
            output = {error : "No comapnu Found!!!"};
        }else{
            output = {success : true, response : "Successfully fetched!!!"};
        }
        
        res.json(output);
    })
    .catch( (error) => {
        console.log(error);
    });
});

// API to add a company to the database
app.post('/addCompany', (req, res) => {
    const cin = req.body.cin;
    const companyName = req.body.companyName;

    insertData(cin, companyName).then(result => {
        if (result) {
            console.log('User inserted');
            res.json({success : true, message : "Successfully Added"}); 
        }
    });
});

// API to get the companyList from database
app.get('/companyList', (req, res) => {
    pool.query('SELECT * FROM companies', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
    })
});


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 