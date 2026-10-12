(()=>{
const G=window.KIGO_GAMES,C=window.KIGO_CATEGORIES,$=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem("kigo:"+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem("kigo:"+k,JSON.stringify(v))}catch{}}};
let favs=store.get("favs",[]),recent=store.get("recent",[]),st={q:"",cat:"",sort:"new"};
const byId=id=>G.find(g=>g.id===id),ok=g=>g.status==="Available"&&g.url;
const verb=g=>g.type==="apk"?"Install":"Play";
function card(g){const on=favs.includes(g.id);
 return `<article class="card"><a class="thumb" href="#/game/${esc(g.id)}" aria-label="${verb(g)} ${esc(g.title)}">${g.thumbnail?`<img src="${esc(g.thumbnail)}" alt="Cover ${esc(g.title)}" loading="lazy">`:`<span class="ph" aria-hidden="true">${esc(g.title[0])}</span>`}<span class="play">${verb(g)}</span></a>
 <button class="fav${on?" on":""}" data-fav="${esc(g.id)}" aria-pressed="${on}" aria-label="Favorit ${esc(g.title)}">${on?"♥":"♡"}</button>
 <div class="meta"><h3>${esc(g.title)}</h3><small>${esc(g.category)} · <span class="st${ok(g)?"":" soon"}">${esc(g.status)}</span></small></div></article>`}
const grid=l=>l.length?`<div class="grid">${l.map(card).join("")}</div>`:"";
const empty=(t,d,a="")=>`<div class="empty"><b>${t}</b>${d}${a}</div>`;
const sec=(t,l)=>l.length?`<section><h2>${t}</h2>${grid(l)}</section>`:"";
const sorters={new:(a,b)=>b.added.localeCompare(a.added),pop:(a,b)=>b.popularity-a.popularity,az:(a,b)=>a.title.localeCompare(b.title)};
const list=()=>G.filter(g=>(!st.cat||g.category===st.cat)&&(g.title+" "+g.category+" "+g.description).toLowerCase().includes(st.q.toLowerCase())).sort(sorters[st.sort]);

function home(){const f=G.find(g=>g.featured)||G[0];
 return `<div class="hero"><div><span class="tag">Game unggulan · ${esc(f.category)}</span><h1>${esc(f.title)}</h1><p>${esc(f.description)}</p>
 <div class="acts"><a class="btn red" href="#/game/${esc(f.id)}">${verb(f)} Now</a><a class="btn" href="#/explore">Jelajahi game</a></div></div>
 <div class="art" role="img" aria-label="Cover ${esc(f.title)}" style="background-image:url('${esc(f.thumbnail)}')"></div></div>`
 +sec("Featured Games",G.filter(g=>g.featured))+sec("Trending Games",[...G].sort(sorters.pop).slice(0,4))
 +sec("Recently Added",[...G].sort(sorters.new).slice(0,4))+sec("All Games",G);}
function explore(){
 return `<div class="pagehead"><h1>Explore</h1></div><div class="bar"><button class="chip${st.cat?"":" on"}" data-cat="">Semua</button>${C.map(c=>`<button class="chip${st.cat===c?" on":""}" data-cat="${c}">${c}</button>`).join("")}
 <select id="sort" aria-label="Urutkan"><option value="new"${st.sort=="new"?" selected":""}>Terbaru</option><option value="pop"${st.sort=="pop"?" selected":""}>Populer</option><option value="az"${st.sort=="az"?" selected":""}>A–Z</option></select></div><div id="res"></div>`}
function fill(){const r=$("#res");if(!r)return;const l=list();r.innerHTML=l.length?grid(l):empty("Game tidak ditemukan","Coba kata kunci lain atau pilih kategori berbeda.",`<div class="row" style="justify-content:center"><button class="btn" id="reset">Reset filter</button></div>`)}
function categories(){return `<div class="pagehead"><h1>Categories</h1></div><div class="grid cats">${C.map(c=>`<a class="card" href="#/explore?cat=${c}"><h3>${c}</h3><small>${G.filter(g=>g.category===c).length} game</small></a>`).join("")}</div>`}
function library(){const F=favs.map(byId).filter(Boolean),R=recent.map(byId).filter(Boolean);
 return `<div class="pagehead"><h1>My Library</h1></div><section><h2>Favorit</h2>${F.length?grid(F):empty("Belum ada favorit","Tekan ♡ pada kartu game untuk menyimpannya di sini.")}</section>
 <section><h2>Recently Played</h2>${R.length?grid(R):empty("Belum ada riwayat","Game yang kamu mainkan atau pasang akan muncul di sini.",`<div class="row" style="justify-content:center"><a class="btn red" href="#/explore">Cari game</a></div>`)}</section>`}
