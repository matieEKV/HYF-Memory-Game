const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal-container");
const buttons = document.querySelector(".actions");

// ===== GET USER NAME =====
// 🔴 [blocking] `name` changes type from HTMLElement to string. This can be confusing. A cleaner pattern:
//   const input = document.querySelector("#user-name");
//   return input.value ? input.value.trim() : "Player";
function getUserName() {
  let name = document.querySelector("#user-name");
  if (!name.value) {
    name = "Player";
    return name;
  }
  return name.value.trim();
}

// 🟡 [important] Using style.display directly sets inline styles, which override CSS classes
// and are harder to debug. Consider toggling a CSS class like .hidden instead
function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function openModal(open, close, isGameWon = false) {
  modal.style.display = "block";
  overlay.style.display = "block";
  open.classList.remove("hidden");
  close.classList.add("hidden");
  if (isGameWon) {
    buttons.style.zIndex = "20";
  } else {
    buttons.style.zIndex = "1";
  }
}

function createMessageEl(name, time, turns) {
  const message1 = document.querySelector(".message1");
  const message2 = document.querySelector(".message2");

  message1.textContent = `Congratulations ${name}!`;
  // 🟢 [nit] There's a trailing space at the end of this template string ↓
  message2.textContent = `You finished the game with ${turns} turns in ${time} `;
}

export { openModal, createMessageEl, closeModal, getUserName };
