document.addEventListener("DOMContentLoaded", () => {

    const songs = [

        {
            title: "My First Track",
            artist: "Arslan",
            src: "./assets/file_example_MP3_700KB.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
        },
        {
            title: "My Second Track",
            artist: "Arslan",
            src: "./assets/file_example_MP3_700KB.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
        },
        {
            title: "My Third Track",
            artist: "Arslan",
            src: "./assets/file_example_MP3_700KB.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
        },
    ];


    // DOM Elements
    const audio = document.getElementById("audio-player");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = document.getElementById("play-icon");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const coverImg = document.getElementById("cover-img");
    const artContainer = document.querySelector(".album-art-container");

    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");
    const totalDurationEl = document.getElementById("total-duration");

    const volumeSlider = document.getElementById("volume-slider");
    const volumePercent = document.getElementById("volume-percent");
    const muteBtn = document.getElementById("mute-btn");
    const volumeIcon = document.getElementById("volume-icon");

    const playlistList = document.getElementById("playlist-list");
    const trackCount = document.getElementById("track-count");

    // State
    let currentSongIndex = 0;
    let isPlaying = false;
    let previousVolume = 0.8;

    // Initialize
    function init() {
        if (!songs.length) return;
        audio.volume = previousVolume;
        trackCount.textContent = `${songs.length} Tracks`;
        renderPlaylist();
        loadSong(currentSongIndex);
    }

    // Load Song
    function loadSong(index) {
        const song = songs[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        coverImg.src = song.cover;
        audio.src = song.src;
        audio.load();

        progressBar.style.width = "0%";
        currentTimeEl.textContent = "0:00";
        totalDurationEl.textContent = "0:00";
        updateActivePlaylistItem();
    }

    // Play / Pause
    function playSong() {
        isPlaying = true;
        audio.play().catch(err => {
            console.error("Playback error:", err);
            alert("Could not play audio. Check if your MP3 file path exists.");
        });
        playIcon.classList.replace("fa-play", "fa-pause");
        artContainer.classList.add("playing");
        updateActivePlaylistItem();
    }

    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playIcon.classList.replace("fa-pause", "fa-play");
        artContainer.classList.remove("playing");
        updateActivePlaylistItem();
    }

    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Navigation
    prevBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    nextBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    // Time Formatting
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Update Duration when loaded
    audio.addEventListener("loadedmetadata", () => {
        totalDurationEl.textContent = formatTime(audio.duration);
    });

    // Move Progress Bar as song plays
    audio.addEventListener("timeupdate", () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    // Click Progress Bar to Skip / Seek
    progressContainer.addEventListener("click", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            const percentage = clickX / width;
            audio.currentTime = percentage * audio.duration;
        }
    });

    // Auto-play next song on end
    audio.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    // Volume Control
    volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        audio.volume = val;
        if (val > 0) previousVolume = val;
        updateVolumeUI(val);
    });

    muteBtn.addEventListener("click", () => {
        if (audio.volume > 0) {
            previousVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            updateVolumeUI(0);
        } else {
            audio.volume = previousVolume || 0.5;
            volumeSlider.value = audio.volume;
            updateVolumeUI(audio.volume);
        }
    });

    function updateVolumeUI(val) {
        volumePercent.textContent = `${Math.round(val * 100)}%`;
        volumeIcon.className = "fa-solid";
        if (val === 0) {
            volumeIcon.classList.add("fa-volume-xmark");
        } else if (val < 0.5) {
            volumeIcon.classList.add("fa-volume-low");
        } else {
            volumeIcon.classList.add("fa-volume-high");
        }
    }

    // Render Playlist UI
    function renderPlaylist() {
        playlistList.innerHTML = "";
        songs.forEach((song, index) => {
            const li = document.createElement("li");
            li.classList.add("playlist-item");

            li.innerHTML = `
        <div class="item-details">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
        <div class="item-status">
          <i class="fa-solid fa-play"></i>
        </div>
      `;

            li.addEventListener("click", () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });

            playlistList.appendChild(li);
        });
    }

    function updateActivePlaylistItem() {
        const items = document.querySelectorAll(".playlist-item");
        items.forEach((item, idx) => {
            const icon = item.querySelector(".item-status i");
            if (idx === currentSongIndex) {
                item.classList.add("active");
                icon.className = isPlaying ? "fa-solid fa-volume-high" : "fa-solid fa-pause";
            } else {
                item.classList.remove("active");
                icon.className = "fa-solid fa-play";
            }
        });
    }

    // Run App
    init();
});