//messy Original is a broken script, re-writting it here to fix it
var fs = require('fs');
var json = fs.readFileSync('teamdata.json') + '';
json = JSON.parse(json);
console.log(json);
var team1Batting = json.team1.ratings.batting;
var team2Batting = json.team2.ratings.batting;
var team1Pitching = json.team1.ratings.pitching;
var team2Pitching = json.team2.ratings.pitching;
var team1Defense = json.team1.ratings.defense;
var team2Defense = json.team2.ratings.defense;
var team1Power = json.team1.ratings.power;
var team2Power = json.team2.ratings.power;
var team1Speed = json.team1.ratings.speed;
var team2Speed = json.team2.ratings.speed;
var gamedone = false;
var inning = 1;
var t1score = 0;
var t2score = 0;
var outs = 0;
var bases = [0,0,0];
var pbp = [];
var top = true;
var team = "team1";
var pitch = "team2";
var batScore = null;
var pitchScore = null;
var defScore = null;

while (!gamedone){
  // avoiding any confusion here
  // note, the temp score things were made because I tried to fix JSON memory, but it looks like old script would skip changing innings, fixed here, don't wanna redo the json's found in messyOriginal. JSON fixed isn't needed
  // it was just this error, so I could've just fixed the original and it'll be fine
  // code is neater and easier to understand tho
  // took extra unnesseciary safety steps. Looks good!
  batScore = null;
  pitchScore = null;
  defScore = null;
  if (outs >= 3){
    inning += .5;
    outs = 0;
    bases = [0,0,0];
  }
  top = Math.floor(inning) == inning;
  if (inning > 9){
    if (top && (t1score > t2score) && (outs == 0)){
      gamedone = true;
      break;
    }
    if (!top && t2score > t1score){
      gamedone = true;
      break;
    }
  }
  team = top ? "team1" : "team2";
  pitch = top ? "team2" : "team1"; 
  var tempBat = top ? team1Batting : team2Batting;
  var tempPitch = top ? team2Pitching : team1Pitching;
  batScore = num(1,55) + tempBat;
  pitchScore = num(1,55) + Math.round(1.25*tempPitch);
  if (batScore > pitchScore){
    hit();
  }
  else if (batScore < pitchScore){
    outs ++;
    add("Batter Out");
  }
  else {
    if (top){
      outs ++;
      add("Batter Out");
    }
    else {
      hit();
    }
  }
}

var result = "";
for (var i in pbp){
  result += pbp[i];
}
fs.writeFileSync("output.txt", result);
console.log("Game Simulated. Go to output.txt to see results.");
function hit(){
  var tempDef = top ? team2Defense : team1Defense;
  defScore = num(1,55) + Math.floor(1.25*tempDef);
  if (defScore < batScore){
    base();
  }
  else if (defScore > batScore){
    outs ++;
    add("Batter hit, but got out");
  }
  else {
    if (top){
      outs ++;
      add("Batter hit, but got out");
    }
    else {
      base();
    }
  }
}

function base(){
  var tempPow = top ? team1Power : team2Power;
  var powScore = num(1,55) + tempPow;
  if (powScore >= 60){
    var scored = 1 + bases.filter(x=>x==1).length;
    bases = [0,0,0];
    if (team == "team1"){
      t1score += scored;
    }
    else {
      t2score += scored;
    }
    add("Home Run!")
  }
  else {
    var tempSpeed = top ? team1Speed : team2Speed;
    var speedScore = num(1,55) + tempSpeed;
    var baseScore = speedScore - defScore;
    var type = "";
    if (baseScore < 0){
      bases.unshift(1);
      type = "Single";
    }
    else if (47 >= baseScore && 0 <= baseScore){
      bases.unshift(0,1);
      type = "Double";
    }
    else if (47 < baseScore){
      bases.unshift(0,0,1);
      type = "Triple";
    }
    var extra = bases.slice(3);
    extra = extra.filter(x=>x==1).length;
    bases = bases.slice(0,3);
    if (team == "team1"){
      t1score += extra;
    }
    else {
      t2score += extra;
    }
    add(type);
  }
}

function add(event){
  var foo = 'bar';
  var s = "";
  if (Math.floor(inning)==inning) foo = "Top";
  else foo = "Bottom";
  var name1 = json.team1.names.city + " " + json.team1.names.name;
  var name2 = json.team2.names.city + " " + json.team2.names.name;
  if (outs != 1) s = "s";
  var b1 = bases[0] == 0 ? "Empty" : "Runner";
  var b2 = bases[1] == 0 ? "Empty" : "Runner";
  var b3 = bases[2] == 0 ? "Empty" : "Runner";
  pbp.push("===============================\n" + foo + " of the " + Math.floor(inning) + "\n" + outs + " Out" + s + "\n1st Base: " + b1 + "\n2nd Base: " + b2 + "\n3rd Base: " + b3 + "\n" + name1 + ": " + t1score + "\n" + name2 + ": " + t2score + "\nEvent:\n" + event + "\n");
}
function num(l,h){
  return Math.floor(Math.random() * (h - l + 1)) + l;
}