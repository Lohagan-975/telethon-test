import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "tonprojet.firebaseapp.com",
  projectId: "tonprojet",
  storageBucket: "tonprojet.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const canvas = document.getElementById("place");
const ctx = canvas.getContext("2d");
const pixelSize = 10;
let username = prompt("Entre ton pseudo :");
let pixelsLeft = 0;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

canvas.addEventListener("click", async (e) => {
  if (pixelsLeft <= 0) return alert("Plus de pixels disponibles !");
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  drawPixel(x, y, color);
  pixelsLeft--;
  document.querySelector("#pixels-left span").textContent = pixelsLeft;
  await setDoc(doc(db, "pixels", `${x}_${y}`), { user: username, color, timestamp: Date.now() });
});

document.getElementById("sync").addEventListener("click", async () => {
  const user = await getDoc(doc(db, "users", username));
  if (user.exists()) {
    pixelsLeft = user.data().pixels;
    document.querySelector("#pixels-left span").textContent = pixelsLeft;
  } else {
    alert("Aucun don trouvé pour ce pseudo.");
  }

  const last = await getDoc(doc(db, "lastDon", "info"));
  if (last.exists()) {
    document.querySelector("#last-donor").textContent =
      `💖 Dernier donateur : ${last.data().name} (${last.data().amount} €)`;
  }
});