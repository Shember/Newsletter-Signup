const express = require("express");
const https = require("https");

const port = 3000;
const app = express();
//mailchimp
const apiKey = "290844bc4d6fd3cd91a1e9dd00b8cbfd-us1";
const serverPrefix = "us1";
const listId = "618a517b6b";

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const mail = req.body.email;
    
    const data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://" + serverPrefix + ".api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method: "POST",
        auth: "sara:"+ apiKey
    };

    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || port, () =>{
    console.log("The server is running on port " + (process.env.PORT || port));
});