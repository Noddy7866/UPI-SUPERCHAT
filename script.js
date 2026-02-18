const DEFAULT_UPI="noddyk782@okicici";
const DEFAULT_GOAL=10000;
const ADMIN_PASS="notnoddylive@1989";
let selectedAmount=0;

function getSettings(){
const s=JSON.parse(localStorage.getItem("adminSettings")||"{}");
return {upi:s.upi||DEFAULT_UPI,goal:Number(s.goal)||DEFAULT_GOAL};
}

function updateEmojiReaction(a){
let d=document.getElementById("emojiReaction");
if(!d){
const c=document.getElementById("customAmount");
if(!c)return;
d=document.createElement("div");
d.id="emojiReaction";
d.style.cssText="display:flex;justify-content:center;gap:15px;margin-bottom:15px;font-size:30px;";
["🙂","😃","🥰","🤩"].forEach(e=>{
const s=document.createElement("span");
s.innerText=e;
s.style.cssText="opacity:0.3;transition:all 0.2s;filter:grayscale(100%);cursor:default;";
s.dataset.emoji=e;
d.appendChild(s);
});
c.parentNode.insertBefore(d,c);
}
const v=Number(a);
let active="";
if(v>=500)active="🤩";else if(v>=100)active="🥰";else if(v>=50)active="😃";else if(v>=10)active="🙂";
Array.from(d.children).forEach(s=>{
const isActive=s.dataset.emoji===active;
s.style.opacity=isActive?"1":"0.3";
s.style.transform=isActive?"scale(1.4)":"scale(1)";
s.style.filter=isActive?"grayscale(0%)":"grayscale(100%)";
});
}

function selectAmount(a){
selectedAmount=a;
document.getElementById("customAmount").value=a;
updateEmojiReaction(a);
}

function isMobile(){
return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function donate(){
const amount=Number(document.getElementById("customAmount").value||selectedAmount);
const name=document.getElementById("name").value||"Supporter";
const message=document.getElementById("message").value||"";

if(!amount){alert("Enter amount");return;}

let history=JSON.parse(localStorage.getItem("superchat")||"[]");
history.unshift({name,amount,message,time:new Date().toLocaleString()});
localStorage.setItem("superchat",JSON.stringify(history.slice(0,50)));

renderAll();

if(isMobile()){
window.location.href=`upi://pay?pa=${getSettings().upi}&pn=NotNoddyLive&am=${amount}&tn=${encodeURIComponent(name+" : "+message)}`;
}else{
generateQR(amount,name,message);
document.getElementById("qrModal").style.display="flex";
}
}

function generateQR(amount,name,message){
const data=`upi://pay?pa=${getSettings().upi}&pn=NotNoddyLive&am=${amount}&tn=${encodeURIComponent(name+" : "+message)}`;
document.getElementById("qrImage").src=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
document.getElementById("qrAmount").innerText=`Super Chat Amount: ₹${amount}`;
}

function renderAll(){
const history=JSON.parse(localStorage.getItem("superchat")||"[]");
renderHistory(history);
renderGoal(history);
renderLeaderboard(history);
}

function renderHistory(h){
const ul=document.getElementById("history");
ul.innerHTML="";
h.slice(0,10).forEach(d=>{
const li=document.createElement("li");
li.textContent=`₹${d.amount} - ${d.name} (${d.time})`;
ul.appendChild(li);
});
}

function renderGoal(h){
const goal=getSettings().goal;
let total=0;
h.forEach(d=>total+=d.amount);
const percent=Math.min((total/goal)*100,100);
document.getElementById("progressBar").style.width=percent+"%";
document.getElementById("goalText").innerText=`Raised ₹${total} / ₹${goal}`;
}

function renderLeaderboard(h){
const totals={};
h.forEach(d=>{
totals[d.name]=(totals[d.name]||0)+d.amount;
});
const sorted=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,5);
const ul=document.getElementById("leaderboard");
ul.innerHTML="";
sorted.forEach(([name,amount])=>{
const li=document.createElement("li");
li.textContent=`${name} - ₹${amount}`;
ul.appendChild(li);
});
}

function closeQR(){
document.getElementById("qrModal").style.display="none";
}

function showAdminLogin(){
document.getElementById("adminLoginModal").style.display="flex";
}

function closeAdminLogin(){
document.getElementById("adminLoginModal").style.display="none";
}

function adminLogin(){
const p=document.getElementById("adminPassword").value;
if(p===ADMIN_PASS){
closeAdminLogin();
showAdminPanel();
}else{
alert("Incorrect Password");
}
}

function showAdminPanel(){
document.getElementById("adminPanelModal").style.display="flex";
document.getElementById("newGoal").value=getSettings().goal;
document.getElementById("newUPI").value=getSettings().upi;
}

