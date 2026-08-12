const reasons = [
  "네가 웃으면 나도 따라 웃게 돼서",
  "별것 아닌 내 이야기도 소중하게 들어줘서",
  "같이 아무것도 하지 않아도 편안해서",
  "좋은 순간마다 자연스럽게 네가 떠올라서",
  "너와 함께일 때의 내가 더 좋아져서",
];

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
