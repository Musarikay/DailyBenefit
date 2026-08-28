let data=null,entries=[],index=0;
const $=id=>document.getElementById(id);
async function load(){
 try{
  const r=await fetch("data/divine_benefit_2026.json"); if(!r.ok) throw Error("HTTP "+r.status);
  data=await r.json(); entries=data.entries||[]; if(!entries.length) throw Error("No entries");
  $("title").textContent=data.title||"DIVINE BENEFIT"; $("subtitle").textContent=data.subtitle||"Daily Devotional Guide";
  $("footer").textContent=(data.title||"Divine Benefit")+" • "+(data.period||"Daily Devotional Guide");
  fillDates(); render();
 }catch(e){console.error(e);$("error").textContent="Could not load devotional data. Run this project through a local web server (see README).";$("error").classList.remove("hidden");$("app").classList.add("hidden")}
}
function dateText(s){let d=new Date(s+"T00:00:00");return isNaN(d)?s:new Intl.DateTimeFormat("en-NG",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(d)}
function fillDates(){let s=$("dates");s.innerHTML="";entries.forEach((e,i)=>{let o=document.createElement("option");o.value=i;o.textContent=dateText(e.date);s.appendChild(o)})}
function render(){let e=entries[index],v=e.memory_verse||{};$("number").textContent="Daily Benefit "+(e.number??"");$("date").textContent=dateText(e.date);$("theme").textContent=e.theme||"";$("ref").textContent=v.reference||"";$("verse").textContent=v.text||"";$("benefits").innerHTML="";(e.divine_benefits||[]).forEach(x=>{let li=document.createElement("li");li.textContent=x;$("benefits").appendChild(li)});$("condition").textContent=e.condition||"";$("prayer").textContent=e.prayer||"";$("prophetic").textContent=e.prophetic_words||"";$("study").textContent=e.daily_bible_study||"";$("prev").disabled=index===0;$("next").disabled=index===entries.length-1;$("dates").value=index}
function go(i){if(i>=0&&i<entries.length){index=i;render();scrollTo({top:0,behavior:"smooth"})}}
$("prev").onclick=()=>go(index-1);$("next").onclick=()=>go(index+1);$("dates").onchange=e=>go(Number(e.target.value));
$("search").oninput=e=>{let q=e.target.value.trim().toLowerCase(),box=$("results");if(!q){box.classList.add("hidden");return}let m=entries.map((x,i)=>({x,i})).filter(o=>JSON.stringify(o.x).toLowerCase().includes(q)).slice(0,15);box.innerHTML=m.length?m.map(o=>`<button class="result" data-i="${o.i}"><b>${esc(o.x.theme||"Untitled")}</b><small>${esc(dateText(o.x.date))}</small></button>`).join(""):`<div class="result">No devotionals found.</div>`;box.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{go(Number(b.dataset.i));$("search").value="";box.classList.add("hidden")});box.classList.remove("hidden")};
function esc(x){return String(x).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
$("theme").onclick=()=>{document.body.classList.toggle("dark");$("theme").textContent=document.body.classList.contains("dark")?"☀":"☾"};load();
