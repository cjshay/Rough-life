document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById('modal');

  const canvas = document.getElementsByClassName('canvas')[0];

  const body = document.getElementsByTagName("body")[0];

  const openModal = document.getElementById("open-modal");

  const closeModal = document.getElementById("close-modal");

  openModal.onclick = function() {
    body.style.background = "gray";
    canvas.style.background = "gray";
    modal.style.display = "block";
  };

  closeModal.onclick = function() {
    if (event.target !== openModal) {
      body.style.background = "black";
      canvas.style.background = "black";

      modal.style.display = "none";
    }
  };
});
