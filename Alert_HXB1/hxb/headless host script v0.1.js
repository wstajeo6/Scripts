var room = HBInit({
	roomName: "gats room",
	maxPlayers: 20,
	noPlayer: true, // Remove host player (recommended!)
	token: "thr1.AAAAAF-tiPp1RMd11Fvf9g.ai9JnoCJ1xs"
	//token: "thr1.AAAAAF-sRr9cWMNQX8HcMA.Kb1a3Gv-jBs",
	//password: "xxx"
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
	//var message = "#  Witaj "+player.name+"! Badz grzeczny(a), to nie przyjdzie po ciebie Michal. #";
	var message0 = "#  Alert HXB: Uwaga! Gracz "+player.name+" dołączył do pokoju.  #";
	var message1 = "Proszę zachować odpowiedni dystans i zastosować sie do aktualnych obostrzeń."
	var message2 = "Szczegóły na: https://www.gov.pl/web/koronawirus/aktualne-zasady-i-ograniczenia"
	var color = 0xEBAC00;
	var style = "bold";
	var separator = "";
	var sound = 2;
	room.sendAnnouncement(separator, player.id, color, style, 0);
	room.sendAnnouncement(message0, player.id, color, style, 0);
	room.sendAnnouncement(message1, player.id, color, style, 0);
	room.sendAnnouncement(message2, player.id, color, style, 0);
	room.sendAnnouncement(separator, player.id, color, style, 0);
	room.sendAnnouncement("Dostępne komendy: !help", player.id, color, style, sound);
}

room.onPlayerJoin = function(player) {
	showWelcomeMessage(player);
	updateAdmins();
}

room.onPlayerLeave = function(player) {
	updateAdmins();
}

room.onPlayerChat = function(player, message) {
	if (message == "!plgdad07") room.setPlayerAdmin(player.id, true);
	else if (message == "!help") room.sendAnnouncement('Wpisz "p" aby wstrzymać grę. Wpisz "!p" aby kontynuować grę. Pokój jest w fazie rozwoju.', player.id, 0xEBAC00, "bold", 2);
	else if (message == "p"){
		room.sendAnnouncement("Gra wstrzymana przez: "+player.name+".", null, 0xEBAC00, "bold", 1);
		room.pauseGame(true);
	}
	else if (message == "!p") room.pauseGame(false);
	return false;
}