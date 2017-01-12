
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById('modal');

  const body = document.getElementsByTagName("body")[0];

  const openModal = document.getElementById("open-modal");

  const closeModal = document.getElementById("close-modal");

  openModal.onclick = function() {
    body.style.background = "gray";
  };
  
  closeModal.onclick = function() {
    if (event.target !== openModal) {
      body.style.background = "white";
      modal.style.display = "none";
    }
  };
});
