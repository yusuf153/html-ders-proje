const songs = [
    { title: "Yalan", artist: "Athena", src: "path/to/yalan.mp3" },
    { title: "Bir Sevmek Bin Defa Ölmek Demekmiş", artist: "Barış Manço", src: "path/to/bir-sevmek.mp3" },
    { title: "Cambaz", artist: "Mor ve Ötesi", src: "path/to/cambaz.mp3" },
    { title: "Seni Anan Benim İçin Doğurmuş", artist: "Edip Akbayram", src: "path/to/seni-anan.mp3" },
    { title: "Bana Yalan Söylediler", artist: "Sezen Aksu", src: "path/to/bana-yalan.mp3" }
];

let currentSongIndex = 0;
const audio = new Audio();
let isPlaying = false;
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    document.getElementById('song-title').textContent = song.title;
    document.getElementById('artist').textContent = song.artist;
    updateDiscoverSongs();
    updateLikedSongs();
    updateLikeButton();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(() => {
            console.log("Şarkı dosyası yüklenemedi. Lütfen geçerli bir MP3 dosyası ekleyin.");
        });
    }
    isPlaying = !isPlaying;
    document.querySelector('.controls button:nth-child(2)').textContent = isPlaying ? '⏸' : '▶';
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play().catch(() => {});
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play().catch(() => {});
}

function likeSong() {
    const currentSong = songs[currentSongIndex];
    const songId = `${currentSong.title}-${currentSong.artist}`;
    if (!likedSongs.includes(songId)) {
        likedSongs.push(songId);
    } else {
        likedSongs = likedSongs.filter(id => id !== songId);
    }
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    updateLikedSongs();
    updateLikeButton();
}

function updateLikeButton() {
    const currentSong = songs[currentSongIndex];
    const songId = `${currentSong.title}-${currentSong.artist}`;
    const likeButton = document.getElementById('like-button');
    likeButton.textContent = likedSongs.includes(songId) ? '❤️' : '♡';
    likeButton.classList.toggle('liked', likedSongs.includes(songId));
}

function updateDiscoverSongs() {
    const songList = document.getElementById('discover-songs');
    songList.innerHTML = '';
    songs.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = 'song-item' + (index === currentSongIndex ? ' active' : '');
        div.textContent = `${song.title} - ${song.artist}`;
        div.onclick = () => {
            currentSongIndex = index;
            loadSong(index);
            if (isPlaying) audio.play().catch(() => {});
        };
        songList.appendChild(div);
    });
}

function updateLikedSongs() {
    const likedList = document.getElementById('liked-songs');
    likedList.innerHTML = '';
    songs
        .filter(song => likedSongs.includes(`${song.title}-${song.artist}`))
        .forEach(song => {
            const div = document.createElement('div');
            div.className = 'song-item';
            div.textContent = `${song.title} - ${song.artist}`;
            div.onclick = () => {
                currentSongIndex = songs.indexOf(song);
                loadSong(currentSongIndex);
                if (isPlaying) audio.play().catch(() => {});
            };
            likedList.appendChild(div);
        });
}

function createPlaylist() {
    const playlistName = document.getElementById('new-playlist').value.trim();
    if (playlistName) {
        playlists.push({ name: playlistName, songs: [] });
        localStorage.setItem('playlists', JSON.stringify(playlists));
        document.getElementById('new-playlist').value = '';
        updatePlaylists();
    }
}

function updatePlaylists() {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = '';
    playlists.forEach((playlist, index) => {
        const div = document.createElement('div');
        div.className = 'playlist-item';
        div.textContent = playlist.name;
        div.onclick = () => {
            // Çalma listesi detay sayfası için placeholder
            alert(`Çalma listesi: ${playlist.name}`);
        };
        playlistList.appendChild(div);
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.sidebar a').forEach(a => {
        a.classList.remove('active');
    });
    document.querySelector(`.sidebar a[href="#${sectionId}"]`).classList.add('active');
}

function searchSongs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const songList = document.getElementById('discover-songs');
    songList.innerHTML = '';
    songs
        .filter(song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query))
        .forEach((song, index) => {
            const div = document.createElement('div');
            div.className = 'song-item';
            div.textContent = `${song.title} - ${song.artist}`;
            div.onclick = () => {
                currentSongIndex = songs.indexOf(song);
                loadSong(currentSongIndex);
                if (isPlaying) audio.play().catch(() => {});
            };
            songList.appendChild(div);
        });
}

// İlk şarkıyı yükle
loadSong(currentSongIndex);
updatePlaylists();