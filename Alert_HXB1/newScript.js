/*
This script is usable in https://www.haxball.com/headless
Steps:
	1) Copy this script
	2) Go to the link, then press F12
	3) Go to console if it's not already set, then paste
	4) Enter
	5) IF THIS TAB IS CLOSED THE ROOM WILL BE CLOSED TOO
*/

var room = HBInit({ 
  roomName: "gats room",
  maxPlayers: 20,
  noPlayer: true, // Remove host player (recommended!)
  token: "thr1.AAAAAF-thGjs2WGUP6w77A.PlozcuJEe4U"
  //token: "thr1.AAAAAF-sRr9cWMNQX8HcMA.Kb1a3Gv-jBs",
  //password: "xxx"
});

room.setDefaultStadium("Classic");
room.setScoreLimit(3);
room.setTimeLimit(3);

/*
	Functions
*/
// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() {
  // Get all players except the host (id = 0 is always the host)
  var players = room.getPlayerList().filter((player) => player.id != 0 );
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}


// Gives the last player who touched the ball, works only if the ball has the same
// size than in classics maps.
var radiusBall = 10;
var triggerDistance = radiusBall + 15 + 0.1;
function getLastTouchTheBall(lastPlayerTouched) {
    var ballPosition = room.getBallPosition();
    var players = room.getPlayerList();
    for(var i = 0; i < players.length; i++) {
        if(players[i].position != null) {
						var distanceToBall = pointDistance(players[i].position, ballPosition);
            if(distanceToBall < triggerDistance) {
                lastPlayerTouched = players[i];
            }
        }
    }
		return lastPlayerTouched;

}

// Calculate the distance between 2 points
function pointDistance(p1, p2) {
    var d1 = p1.x - p2.x;
    var d2 = p1.y - p2.y;
    return Math.sqrt(d1 * d1 + d2 * d2);
}


// return: the name of the team who took a goal
var team_name = team => team == 1 ? "blue" : "red";

// return: whether it's an OG
var isOwnGoal = (team, player) => team == player.team ? true : false;

// return: a better display of the second when a goal is scored
var floor = s => s < 10 ? "0" + s : s;

// return: whether there's an assist
var playerTouchedTwice = playerList => playerList[0].team == playerList[1].team ? " (" + playerList[1].name + ")" : "";


/*
Events
*/
var mutedPlayers = []; // Array where will be added muted players
var init = "init"; // Smth to initialize smth
init.id = 0 // Faster than getting host's id with the method
var whoTouchedLast; // var representing the last player who touched the ball
var whoTouchedBall = [init, init]; // Array where will be set the 2 last players who touched the ball


room.onPlayerLeave = function(player) {
  updateAdmins();
}

room.onPlayerJoin = function(player) {

	updateAdmins(); // Gives admin to the first player who join the room if there's no one
	room.sendChat("Hi " + player.name + " ! Write !help or !adminhelp if needed." )
}

room.onPlayerChat = function(player, message) {
	if (message == "p") { // Set pause when someone say "p"
		room.pauseGame(true);
	}
	else if (message == "!p"){ // Unpause when someone say "!p"
		room.pauseGame(false);
	}
	else if (message == "!help") {
		room.sendAnnouncement('Write "p" to pause the game, "!p" to unpause it, ' +
		'This room is under development.', player.id, 0xEBAC00, "bold", 1);
	}
	else if (message == "!stats") {
		ps = stats.get(player.id); // stands for playerstats
		room.sendAnnouncement(player.name + ": goals: " + ps[0] + " ,assists: " + ps[1] + " ,og: " + ps[4], player.id, 0xEBAC00, "bold",1);
		// + " wins: "  + ps[2] + " loses: " + ps[3]
	}
}

room.onPlayerBallKick = function(player){
	// Gets the last one who kicked the ball
	lastKicker = [player, room.getScores().time]
}

room.onGameTick = function() {
	// A situation can happen where a player touch the ball very slightly by directly kicking
	// and it can lead to an error

	whoTouchedLast = getLastTouchTheBall(whoTouchedLast);
	if (whoTouchedLast != undefined && whoTouchedLast.id != whoTouchedBall[0].id) {
		whoTouchedBall[1] = whoTouchedBall[0];
		whoTouchedBall[0] = whoTouchedLast; // last player who touched the ball
	}
}

room.onTeamGoal = function(team){ // Write on chat who scored and when.

	var time = room.getScores().time;
	var m = Math.trunc(time/60); var s = Math.trunc(time % 60);
	time = m + ":" + floor(s); // MM:SS format
	var ownGoal = isOwnGoal(team, whoTouchedBall[0]);
	var assist = playerTouchedTwice(whoTouchedBall);
	
	if(ownGoal == true){
		message = "⚽ ["+time+"] Bramka samobójcza: "+player.name+"!"// Prędkość: 77.98km/h. (red/blue napisy)"
	}
	else if(assist != ""){
		message = "⚽ ["+time+"] Gol: "+player.name+"! Asysta: "+assist+"."
	}
	else{
		message = "⚽ ["+time+"] Gol: "+player.name+"!"
	}
	
	var color = color = getTeamColor(team);
	sendGoalAnnouncment(message, 0xE56E56);
	
	resetWhoTouchedBall();
}

function sendGoalAnnouncment(message, color){
	room.sendAnnouncement(message, null, color, "bold", 1);
}

function resetWhoTouchedBall(){
	whoTouchedBall = [init, init];
	whoTouchedLast = undefined;
}

var getTeamColor = (team) => team == 1 ? 0xE56E56 : 0x5689E5;

room.onGameStop = function(){
	resetWhoTouchedBall();
}