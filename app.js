const express = require("express");
const app = express();
const conn = require("./db");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

function dbQuery(sqlQuery, params) {
  return new Promise((resolve, reject) => {
    conn.query(sqlQuery, params, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/playlists", async (req, res) => {
  const playlists = await dbQuery("SELECT * from playlists");
  res.status(200).json(playlists);
});

// app.get('/playlist-tracks', async (req, res) => {
// 	const tracks = await dbQuery('SELECT * from tracks')
// 	res.status(200).json(tracks)
// })

app.get("/playlist-tracks/:playlist_id", async (req, res) => {
  const playlistTracks = await dbQuery(
    "SELECT * from tracks WHERE playlist_id = ?",
    req.params.playlist_id
  );
  res.status(200).json(playlistTracks);
});

app.post("/playlist", async (req, res) => {
  const { title } = req.body;
  await dbQuery("INSERT INTO playlists (playlist) VALUE (?)", title);
  res.status(200).json({ message: "success" });
});

app.post("/playlist-tracks/:playlist_id", async (req, res) => {
  const playlistTracks = await dbQuery(
    "INSERT INTO tracks (title) WHERE playlist_id = ?",
    req.params.playlist_id
  );
  res.status(200).json(playlistTracks);
});

app.delete("/playlists/:id", async (req, res) => {
  const { id } = req.params;
  await dbQuery("DELETE FROM playlists WHERE id = ?", id);
  res.status(200).json({ message: "success" });
});

module.exports = app;