function closeAdminPanel(){
document.getElementById("adminPanelModal").style.display="none";
}

function updateGoal(){
const g=document.getElementById("newGoal").value;
if(g){
const s=JSON.parse(localStorage.getItem("adminSettings")||"{}");
s.goal=g;
localStorage.setItem("adminSettings",JSON.stringify(s));
alert("Goal Updated");
renderAll();
}
}

function updateSettings(){
const u=document.getElementById("newUPI").value;
if(u){
const s=JSON.parse(localStorage.getItem("adminSettings")||"{}");
s.upi=u;
localStorage.setItem("adminSettings",JSON.stringify(s));
alert("Settings Updated");
}
}

function clearHistory(){
if(confirm("Are you sure you want to delete all history?")){
localStorage.removeItem("superchat");
renderAll();
alert("History Cleared");
}
}

function setupOBSListener(){
window.addEventListener("storage",e=>{
if(e.key==="superchat"){
const n=JSON.parse(e.newValue||"[]");
const o=JSON.parse(e.oldValue||"[]");
if(n.length>0&&(o.length===0||n[0].time!==o[0].time)){
showOBSPopup(n[0]);
}
}
});
}

function showOBSPopup(d){
if(!document.getElementById("obsStyles")){
const s=document.createElement("style");
s.id="obsStyles";
s.innerHTML=`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap');
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
@keyframes ring{0%{transform:rotate(0)}10%{transform:rotate(30deg)}20%{transform:rotate(-28deg)}30%{transform:rotate(34deg)}40%{transform:rotate(-32deg)}50%{transform:rotate(30deg)}60%{transform:rotate(-28deg)}70%{transform:rotate(34deg)}80%{transform:rotate(-32deg)}90%{transform:rotate(30deg)}100%{transform:rotate(0)}}
.obs-popup-container{font-family:'Poppins',sans-serif;position:fixed;top:40px;right:40px;background:rgba(20,20,20,0.95);border:2px solid #ffd700;border-radius:20px;padding:25px;color:white;min-width:350px;box-shadow:0 0 20px rgba(255,215,0,0.3),0 10px 30px rgba(0,0,0,0.5);text-align:center;z-index:99999;animation:slideIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards}
.obs-popup-exit{animation:slideOut 0.6s cubic-bezier(0.6,-0.28,0.735,0.045) forwards}
.obs-bell{font-size:48px;display:inline-block;animation:ring 2s infinite;margin-bottom:10px}
.obs-title{font-size:18px;text-transform:uppercase;letter-spacing:2px;color:#ccc;margin-bottom:5px}
.obs-amount{font-size:42px;font-weight:800;color:#ffd700;text-shadow:0 2px 10px rgba(255,215,0,0.3);margin:5px 0;animation:pulse 2s infinite}
.obs-name{font-size:22px;font-weight:700;color:#fff}
.obs-message{font-size:16px;color:#ddd;margin-top:8px;font-style:italic;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px}`;
document.head.appendChild(s);
}
const existing=document.getElementById("obsPopup");
if(existing)existing.remove();
const p=document.createElement("div");
p.id="obsPopup";
p.className="obs-popup-container";
document.body.appendChild(p);
p.innerHTML=`<div class="obs-bell">🔔</div><div class="obs-title">New Donation</div><div class="obs-amount">₹${d.amount}</div><div class="obs-name">${d.name}</div>${d.message?`<div class="obs-message">"${d.message}"</div>`:""}`;
setTimeout(()=>{
const el=document.getElementById("obsPopup");
if(el){
el.classList.add("obs-popup-exit");
el.addEventListener("animationend",()=>el.remove());
}
},6000);
}

document.addEventListener("keydown",e=>{
if(e.key.toLowerCase()==="a") showAdminLogin();
});

document.addEventListener("DOMContentLoaded",()=>{
renderAll();
setupOBSListener();
const c=document.getElementById("customAmount");
if(c)c.addEventListener("input",e=>updateEmojiReaction(e.target.value));

if(new URLSearchParams(window.location.search).has("obs")){
const s=document.createElement("style");
s.innerHTML="body{background:transparent!important;} body > *:not(#obsPopup){display:none!important;}";
document.head.appendChild(s);
}
});

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBYJjA1odf4SJ1gDAZ3BmaoPSNGCZ-WDN0",
    authDomain: "notnoddylive.firebaseapp.com",
    projectId: "notnoddylive",
    storageBucket: "notnoddylive.firebasestorage.app",
    messagingSenderId: "225327606826",
    appId: "1:225327606826:web:8a85fe76ef58dd063c2753",
    measurementId: "G-TP5E17SR9S"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
