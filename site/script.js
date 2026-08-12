const reasons = [
  "네가 웃으면 나도 따라 웃게 돼서",
  "별것 아닌 내 이야기도 소중하게 들어줘서",
  "같이 아무것도 하지 않아도 편안해서",
  "좋은 순간마다 자연스럽게 네가 떠올라서",
  "너와 함께일 때의 내가 더 좋아져서",
];

const summerEvents = [
  { date:"7월 4일", place:"속초해수욕장", area:"강원특별자치도 · 속초", coords:[38.1904,128.6033], note:"밤바다에 나란히 비친 우리의 그림자. 여름의 첫 장면은 파도 소리와 함께 시작됐어.", photos:["01"] },
  { date:"7월 5일", place:"여주아울렛", area:"경기도 · 여주", coords:[37.2427,127.612], note:"많이 걷고, 함께 고르고, 맛있는 한 끼로 여행의 기억을 채운 날.", photos:["02"] },
  { date:"7월 10일", place:"치앙마이 방콕", area:"대전광역시", coords:[36.3504,127.3845], note:"대숲 사이를 걷고 이국적인 음식을 나눴던 날. 대전에 있으면서도 잠시 여행을 온 것 같았어.", photos:["03","04"] },
  { date:"7월 11일", place:"파주 지혜의 숲", area:"경기도 · 파주", coords:[37.7089,126.6874], note:"긴 책장 앞에서 잠시 멈춘 너. 네가 바라보는 풍경까지 기억하고 싶었던 하루.", photos:["05"] },
  { date:"7월 18일", place:"성동구 데이트 → 답십리", area:"서울 · 성동구 · 동대문구", coords:[37.5649,127.0448], note:"차분한 식사와 장난스러운 셀카, 나란히 흙을 만진 뒤 답십리에서 마지막 추억까지 남긴 하루.", photos:["07","06","08","09"] },
  { date:"7월 19일", place:"답십리에서의 마지막 추억", area:"서울 · 동대문구", coords:[37.5666,127.0526], note:"다음 날에도 가까이 붙어 남긴 우리. 익숙한 동네의 마지막까지 함께여서 좋았어.", photos:["10"] },
  { date:"7월 24일", place:"용강동 → 마포 한강", area:"서울 · 마포구", coords:[37.5411,126.9387], note:"마주 앉아 저녁을 먹고 한강의 불빛과 둥근 달을 함께 바라본 밤. 하루의 끝까지 작은 기념일 같았어.", photos:["11","12"] },
  { date:"7월 25일", place:"마포구 우리집 → 신촌(이대, 연대)", area:"서울 · 마포구 · 서대문구", coords:[37.5579,126.9262], note:"우리집에서 과일과 커피로 시작해 따뜻한 찌개를 먹고, 신촌의 골목과 밤공기까지 함께 나눈 하루.", photos:["13","14","15","16"] },
  { date:"7월 26일", place:"고양", area:"경기도 · 고양", coords:[37.6584,126.832], note:"거울 속에 포개진 우리. 어디에서든 자연스럽게 서로의 곁을 찾게 돼.", photos:["17"] },
  { date:"8월 9일", place:"제주", area:"제주특별자치도", coords:[33.4996,126.5312], note:"멀리 제주까지 이어진 우리의 여름. 네가 건넨 작은 하트로 이 여행의 마지막 장을 남겼어.", photos:["18"] },
];

let selectedEvent = 0;
let selectedPhoto = 0;
let swipeStartX = null;
const map = L.map(document.querySelector(".memory-map"), { scrollWheelZoom:false, zoomControl:false, minZoom:5 }).setView([36.3,127.7],6);
L.control.zoom({position:"bottomright"}).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
L.polyline(summerEvents.map(event=>event.coords),{color:"#a94555",weight:2,opacity:.62,dashArray:"7 10"}).addTo(map);
const eventBounds=L.latLngBounds(summerEvents.map(event=>event.coords));
const markers=summerEvents.map((event,index)=>{
  const marker=L.marker(event.coords,{title:`${event.date} ${event.place}`,alt:`${event.date} ${event.place} 추억 보기`,icon:L.divIcon({className:"photo-pin-shell",html:`<div class="map-pin${index===0?" active":""}"><img src="./assets/map/${event.photos[0]}.jpeg" alt=""><span>${String(index+1).padStart(2,"0")}</span></div>`,iconSize:[58,68],iconAnchor:[29,62]})}).addTo(map);
  marker.on("click",()=>selectEvent(index));
  return marker;
});
map.fitBounds(eventBounds,{padding:[40,40]});

