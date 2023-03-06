const media = document.querySelector("audio");
const playPause = document.querySelector(".playPause");
const volume = document.querySelector(".volumeSlider");
const audioSlider = document.querySelector(".audioSlider");
const audioTrackTag = document.getElementById("audioTrack");
const songsTag = document.querySelector(".songs");
const playlistsTag = document.querySelector(".playlists");
const addPlaylistButton = document.querySelector(".addplaylist");
const titleInTitles = document.querySelector(".title_subtitle h1");
const subtitleInTitles = document.querySelector(".title_subtitle p");

let currentSong = {
  id: null,
  title: null,
  artist: null,
  duration: null,
  path: null,
};

// addplaylist
addPlaylistButton.addEventListener("click", (e) => {
  let nameForPlaylist = prompt(
    "Please enter the name of your new playlist",
    "New playlist"
  );
  e.preventDefault();
  fetch(`http://localhost:3000/playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: nameForPlaylist }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// removeplaylist
playlistsTag.addEventListener("click", (e) => {
  if (e.target.nodeName == "IMG") {
    // prob evil
    e.preventDefault();
    fetch(`http://localhost:3000/playlists/${e.target.dataset.path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({title: nameForPlaylist})
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

function setCurrentSong(element) {
  currentSong.id = element.dataset.id;
  currentSong.title = element.dataset.title;
  currentSong.artist = element.dataset.artist;
  currentSong.duration = element.dataset.duration;
  currentSong.path = element.dataset.path;
}

function updatePlayer() {
  titleInTitles.innerHTML = currentSong.title;
  subtitleInTitles.innerHTML = currentSong.artist;
  audioTrackTag.src = currentSong.path;
}

//click on song in playlist and play
songsTag.addEventListener("click", (e) => {
  console.log(songsTag);
  setCurrentSong(e.target);
  updatePlayer();
  //console.log(audioTrackTag)
  media.play();
  playPause.src = `img/pause.svg`;
});

//play and pause button
playPause.addEventListener(
  "click",
  function (e) {
    if (media.paused) {
      media.play();
      playPause.src = `img/pause.svg`;
    } else {
      media.pause();
      playPause.src = `img/play.svg`;
    }
  },
  false
);

//volume
volume.addEventListener("mousemove", (e) => {
  media.volume = e.target.value;
});

//change progress bar while playing
function updateTrackTime(track) {
  // console.log(track)
  // console.log(audioSlider)
  let currTimeDiv = document.getElementsByClassName("currentTime")[0];
  let durationDiv = document.getElementsByClassName("duration")[0];

  let currTime = Math.floor(track.currentTime).toString();
  let duration = Math.floor(track.duration).toString();

  currTimeDiv.innerHTML = formatSecondsAsTime(currTime);

  if (isNaN(duration)) {
    durationDiv.innerHTML = "00:00";
  } else {
    durationDiv.innerHTML = formatSecondsAsTime(duration);
  }

  //slider beha podle current time
  audioSlider.min = 0;
  audioSlider.max = track.duration;
  audioSlider.value = track.currentTime;
}

//changes progress bar on click
audioSlider.addEventListener("mousedown", (e) => {
  setTimeout(() => {
    audioTrackTag.currentTime = e.target.value;
  });
});

function formatSecondsAsTime(secs, format) {
  var hr = Math.floor(secs / 3600);
  var min = Math.floor((secs - hr * 3600) / 60);
  var sec = Math.floor(secs - hr * 3600 - min * 60);

  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  return min + ":" + sec;
}

//fetch playlist-tracks

(async () => {
  //populating songs of the playlist
  const playlistTracks = await fetch(`/playlist-tracks`).then((response) =>
    response.json()
  );
  playlistTracks.forEach((e, index) => {
    const el = document.createElement("div");
    el.innerHTML = `${index + 1}. ${e.title}`;
    el.dataset.path = e.path;
    el.setAttribute("data-id", e.id);
    el.setAttribute("data-title", e.title);
    el.setAttribute("data-artist", e.artist);
    el.setAttribute("data-duration", e.duration);
    songsTag.appendChild(el);
  });

  //populating playlists
  const playlists = await fetch("/playlists").then((response) =>
    response.json()
  );
  playlists.forEach((e) => {
    const el = document.createElement("div");
    el.innerHTML = e.playlist;

    if (!e.system_rank) {
      const deleteCross = document.createElement("img");
      deleteCross.src = `img/deleted.png`;
      deleteCross.dataset.path = e.id;
      el.appendChild(deleteCross);
    }
    playlistsTag.appendChild(el);
  });

  audioTrackTag.src = playlistTracks[2].path;
})();
