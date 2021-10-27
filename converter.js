var fs = require("fs");
var file = fs.readFileSync("teamdata.csv") + "";
var data = file.split("\n");
var json = {};
data = data.map(x=>x.split(','));
console.log(data);
if (data[0].includes('Options')){
  json.options = {};
  if (data[0].includes('Innings')){
    json.options.innings = data[1][data[0].indexOf('Innings')] * 1;
  }
  if (data[0].includes('Home')){
    json.options.home = data[1][data[0].indexOf('Home')].toLowerCase().replace(/ /g,'');
  }
  if (data[0].includes('Away')){
    json.options.away = data[1][data[0].indexOf('Away')].toLowerCase().replace(/ /g,'');
  }
}
for (var i = 1; i < data.length; i++){
  let local = data[i][0].toLowerCase().replace(/ /g,'');
  json[local] = {"names": {"city": null, "name": null}, "ratings": {"batting": null, "power": null, "pitching": null, "defense": null, "speed": null}};
  json[local].names.city = data[i][1];
  json[local].names.name = data[i][2];
  json[local].ratings.batting = data[i][3] * 1;
  json[local].ratings.power = data[i][4] * 1;
  json[local].ratings.pitching = data[i][5] * 1;
  json[local].ratings.defense = data[i][6] * 1;
  json[local].ratings.speed = data[i][7] * 1;
}

fs.writeFileSync("teamdata.json", JSON.stringify(json,null,2));