function detail(id){const g=byId(id);if(!g)return empty("Game tidak ditemukan","Game ini tidak ada di KiGo.",`<div class="row" style="justify-content:center"><a class="btn red" href="#/">Back to KiGo</a></div>`);
 const on=favs.includes(g.id),apk=g.type==="apk";
 const stage=!ok(g)?`<div class="msg"><b>Segera hadir</b><p>Game ini belum tersedia. Url game belum diisi di <code>js/games.js</code>.</p></div>`
  :apk?`<div class="msg"><h2>${esc(g.title)}</h2><p>Versi Android (APK) · ${esc(g.size||"")}</p><div class="row" style="justify-content:center"><a class="btn red" id="dl" href="${esc(g.url)}" download>Download &amp; Install APK</a></div><div class="note" id="dev"></div></div>`
  :`<div class="msg"><button class="btn red" id="go">Play</button></div>`;
 return `<div class="pagehead"><a class="btn" href="#/" style="margin-top:20px">← Back to KiGo</a></div>
 <div class="detail"><div><div class="stage${apk?" apk":""}" id="stage">${stage}</div>
 <div class="row">${apk?"":`<button class="btn red" id="go2"${ok(g)?"":" disabled"}>Play</button><button class="btn" id="fs"${ok(g)?"":" disabled"}>Fullscreen</button>${ok(g)?`<a class="btn" href="${esc(g.url)}" target="_blank" rel="noopener">Buka di tab baru</a>`:""}`}<button class="btn" data-fav="${esc(g.id)}" id="favb">${on?"♥ Favorit":"♡ Tambah favorit"}</button></div></div>
 <div class="panel"><span class="tag">${esc(g.category)}</span><h1 style="font-size:30px;margin-bottom:8px">${esc(g.title)}</h1><p>${esc(g.description)}</p>
 <h3>Kontrol</h3><p>${esc(g.controls||"Belum ada petunjuk kontrol.")}</p>
 ${apk?`<h3>Cara memasang</h3><ol><li>Buka halaman ini di HP Android, lalu tekan Download &amp; Install APK.</li><li>Buka file yang terunduh. Jika diminta, izinkan “Pasang aplikasi tidak dikenal” untuk browser kamu.</li><li>Tekan Install, lalu buka game dari layar utama.</li></ol>`:""}</div></div>`}

function play(g){const s=$("#stage");s.innerHTML=`<div class="msg" id="ld"><div class="spin"></div>Memuat game…</div><iframe title="${esc(g.title)}" src="${esc(g.url)}" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>`;
 const f=s.querySelector("iframe");f.onload=()=>{$("#ld")?.remove()};
 setTimeout(()=>{if($("#ld"))$("#ld").innerHTML=`<b>Game belum tampil?</b><p>Situs game mungkin memblokir embed atau koneksi lambat.</p><a class="btn red" href="${esc(g.url)}" target="_blank" rel="noopener">Buka di tab baru</a>`},9000);addRecent(g.id)}
function addRecent(id){recent=[id,...recent.filter(x=>x!==id)].slice(0,12);store.set("recent",recent)}
function toggleFav(id){favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];store.set("favs",favs);route(true)}

function route(keep){const[p,qs]=(location.hash.slice(1)||"/").split("?"),parts=p.split("/").filter(Boolean),r=parts[0]||"home",y=scrollY;
 if(r==="explore"&&qs){const c=new URLSearchParams(qs).get("cat");if(c!==null)st.cat=c}
 app.innerHTML=r==="explore"?explore():r==="categories"?categories():r==="library"?library():r==="game"?detail(parts[1]):home();
 if(r==="explore")fill();
 document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.r===(r==="game"?"":r)));
 $("#menu").classList.remove("open");$("#burger").setAttribute("aria-expanded","false");
 if(r==="game"){const g=byId(parts[1]);if(g&&ok(g)){$("#go")?.addEventListener("click",()=>play(g));$("#go2")?.addEventListener("click",()=>play(g));
  $("#dl")?.addEventListener("click",()=>addRecent(g.id));$("#fs")?.addEventListener("click",()=>{const s=$("#stage");if(!s.querySelector("iframe"))play(g);(s.requestFullscreen||s.webkitRequestFullscreen)?.call(s)});
  const d=$("#dev");if(d)d.textContent=/Android/i.test(navigator.userAgent)?"Perangkat Android terdeteksi. File APK siap diunduh.":"APK hanya bisa dipasang di Android. Buka halaman ini dari HP Android, atau pindahkan file APK ke HP kamu."}}
 document.title=(r==="game"&&byId(parts[1])?byId(parts[1]).title+" – ":"")+"KiGo – Game Hub";
 scrollTo(0,keep?y:0);}
document.addEventListener("click",e=>{const f=e.target.closest("[data-fav]"),c=e.target.closest("[data-cat]");
 if(f){e.preventDefault();toggleFav(f.dataset.fav)}
 else if(c){st.cat=c.dataset.cat;route(true)}
 else if(e.target.id==="reset"){st.q=st.cat="";$("#q").value="";route(true)}});
document.addEventListener("change",e=>{if(e.target.id==="sort"){st.sort=e.target.value;fill()}});
$("#q").addEventListener("input",e=>{st.q=e.target.value;if(!location.hash.startsWith("#/explore"))location.hash="#/explore";else fill()});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();location.hash="#/explore"});
$("#burger").addEventListener("click",()=>{const o=$("#menu").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)});
addEventListener("hashchange",()=>route());route();
})();
