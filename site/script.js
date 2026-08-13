const reasons = [
  "녕주가 웃으면 나도 따라 웃게 돼서",
  "별것 아닌 내 이야기도 소중하게 들어줘서",
  "같이 아무것도 하지 않아도 편안해서",
  "좋은 일이 생기면 가장 먼저 녕주가 떠올라서",
  "녕주와 함께 있을 때의 내가 더 좋아져서",
];

const summerEvents = [
  { date:"7월 4일", place:"속초해수욕장", area:"강원특별자치도 · 속초", coords:[38.1904,128.6033], note:"깜깜한 바다 앞에서 한참 물을 바라봤던 날. 사진에는 그림자만 남았는데, 그날 녕주와 나눈 이야기는 아직도 선명해.", photos:["01"] },
  { date:"7월 5일", place:"여주아울렛", area:"경기도 · 여주", coords:[37.2427,127.612], note:"많이 걷고 이것저것 구경하다가 맛있는 것도 먹었던 날. 뭘 했는지는 평범한데, 녕주와 함께여서 하루 종일 즐거웠어.", photos:["02"] },
  { date:"7월 10일", place:"치앙마이 방콕", area:"대전광역시", coords:[36.3504,127.3845], note:"대나무 사이를 걷는 녕주 뒷모습이 좋아서 사진을 찍었어. 같이 먹은 음식도 맛있었지만, 이날은 이상하게 녕주 모습이 더 오래 기억나.", photos:["03-v2","04"] },
  { date:"7월 11일", place:"파주 지혜의 숲", area:"경기도 · 파주", coords:[37.7089,126.6874], note:"높은 책장 앞에서 책을 읽고 있는 녕주를 한참 바라봤던 날. 사진을 찍는 동안에는 말하지 않았지만, 그 모습이 참 예뻤어.", photos:["05"] },
  { date:"7월 18일", place:"성동구 데이트 → 답십리", area:"서울 · 성동구 · 동대문구", coords:[37.5649,127.0448], note:"맛있는 것도 먹고, 장난스러운 사진도 찍고, 같이 흙도 만졌던 날. 하루 동안 한 일이 많아서인지 녕주와 더 오래 함께 있었던 기분이 들었어.", photos:["07","06","08","09"] },
  { date:"7월 19일", place:"답십리에서의 마지막 추억", area:"서울 · 동대문구", coords:[37.5666,127.0526], note:"익숙했던 장소를 떠나기 전에 남긴 사진. 조금 아쉬웠지만 마지막 순간에도 녕주가 함께 있어서 다행이었어.", photos:["10"] },
  { date:"7월 24일", place:"용강동 → 마포 한강", area:"서울 · 마포구", coords:[37.5411,126.9387], note:"마주 앉아 저녁을 먹고 한강까지 걸었던 밤. 강 건너 불빛도 예뻤지만, 그날은 녕주와 나란히 걷는 시간이 더 좋았어.", photos:["11-v2","12"] },
  { date:"7월 25일", place:"마포구 우리집 → 신촌(이대, 연대)", area:"서울 · 마포구 · 서대문구", coords:[37.5579,126.9262], note:"집에서 과일을 먹고, 찌개도 끓여 먹고, 늦은 밤 신촌까지 걸었던 날. 별다른 계획 없이 함께 시간을 보내는 것도 이렇게 좋을 수 있다는 걸 알았어.", photos:["13","14","15","16"] },
  { date:"7월 26일", place:"고양", area:"경기도 · 고양", coords:[37.6584,126.832], note:"거울이 보이면 자연스럽게 같이 사진부터 찍게 되는 우리. 사진 속에서 꼭 붙어 있는 모습을 보니까 괜히 웃음이 나.", photos:["17"] },
  { date:"8월 9일", place:"제주", area:"제주특별자치도", coords:[33.4996,126.5312], note:"멀리 제주까지 이어진 우리 여름의 마지막 사진. 녕주가 만들어 준 작은 하트 안에 우리가 함께한 여름이 다 들어 있는 것 같아.", photos:["18"] },
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
