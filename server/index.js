const express = require('express');
const app = express();
const port = 5000;
const axios = require('axios');
const { Client } = require('pg');
const HtmlTableToJson = require('html-table-to-json');

const client = new Client({
  user: 'sgpostgres',
  host: 'SG-flower-muskox-4638-3653-pgsql-master.servers.mongodirector.com',
  database: 'Company',
  password: 'GRy7YxhI$inHFrAv',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/:search', function (req, res) {
    var result = {};
    var search = req.params.file;;
    var doSome = new Promise(function(resolve, reject){
        resolve('I am doing something');
        var str = "";
        console.log(search);
        let url = `https://www.zaubacorp.com/companysearchresults/` + search;
        axios({
            method:'get',
            url
        })
        .then( (response) => {
            console.log(JSON.stringify(response.data));
            str = response.data;
            // var doSmall = new Promise(function(resolve, reject){
               
            //     resolve('I am doing something');
            // });
            // doSmall.then(function(value){
                
            // })
            // .catch(err => console.log(err));
            
            var i1 = str.search("<table");
            var i2 = str.search("</table>");
            str = str.substring(i1, i2) + "</table>";
            console.log(str);
            var jsonTables = HtmlTableToJson.parse(`${str}`);
            result = {resultTable : jsonTables.results};
            console.log(result.resultTable);
            res.json({result : result.resultTable});
        })
        .catch( (error) => {
            console.log(error);
        });
    });
    
    // doSome.then(function(value){
    //     console.log("test");
    //     console.log(result.resultTable);
    //     // res.send(JSON.stringify(result.resultTable));
    // });
})

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


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 


// `
//             <table id="results" class="table table-striped col-md-12 col-sm-12 col-xs-12">
//             <thead>
//                 <tr>
//                     <th>
//                         <h4>CIN</h4>
//                     </th>
//                     <th>
//                         <h4>Name</h4>
//                     </th>

//                     <th>
//                         <h4>Address</h4>
//                     </th>
//                 </tr>
//             </thead>

//             <tr>
//                 <td>
//                     <h5>U72900DL2015PTC278287</h5>
//                 </td>
//                 <td><a
//                         href="https://www.zaubacorp.com/company/XORIANT-INFOTECH-PRIVATE-LIMITED/U72900DL2015PTC278287">
//                         <h5>XORIANT INFOTECH PRIVATE LIMITED</h5>
//                     </a></td>

//                 <td>708, 7TH FLOOR, GOPAL HEIGHTS, PLOT NO D-9 NETAJI SUBHASH PLACE,
//                     PITAMPURA DELHI North West DL 110034 IN </td>

//             </tr>


//             <tr>
//                 <td>
//                     <h5>U64202KA1999PTC025917</h5>
//                 </td>
//                 <td><a
//                         href="https://www.zaubacorp.com/company/XORIANT-SOLUTIONS-PRIVATE-LIMITED/U64202KA1999PTC025917">
//                         <h5>XORIANT SOLUTIONS PRIVATE LIMITED</h5>
//                     </a></td>

//                 <td>GOLDEN HIEGHTS, 'B' WING,AM,1ST FLOOR ANANTH PATIL MARG SHVAJI PARK,
//                     MUMBAI-400 028. BANGALORE KA 000000 IN </td>

//             </tr>




//             <tr>
//                 <td>
//                     <h5>U80222RJ2021NPL074295</h5>
//                 </td>
//                 <td><a
//                         href="https://www.zaubacorp.com/company/ORIAN-FOUNDATION/U80222RJ2021NPL074295">
//                         <h5>ORIAN FOUNDATION</h5>
//                     </a></td>

//                 <td>FLAT NO. 102, P.NO. D-12, GOKUL WATIKA, NEAR JAWAHAR CIRCLE JAIPUR
//                     Jaipur RJ 302017 IN </td>
//             </tr>
//             </table>

//         `