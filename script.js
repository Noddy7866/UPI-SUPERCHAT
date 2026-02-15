const DEFAULT_UPI="noddyk782@okicici";
const DEFAULT_GOAL=10000;
const ADMIN_PASS="admin123";
let selectedAmount=0;

function getSettings(){
const s=JSON.parse(localStorage.getItem("adminSettings")||"{}");
return {upi:s.upi||DEFAULT_UPI,goal:Number(s.goal)||DEFAULT_GOAL};
}

function selectAmount(a){
selectedAmount=a;
document.getElementById("customAmount").value=a;
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
history.unshift({name,amount,time:new Date().toLocaleString()});
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

document.addEventListener("keydown",e=>{
if(e.key.toLowerCase()==="a") showAdminLogin();
});

document.addEventListener("DOMContentLoaded",renderAll);
