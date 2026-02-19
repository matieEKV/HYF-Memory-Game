const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal-container");
const buttons = document.querySelector(".actions");

// ===== GET USER NAME =====
function getUserName() {
  let name = document.querySelector("#user-name");
  if (!name.value) {
    name = "Player";
    return name;
  }
  return name.value.trim();
}

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
  message2.textContent = `You finished the game with ${turns} turns in ${time} `;
}

export { openModal, createMessageEl, closeModal, getUserName };
