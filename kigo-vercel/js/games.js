/* ===== DAFTAR GAME KiGo — edit file ini untuk menambah game =====
 type: "apk" (unduh & pasang di Android) | "web" (dimainkan lewat iframe; isi url dengan alamat game)
 status: "Available" | "Coming Soon"   (Coming Soon tidak bisa dibuka)
 added: YYYY-MM-DD (untuk "Terbaru")   popularity: angka (untuk "Populer")
 thumbnail: path gambar; kosongkan jika belum ada (otomatis jadi placeholder) */
window.KIGO_CATEGORIES=["Action","Adventure","Horror","Puzzle","Racing","RPG","Strategy","Casual","Platformer"];
window.KIGO_GAMES=[
{id:"dihcipline",title:"DIHCIPLINE",featured:true,type:"apk",status:"Available",
 category:"Casual", // TODO: ganti dengan kategori asli DIHCIPLINE
 description:"Game Android pilihan di KiGo. Unduh APK-nya dan pasang langsung di perangkatmu.", // TODO: ganti dengan deskripsi asli
 controls:"", // TODO: isi petunjuk kontrol jika ada
 thumbnail:"assets/dihcipline-icon.png",url:"assets/dihcipline.apk",size:"8,7 MB",added:"2026-10-12",popularity:100},
{id:"slot-1",title:"Slot Game 1",type:"web",status:"Coming Soon",category:"Puzzle",description:"Slot kosong. Ganti dengan game web pertamamu.",thumbnail:"",url:"",added:"2026-10-01",popularity:10},
{id:"slot-2",title:"Slot Game 2",type:"web",status:"Coming Soon",category:"Racing",description:"Slot kosong. Isi url dengan alamat game yang boleh di-embed.",thumbnail:"",url:"",added:"2026-09-20",popularity:5},
{id:"slot-3",title:"Slot Game 3",type:"web",status:"Coming Soon",category:"Platformer",description:"Slot kosong untuk game berikutnya.",thumbnail:"",url:"",added:"2026-09-10",popularity:1}
];
