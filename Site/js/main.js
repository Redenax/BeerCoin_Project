document.addEventListener("DOMContentLoaded", function() {
  const sliderImages = document.querySelectorAll(".main img");
  let translateValue = 0;
  let currentIndex = 0;

  function translateImages() {
    sliderImages.forEach((image, index) => {
      image.classList.remove("active", "next");
    });
    // Passa all'immagine successiva
    currentIndex = (currentIndex + 1) % sliderImages.length;

    sliderImages[currentIndex].classList.add("active");
    sliderImages[(currentIndex + 1) % sliderImages.length].classList.add("next"); // Aggiungi la classe "next" all'immagine successiva
  }
  translateImages();

  setInterval(translateImages, 4000)
});

$(document).ready(function () {
  // Carica il contenuto da un file esterno nel contenitore "contenuto"
  $("#bar").load("../html/bar.html");
  $("#footer").load("../html/footer.html")
});
