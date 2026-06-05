// =========================
// DATA
// =========================

let currentCollection = 0;
let editIndex = null;

let collections =
JSON.parse(localStorage.getItem("collections")) || [
    { name: "Koleksi 1", games: [] },
    { name: "Koleksi 2", games: [] },
    { name: "Koleksi 3", games: [] },
    { name: "Koleksi 4", games: [] },
    { name: "Koleksi 5", games: [] }
];

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

let historyGames =
JSON.parse(localStorage.getItem("historyGames")) || [];


// =========================
// SAVE
// =========================

function saveData() {

    localStorage.setItem(
        "collections",
        JSON.stringify(collections)
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    localStorage.setItem(
        "historyGames",
        JSON.stringify(historyGames)
    );
}


// =========================
// TOAST
// =========================

function showToast(message){

    const toast =
    document.getElementById(
        "toast"
    );

    toast.innerHTML =
    message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toast.timer
    );

    toast.timer =
    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },2500);

}


// =========================
// DASHBOARD
// =========================

function updateDashboard() {

    let totalGame = 0;
    let totalRating = 0;

    collections.forEach(col => {

        totalGame += col.games.length;

        col.games.forEach(game => {
            totalRating += Number(game.rating);
        });

    });

    document.getElementById("totalGame").innerText =
        totalGame;

    document.getElementById("totalWishlist").innerText =
        wishlist.length;

    document.getElementById("playedCount").innerText =
        historyGames.length;

    document.getElementById("avgRating").innerText =
        totalGame > 0
        ? (totalRating / totalGame).toFixed(1)
        : 0;
}


// =========================
// SWITCH COLLECTION
// =========================

function switchCollection(index) {

    currentCollection = index;

    document
        .querySelectorAll(".collection-btn")
        .forEach(btn => btn.classList.remove("active"));

    document
        .querySelectorAll(".collection-btn")
        [index]
        .classList.add("active");

    renderGames();
    updateProgress();

    document.getElementById(
        "collectionTitle"
    ).innerText =
    collections[index].name;
}


// =========================
// PROGRESS
// =========================

function updateProgress() {

    const total =
    collections[currentCollection].games.length;

    const percent =
    (total / 10) * 100;

    document.getElementById(
        "collectionProgress"
    ).style.width =
    percent + "%";

    document.getElementById(
        "progressText"
    ).innerText =
    total + " / 10 Game";
}


// =========================
// TAMBAH GAME
// =========================

function tambahGame() {

    const btn =
document.getElementById(
    "btnTambahGame"
);

btn.disabled = true;

btn.innerHTML =
"⏳ Menambahkan...";

    const nama =
    document.getElementById(
        "namaGame"
    ).value.trim();

    const genre =
    document.getElementById(
        "genreGame"
    ).value;

    const rating =
    document.getElementById(
        "ratingGame"
    ).value;

    if (!nama || !genre || !rating) {

        showToast(
            "⚠ Lengkapi semua data!"
        );

        return;
    }

    if (
        collections[currentCollection]
        .games.length >= 10
    ) {

        showToast(
            "⚠ Koleksi sudah penuh!"
        );

        return;
    }

    const game = {

        nama,
        genre,
        rating,

        tanggal:
        new Date()
        .toLocaleDateString(
            "id-ID"
        )

    };

    setTimeout(() => {

        collections[currentCollection]
        .games.push(game);

        saveData();

        renderGames();

        updateDashboard();

        updateProgress();

        document.getElementById(
            "namaGame"
        ).value = "";

        document.getElementById(
            "genreGame"
        ).value = "";

        document.getElementById(
            "ratingGame"
        ).value = "";

        showToast(
            "✔ Game berhasil ditambahkan ke koleksi!"
        );

    }, 1000);
}


// =========================
// TABEL GAME
// =========================

