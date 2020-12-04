var room = HBInit({
	roomName: "gats room",
	maxPlayers: 20,
	noPlayer: true, // Remove host player (recommended!)
	token: "thr1.AAAAAF-2wTTNwhZgV6xBfQ.RzQnKj2ZzQo",
	//org token: "thr1.AAAAAF-sRr9cWMNQX8HcMA.Kb1a3Gv-jBs",
	password: "xxx"
});
room.setDefaultStadium("Classic");
room.setScoreLimit(3);
room.setTimeLimit(3);

// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() { 
  // Get all players
  var players = room.getPlayerList();
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

function showWelcomeMessage(player) {
  var message = "#  Witaj "+player.name+"! Badz grzeczny(a), to nie przyjdzie po ciebie Michal. #"
  var color = 0xEBAC00;
  var style = "bold";
  //#################################################################################
  var separator = ""
  room.sendAnnouncement(separator, player.id, color, "bold", 2);
  room.sendAnnouncement(message, player.id, color, "bold", 2);
  room.sendAnnouncement(separator, player.id, color, "bold", 2);
}

room.onPlayerJoin = function(player) {
  showWelcomeMessage(player);
  updateAdmins();
}

room.onPlayerLeave = function(player) {
  updateAdmins();
}

room.onPlayerChat = function(player, message) {
	if (message == "!plgdad07") {
		room.setPlayerAdmin(player.id, true);
		return false;
	}	
}
