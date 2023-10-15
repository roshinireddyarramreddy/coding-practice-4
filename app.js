const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const responseObject = (dbObject) =>{
    return {
        playerName : dbObject.player_name,
        jerseyNumber : dbObject.jersey_number,
        role : dbObject.role
    }
}

//API1

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const playerArray = await db.all(getPlayersQuery);
  response.send(
      playerArray.map((eachplayer) => responseObject(eachplayer))
  );
});

//API2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team 
    (player_name, jersey_number, role) VALUES 
    ('${playerName}', '${jerseyNumber}', '${role}');`;
  await db.run(addPlayerQuery);
  response.send("Player added successfully");
});

//API3

app.get("players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API4

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team SET (player_name, jersey_number, role) = 
    ('${playerName}', '${jerseyNumber}', '${role}') ;`;
  await db.run(updatePlayerQuery);
  response.send("Player details updated");
});

//API5

app.delete("/players/:playerId", async (request,response) ={
    const playerId = request.params;
    const deletePlayerQuery = `DELETE FORM cricket_team WHERE player_id = ${playerID};`;
    await db.run(deletePlayerQuery);
    response.send("Player removed");
});
