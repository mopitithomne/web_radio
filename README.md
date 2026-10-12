# Airwave

A responsive internet radio web app with station search, favorites, playback controls, live track metadata, a UTC schedule, and a listener chat link.

## Run locally

Open `index.html` in a modern browser, or serve this directory with any static web server. For example:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. Select a station to start its live stream. Favorites are saved in the browser. Current and recently played tracks are loaded from SomaFM's public metadata feeds; track details and audio therefore require an internet connection. The chat link opens the IRC server in Kiwi IRC.

This static app does not include a listener-count backend or an embedded chat server.
