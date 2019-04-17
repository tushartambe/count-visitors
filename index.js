const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql");

let con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DEFAULT_DB
});

const updateUserCount = function(req, res) {
  let totalVisits = 0;
  let userVisitCount = 0;
  let userName = req.body.userName;

  con.connect(err => {
    if (err) {
      console.log("could  not connect");
    }

    con.query(
      `select (select count from users where name=?) as userVisitCount,  (select sum(count) as count from users) as totalVisits`,
      userName,
      (error, results, fields) => {
        totalVisits = results[0].totalVisits;
        userVisitCount = results[0].userVisitCount;

        if (!totalVisits) {
          totalVisits = 0;
        }

        if (!userVisitCount) {
          userVisitCount = 0;
        }
      }
    );

    con.query(
      `select count from users where name =?`,
      userName,
      (error, results, fields) => {
        console.log("here comings", results);
        if (results != undefined && results.length > 0) {
          con.query(
            `update users set count=? where name=?`,
            [userVisitCount + 1, userName],
            (error, results, fields) => {}
          );
          res.json({
            totalCount: totalVisits + 1,
            userCount: userVisitCount + 1
          });
          return;
        }

        con.query(
          `insert into users values(?,1)`,
          userName,
          (error, results, fields) => {}
        );
        res.json({ totalCount: totalVisits + 1, userCount: 1 });
      }
    );
  });
};

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

app.post("/update-user-count", updateUserCount);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