const rail=document.querySelector(".event-rail");
summerEvents.forEach((event,index)=>{
  const button=document.createElement("button");
  button.type="button"; button.innerHTML=`<span>${String(index+1).padStart(2,"0")}</span><strong>${event.date}</strong><small>${event.place}</small>`;
  button.setAttribute("aria-pressed",index===0?"true":"false"); if(index===0) button.classList.add("active");
  button.addEventListener("click",()=>selectEvent(index)); rail.appendChild(button);
});

function selectEvent(index){
  selectedEvent=index; selectedPhoto=0; const event=summerEvents[index];
  rail.querySelectorAll("button").forEach((button,i)=>{button.classList.toggle("active",i===index);button.setAttribute("aria-pressed",i===index?"true":"false")});
  markers.forEach((marker,i)=>marker.getElement()?.querySelector(".map-pin")?.classList.toggle("active",i===index));
  map.flyTo(event.coords,index===9?8:10,{duration:1.1});
  renderEventPhoto();
  document.querySelector(".event-number").textContent=`MEMORY ${String(index+1).padStart(2,"0")} / ${summerEvents.length}`;
  document.querySelector(".event-date").textContent=event.date; document.querySelector(".event-copy h3").textContent=event.place;
  document.querySelector(".event-area").textContent=`⌖ ${event.area}`; document.querySelector(".event-note").textContent=event.note;
  document.querySelector(".event-detail").animate([{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}],{duration:420,easing:"ease"});
}
function renderEventPhoto(){
  const event=summerEvents[selectedEvent]; const photo=event.photos[selectedPhoto]; const gallery=document.querySelector(".event-gallery");
  const controls=event.photos.length>1?`<button class="slider-arrow slider-prev" type="button" aria-label="이전 사진">‹</button><button class="slider-arrow slider-next" type="button" aria-label="다음 사진">›</button><div class="slider-dots" aria-label="사진 선택">${event.photos.map((_,i)=>`<button type="button" class="${i===selectedPhoto?"active":""}" aria-label="${i+1}번 사진" aria-pressed="${i===selectedPhoto}"></button>`).join("")}</div><span class="photo-count">${selectedPhoto+1} / ${event.photos.length}</span>`:"";
  gallery.className="event-gallery slider"; gallery.innerHTML=`<div class="event-photo-frame" style="background-image:url('./assets/map/${photo}.jpeg')"><img src="./assets/map/${photo}.jpeg" alt="${event.place}에서 남긴 추억 사진"></div>${controls}`;
  gallery.querySelector(".slider-prev")?.addEventListener("click",()=>{selectedPhoto=(selectedPhoto-1+event.photos.length)%event.photos.length;renderEventPhoto()});
  gallery.querySelector(".slider-next")?.addEventListener("click",()=>{selectedPhoto=(selectedPhoto+1)%event.photos.length;renderEventPhoto()});
  gallery.querySelectorAll(".slider-dots button").forEach((button,i)=>button.addEventListener("click",()=>{selectedPhoto=i;renderEventPhoto()}));
  gallery.addEventListener("touchstart",touchEvent=>{swipeStartX=touchEvent.touches[0].clientX},{passive:true});
  gallery.addEventListener("touchend",touchEvent=>{
    if(swipeStartX===null||event.photos.length<2) return;
    const distance=touchEvent.changedTouches[0].clientX-swipeStartX; swipeStartX=null;
    if(Math.abs(distance)<45) return;
    selectedPhoto=distance<0?(selectedPhoto+1)%event.photos.length:(selectedPhoto-1+event.photos.length)%event.photos.length;
    renderEventPhoto();
  },{passive:true});
}
selectEvent(0); map.fitBounds(eventBounds,{padding:[40,40]});
document.querySelector(".map-reset").addEventListener("click",()=>map.fitBounds(eventBounds,{padding:[40,40]}));
document.querySelector(".event-next").addEventListener("click",()=>selectEvent((selectedEvent+1)%summerEvents.length));

let reasonIndex = 0;
const cover = document.querySelector(".cover");
const story = document.querySelector(".story");

document.querySelector(".start-button").addEventListener("click", () => {
  cover.classList.add("cover-open");
  story.classList.add("story-visible");
  document.body.classList.remove("locked");
  window.setTimeout(() => story.scrollIntoView({ behavior: "smooth" }), 500);
});

document.querySelector(".reason-button").addEventListener("click", () => {
  reasonIndex = (reasonIndex + 1) % reasons.length;
  document.querySelector(".reason-number").textContent = `REASON ${String(reasonIndex + 1).padStart(2, "0")}`;
  document.querySelector(".reason-text").textContent = `“${reasons[reasonIndex]}”`;
});

document.querySelector(".promise-button").addEventListener("click", () => {
  document.querySelector(".question").hidden = true;
  document.querySelector(".promise-message").hidden = false;
  document.querySelector(".final-section").classList.add("promised");
});
