
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById('modal');

  const body = document.getElementsByTagName("body")[0];

  const openModal = document.getElementById("open-modal");

  const closeModal = document.getElementById("close-modal");

  openModal.onclick = function() {
    body.style.background = "black";
    modal.style.display = "block";
  };

  closeModal.onclick = function() {
    if (event.target !== openModal) {
      // body.style.backgroundimage = "url('images/conway-bg.jpeg')";
      // body.style.background = "transparent";
      // body.style.background = "whitesmoke";
      body.style.background = "black";
      modal.style.display = "none";
    }
  };
});
