var fs = require("fs");
var file = fs.readFileSync("teamdata.csv") + "";
var data = file.split("\n");
data.shift();
data = data.map(x=>x.split(','));
var json = {"team1":{"names":{}, "ratings":{}},"team2":{"names":{}, "ratings":{}}};
for (var i in data){
  var name = i == 0 ? "team1" : "team2";
  json[name].names.city = data[i][1];
  json[name].names.name = data[i][2];
  json[name].ratings.batting = data[i][3] * 1;
  json[name].ratings.power = data[i][4] * 1;
  json[name].ratings.pitching = data[i][5] * 1;
  json[name].ratings.defense = data[i][6] * 1;
  json[name].ratings.speed = data[i][7] * 1;
}

fs.writeFileSync("teamdata.json", JSON.stringify(json,null,2));