function renderGames() {

    const tbody =
    document.getElementById(
        "gameTable"
    );

    tbody.innerHTML = "";

    let games =
    [...collections[currentCollection]
    .games];

    const keyword =
    document.getElementById(
        "searchGame"
    )?.value
    ?.toLowerCase() || "";

    const genreFilter =
    document.getElementById(
        "filterGenre"
    )?.value || "";

    games = games.filter(game => {

        const cocokNama =
        game.nama
        .toLowerCase()
        .includes(keyword);

        const cocokGenre =
        genreFilter === ""
        || game.genre === genreFilter;

        return cocokNama
        && cocokGenre;
    });

    const sort =
    document.getElementById(
        "sortGame"
    )?.value;

    if (sort === "rating-desc") {

        games.sort(
            (a,b) =>
            b.rating - a.rating
        );

    }

    if (sort === "rating-asc") {

        games.sort(
            (a,b) =>
            a.rating - b.rating
        );

    }

    if (sort === "name-asc") {

        games.sort(
            (a,b) =>
            a.nama.localeCompare(
                b.nama
            )
        );

    }

    if (sort === "name-desc") {

        games.sort(
            (a,b) =>
            b.nama.localeCompare(
                a.nama
            )
        );

    }

    games.forEach(
    (game,index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${game.nama}</td>

            <td>
                <span class="genre-badge">
                    ${game.genre}
                </span>
            </td>

            <td>
                ⭐ ${game.rating}
            </td>

            <td>
                ${game.tanggal}
            </td>

            <td>

                <button
                onclick="hapusGame(${index})">

                    Hapus

                </button>

            </td>

        </tr>

        `;
    });

    updatePlaySelect();
}


// =========================
// HAPUS GAME
// =========================

function hapusGame(index) {

    if (
        !confirm(
            "Hapus game ini?"
        )
    ) return;

    collections[currentCollection]
    .games.splice(index,1);

    saveData();

    renderGames();

    updateDashboard();

    updateProgress();

    showToast(
        "🗑 Game berhasil dihapus!"
    );
}


// =========================
// FILTER GENRE
// =========================

function isiGenreFilter() {

    const filter =
    document.getElementById(
        "filterGenre"
    );

    const genres = [

        "Action",
        "Adventure",
        "RPG",
        "MMORPG",
        "FPS",
        "TPS",
        "MOBA",
        "Battle Royale",
        "Open World",
        "Sandbox",
        "Simulation",
        "Strategy",
        "Puzzle",
        "Horror",
        "Survival",
        "Sports",
        "Racing",
        "Fighting",
        "Rhythm",
        "Music",
        "Visual Novel",
        "Platformer",
        "Casual",
        "Card Game",
        "Idle",
        "Roguelike",
        "Roguelite",
        "Tower Defense"

    ];

    genres.forEach(g => {

        filter.innerHTML +=
        `<option>${g}</option>`;

    });
}


// =========================
// EVENT SEARCH
// =========================

document
.getElementById("searchGame")
.addEventListener(
    "input",
    renderGames
);

document
.getElementById("filterGenre")
.addEventListener(
    "change",
    renderGames
);

document
.getElementById("sortGame")
.addEventListener(
    "change",
    renderGames
);


// =========================
// INIT
// =========================

isiGenreFilter();

updateDashboard();

renderGames();

updateProgress();

switchCollection(0);

const themeToggle =
document.getElementById("themeToggle");

document.body.classList.add("dark");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.remove("dark");
    document.body.classList.add("light");

    themeToggle.checked = true;

}else{

    document.body.classList.remove("light");
    document.body.classList.add("dark");

    themeToggle.checked = false;
}

themeToggle.addEventListener("change",()=>{

    if(themeToggle.checked){

        document.body.classList.remove("dark");
        document.body.classList.add("light");

        localStorage.setItem(
            "theme",
            "light"
        );

    }else{

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        localStorage.setItem(
            "theme",
            "dark"
        );
    }

});

function renameCollection(){

    const namaBaru = prompt(
        "Masukkan nama koleksi:"
    );

    if(!namaBaru) return;

    collections[currentCollection].name =
    namaBaru;

    saveData();

    document.getElementById(
        "collectionTitle"
    ).innerText =
    namaBaru;

    document.querySelectorAll(
        ".collection-btn"
    )[currentCollection]
    .innerText =
    namaBaru;

    showToast(
        "✔ Nama koleksi diperbarui!"
    );
}

function renameCollection(){

    const namaBaru =
    prompt(
        "Masukkan nama koleksi baru:"
    );

    if(
        !namaBaru ||
        namaBaru.trim()===""
    ) return;

    collections[
        currentCollection
    ].name =
    namaBaru;

    saveData();

    document.getElementById(
        "collectionTitle"
    ).innerText =
    namaBaru;

    document
    .querySelectorAll(
        ".collection-btn"
    )[currentCollection]
    .innerText =
    namaBaru;

    showToast(
        "✅ Nama koleksi berhasil diubah!"
    );

}

updateDashboard();

renderGames();

updateProgress();

switchCollection(0);

showToast(
    "🎮 Selamat datang!"
);

function updatePlaySelect(){

    const select =
    document.getElementById(
        "playSelect"
    );

    if(!select) return;

    select.innerHTML =
    '<option value="">Pilih Game</option>';

    collections[currentCollection]
    .games
    .forEach((game,index)=>{

        select.innerHTML += `
            <option value="${index}">
                ${game.nama}
            </option>
        `;

    });

}

function mainkanGame(){

    const select =
    document.getElementById(
        "playSelect"
    );

    if(select.value === ""){

        showToast(
            "Pilih game terlebih dahulu!"
        );

        return;
    }

    const game =
    collections[currentCollection]
    .games[select.value];

    historyGames.unshift(
        game.nama
    );

    saveData();

    renderRiwayat();

    updateDashboard();

    showToast(
        `🎮 Sedang memainkan ${game.nama}`
    );

}function renderRiwayat(){

    const list =
    document.getElementById(
        "riwayatList"
    );

    if(!list) return;

    list.innerHTML = "";

    historyGames.forEach(game=>{

        list.innerHTML += `
            <li>${game}</li>
        `;

    });

}

function binarySearch(arr,target){

    let left = 0;
    let right = arr.length - 1;

    while(left <= right){

        let mid =
        Math.floor(
            (left + right)/2
        );

        let value =
        arr[mid].nama
        .toLowerCase();

        if(value === target){

            return arr[mid];
        }

        if(value < target){

            left = mid + 1;

        }else{

            right = mid - 1;
        }
    }

    return null;
}

function interpolationSearch(
arr,target
){

    let low = 0;
    let high = arr.length - 1;

    while(
        low <= high &&
        target >= arr[low].rating &&
        target <= arr[high].rating
    ){

        let pos =
        low +
        Math.floor(

            ((target-arr[low].rating)
            *(high-low))

            /

            (arr[high].rating
            -
            arr[low].rating)

        );

        if(
            arr[pos].rating
            === target
        ){
            return arr[pos];
        }

        if(
            arr[pos].rating
            < target
        ){

            low = pos + 1;

        }else{

            high = pos - 1;
        }
    }

    return null;
}

class Node{

    constructor(data){

        this.data = data;

        this.next = null;
    }
}

function renderLinkedList(){

    let html = "";

    collections[currentCollection]
    .games
    .forEach(game=>{

        html +=
        `
        <div class="node">

            ${game.nama}

            ↓

        </div>
        `;
    });

    document
    .getElementById(
        "linkedListView"
    )
    .innerHTML =
    html;
}

class DoubleNode{

    constructor(data){

        this.data = data;

        this.prev = null;

        this.next = null;
    }
}

function renderDoubleList(){

    let html = "";

    wishlist.forEach(game=>{

        html +=
        `
        <span>

        ⇄ ${game}

        </span>
        `;
    });

    document
    .getElementById(
        "doubleListView"
    )
    .innerHTML =
    html;
}

function renderChart(){

    const genreCount = {};

    collections[currentCollection]
    .games
    .forEach(game=>{

        genreCount[
            game.genre
        ] =
        (
        genreCount[
            game.genre
        ] || 0
        ) + 1;

    });

}

function undoHistory(){

    historyGames.pop();

    saveData();

    renderRiwayat();

}

