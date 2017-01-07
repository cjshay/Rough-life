// Get the modal

document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById('modal');

  const body = document.getElementsByTagName("body")[0];
  // modal.style.display = "none";

  // Get the button that opens the modal
  const openModal = document.getElementById("open-modal");

  // Get the <span> element that closes the modal
  const closeModal = document.getElementById("close-modal");

  // When the user clicks on the button, open the modal
  openModal.onclick = function() {
    body.style.background = "gray";
    modal.style.display = "inline";
  };

  // When the user clicks on <span> (x), close the modal
  closeModal.onclick = function() {
    if (event.target !== openModal) {
      body.style.background = "white";
      modal.style.display = "none";
    }
  };

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function(event) {
  //     if (event.target == modal) {
  //         modal.style.display = "none";
  //     }
  // };
});
