let daftarGame =
JSON.parse(localStorage.getItem("games")) || [];

let riwayat =
JSON.parse(localStorage.getItem("riwayat")) || [];

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

renderGame();
renderRiwayat();
renderWishlist();

function simpanData(){
localStorage.setItem(
"games",
JSON.stringify(daftarGame)
);

localStorage.setItem(
"riwayat",
JSON.stringify(riwayat)
);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);
}

function tambahGame(){

let nama =
document.getElementById("nama").value;

let genre =
document.getElementById("genre").value;

let rating =
document.getElementById("rating").value;

if(!nama || !genre || !rating){
alert("Lengkapi data");
return;
}

daftarGame.push({
nama,
genre,
rating:Number(rating)
});

simpanData();
renderGame();

document.getElementById("nama").value="";
document.getElementById("genre").value="";
document.getElementById("rating").value="";
}

function renderGame(){

let html="";

daftarGame.forEach((g,index)=>{

html += `
<div class="game">
<b>${g.nama}</b><br>
Genre : ${g.genre}<br>
Rating : ${g.rating}

<br><br>

<button onclick="hapusGame(${index})">
Hapus
</button>
</div>
`;

});

document.getElementById(
"daftarGame"
).innerHTML = html;
}

function hapusGame(index){

daftarGame.splice(index,1);

simpanData();
renderGame();
}

function cariGame(){

let keyword =
document.getElementById(
"cariInput"
).value.toLowerCase();

let hasil = daftarGame.filter(g =>
g.nama.toLowerCase().includes(keyword)
);

let html="";

hasil.forEach(g=>{

html += `
<div class="game">
${g.nama}
|
${g.genre}
|
⭐ ${g.rating}
</div>
`;

});

document.getElementById(
"hasilCari"
).innerHTML = html;
}

function urutkanGame(){

daftarGame.sort(
(a,b)=>b.rating-a.rating
);

simpanData();
renderGame();
}

function mainkanGame(){

let nama =
document.getElementById(
"gameMain"
).value;

if(!nama) return;

riwayat.push(nama);

simpanData();
renderRiwayat();
}

function renderRiwayat(){

let html="";

for(let i=riwayat.length-1;i>=0;i--){

html += `<li>${riwayat[i]}</li>`;
}

document.getElementById(
"riwayat"
).innerHTML = html;
}

function tambahWishlist(){

let nama =
document.getElementById(
"wishlistInput"
).value;

wishlist.push(nama);

simpanData();
renderWishlist();
}

function renderWishlist(){

let html="";

wishlist.forEach(game=>{

html += `<li>${game}</li>`;
});

document.getElementById(
"wishlist"
).innerHTML = html;
}