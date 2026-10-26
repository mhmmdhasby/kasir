// 1. Impor module yang diperlukan dari firebase dan firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import QRCode from "https://esm.sh/qrcode@1.5.3";

// 2. Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA6I1Tvw61wzc6-2MVmcWXfZ17IwDYj7u4",
    authDomain: "rpl25-b6db4.firebaseapp.com",
    projectId: "rpl25-b6db4",
    storageBucket: "rpl25-b6db4.firebasestorage.app",
    messagingSenderId: "643920833293",
    appId: "1:643920833293:web:f5ac7fdc746e4e410d5e44"
};

// 3. Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCollection = collection(db, "messages");

// Kondisi/State
let totalHarga = 0;
let trxIdSekarang = "";
let unsubscribeListener = null;

// Fungsi tambah item ke keranjang
window.tambahKeKeranjang = function(nama, harga) {
    totalHarga = totalHarga + harga;
    document.getElementById('total-harga').innerText = `Rp ${totalHarga}`;
    
    // Mengaktifkan tombol qr (memperbaiki .disable menjadi .disabled)
    document.getElementById('btn-bayar').disabled = false;
};

// Fungsi reset keranjang
window.resetKeranjang = function() {
    totalHarga = 0;
    document.getElementById('total-harga').innerText = 'Rp 0';
    document.getElementById('btn-bayar').disabled = true;
    document.getElementById('qr-section').classList.add("hidden");
    
    if (unsubscribeListener) {
        unsubscribeListener();
        unsubscribeListener = null;
    }
};

// Fungsi membuat ID transaksi QR
window.buatTransaksiQR = async function() {
    if (totalHarga === 0) return;
    
    // Buat ID transaksi unik
    trxIdSekarang = "TRX-" + Math.floor(1000 + Math.random() * 9000);
    
    // Tampilkan ID transaksi
    document.getElementById('tx-id-display').innerText = trxIdSekarang;
    document.getElementById('qr-section').classList.remove('hidden');
    
    // Reset tampilan status QR (memperbaiki documen -> document)
    const statusBox = document.getElementById('status-box');
    statusBox.className = "status-box status-pending";
    document.getElementById('status-teks').innerText = "Menunggu scan...";
    
    // Membuat QR terlihat
    document.getElementById('qr-canvas').style.opacity = 1;
    
    // Render QR code ke kanvas
    const elemenCanvas = document.getElementById('qr-canvas');
    try {
        await QRCode.toCanvas(elemenCanvas, trxIdSekarang, {
            width: 140,
            margin: 1
        });
    } catch (error) {
        console.log("Gagal membuat QR");
    }
    
    // Simpan dokumen transaksi ke Firestore
    const refTrx = doc(db, "transaksi", trxIdSekarang);
    try {
        await setDoc(refTrx, {
            total: totalHarga,
            status: 'takterbayar',
            waktuBuat: Date.now()
        });
        
        // Listener realtime untuk memantau status pembayaran
        if (unsubscribeListener) unsubscribeListener();
        unsubscribeListener = onSnapshot(refTrx, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.status === 'terbayar') {
                    statusBox.className = "status-box status-success";
                    document.getElementById('status-teks').innerText = "LUNAS";
                }
            }
        });
        
    } catch (error) {
        console.log("Gagal menyimpan transaksi ke firestore"); // Memperbaiki consol -> console
    }
    listenStatusPembayaran(trxIdSekarang)
}

// fungsi listener status pembayaran di firestore
function listenStatusPembayaran(trxId) {
    const refTrx = doc(db, "transaksi", tryId)
    
    const unsubscribeListener = onSnapshot(
        refTrx,
        (docSnapshot) => {
            
     if 
     (docSnapshot.exists() &&
     docSnapshot.data()
     ,status == 'terbayar') {
        // tampilan efek lunas
        document.getElementById(status-box). class.Name ="status-box status-succes"
        document.getElementById('status-teks').innerText = "LUNAS"
        document.getElementById('qr-canvas').style.opacity ="0.5"
        unsubscribeListener()
                }
            }
        )
    }