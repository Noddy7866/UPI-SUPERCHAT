const UPI_ID="noddyk782@okicici";
const MONTHLY_GOAL=10000;
let selectedAmount=0;

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
window.location.href=`upi://pay?pa=${UPI_ID}&pn=NotNoddyLive&am=${amount}&tn=${encodeURIComponent(name+" : "+message)}`;
}else{
generateQR(amount,name,message);
document.getElementById("qrModal").style.display="flex";
}
}

function generateQR(amount,name,message){
const data=`upi://pay?pa=${UPI_ID}&pn=NotNoddyLive&am=${amount}&tn=${encodeURIComponent(name+" : "+message)}`;
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
let total=0;
h.forEach(d=>total+=d.amount);
const percent=Math.min((total/MONTHLY_GOAL)*100,100);
document.getElementById("progressBar").style.width=percent+"%";
document.getElementById("goalText").innerText=`Raised ₹${total} / ₹${MONTHLY_GOAL}`;
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

document.addEventListener("DOMContentLoaded",renderAll);
