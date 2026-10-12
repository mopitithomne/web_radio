const stations = [
  {
    id: "groove-salad",
    name: "Groove Salad",
    genre: "Ambient · Downtempo",
    description: "A nicely chilled plate of ambient beats",
    stream: "https://ice1.somafm.com/groovesalad-128-mp3",
    color: "#c7f36b",
    symbol: "◌",
  },
  {
    id: "drone-zone",
    name: "Drone Zone",
    genre: "Ambient · Atmospheric",
    description: "Atmospheric textures with no beats",
    stream: "https://ice1.somafm.com/dronezone-128-mp3",
    color: "#a9a2f5",
    symbol: "〰",
  },
  {
    id: "indie-pop",
    name: "Indie Pop Rocks!",
    genre: "Indie · Alternative",
    description: "New and classic indie pop",
    stream: "https://ice1.somafm.com/indiepop-128-mp3",
    color: "#f4a77b",
    symbol: "✳",
  },
  {
    id: "secret-agent",
    name: "Secret Agent",
    genre: "Lounge · Spy",
    description: "The soundtrack for your stylish, mysterious life",
    stream: "https://ice1.somafm.com/secretagent-128-mp3",
    color: "#edcf72",
    symbol: "◈",
  },
  {
    id: "lush",
    name: "Lush",
    genre: "Electronic · Chill",
    description: "Sensuous and mellow vocals",
    stream: "https://ice1.somafm.com/lush-128-mp3",
    color: "#e78eb8",
    symbol: "✿",
  },
  {
    id: "the-trip",
    name: "The Trip",
    genre: "Psych · Progressive",
    description: "Progressive from the past to the future",
    stream: "https://ice1.somafm.com/thetrip-128-mp3",
    color: "#78c8c3",
    symbol: "↗",
  },
];

const audio = document.querySelector("#audio-player");
const stationList = document.querySelector("#station-list");
const searchInput = document.querySelector("#station-search");
const emptyState = document.querySelector("#empty-state");
const playButton = document.querySelector("#play-button");
const playIcon = document.querySelector("#play-icon");
const playerStation = document.querySelector("#player-station");
const playerGenre = document.querySelector("#player-genre");
const playerArt = document.querySelector("#player-art");
const playerStatus = document.querySelector("#player-status");
const volume = document.querySelector("#volume");
let currentStation = null;
let filter = "all";
const favorites = new Set(JSON.parse(localStorage.getItem("airwave-favorites") || "[]"));

function renderStations() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredStations = stations.filter((station) => {
    const matchesQuery = `${station.name} ${station.genre} ${station.description}`.toLowerCase().includes(query);
    return matchesQuery && (filter === "all" || favorites.has(station.id));
  });

  stationList.replaceChildren(...filteredStations.map((station) => {
    const card = document.createElement("article");
    card.className = `station-card${currentStation?.id === station.id ? " is-playing" : ""}`;
    card.style.setProperty("--station-color", station.color);
    card.tabIndex = 0;
    card.setAttribute("aria-label", `Play ${station.name}, ${station.genre}`);

    const top = document.createElement("div");
    top.className = "station-card-top";
    const art = document.createElement("span");
    art.className = "station-art";
    art.setAttribute("aria-hidden", "true");
    art.textContent = station.symbol;
    const favoriteButton = document.createElement("button");
    favoriteButton.className = `favorite-button${favorites.has(station.id) ? " is-favorite" : ""}`;
    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-label", `${favorites.has(station.id) ? "Remove" : "Add"} ${station.name} ${favorites.has(station.id) ? "from" : "to"} favorites`);
    favoriteButton.setAttribute("aria-pressed", favorites.has(station.id));
    favoriteButton.textContent = favorites.has(station.id) ? "♥" : "♡";
    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (favorites.has(station.id)) favorites.delete(station.id);
      else favorites.add(station.id);
      localStorage.setItem("airwave-favorites", JSON.stringify([...favorites]));
      renderStations();
    });
    top.append(art, favoriteButton);

    const title = document.createElement("h3");
    title.textContent = station.name;
    const genre = document.createElement("p");
    genre.textContent = station.genre;
    const play = document.createElement("span");
    play.className = "station-play";
    play.setAttribute("aria-hidden", "true");
    play.textContent = currentStation?.id === station.id && !audio.paused ? "Ⅱ" : "▶";
    card.append(top, title, genre, play);
    card.addEventListener("click", () => selectStation(station));
    card.addEventListener("keydown", (event) => {
      if (event.target === card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        selectStation(station);
      }
    });
    return card;
  }));
  emptyState.hidden = filteredStations.length > 0;
}

async function selectStation(station) {
  if (currentStation?.id === station.id) {
    if (audio.paused) await startPlayback();
    else audio.pause();
    return;
  }

  currentStation = station;
  audio.src = station.stream;
  playerStation.textContent = station.name;
  playerGenre.textContent = station.genre;
  playerArt.textContent = station.symbol;
  playerArt.style.background = station.color;
  playButton.disabled = false;
  playerStatus.textContent = "Connecting…";
  renderStations();
  await startPlayback();
}

async function startPlayback() {
  if (!currentStation) return;
  try {
    await audio.play();
    playerStatus.textContent = "On air";
  } catch {
    playerStatus.textContent = "Stream unavailable";
  }
  renderStations();
}

searchInput.addEventListener("input", renderStations);
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", active);
    });
    renderStations();
  });
});
playButton.addEventListener("click", () => {
  if (audio.paused) startPlayback();
  else audio.pause();
});
volume.addEventListener("input", () => { audio.volume = Number(volume.value); });
audio.volume = Number(volume.value);
audio.addEventListener("playing", () => { playerStatus.textContent = "On air"; });
audio.addEventListener("waiting", () => { playerStatus.textContent = "Buffering…"; });
audio.addEventListener("error", () => {
  if (currentStation) playerStatus.textContent = "Stream unavailable";
});
audio.addEventListener("play", () => { playIcon.textContent = "Ⅱ"; playButton.setAttribute("aria-label", "Pause"); });
audio.addEventListener("pause", () => { playIcon.textContent = "▶"; playButton.setAttribute("aria-label", "Play"); renderStations(); });

renderStations();
