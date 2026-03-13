(function () {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(document.querySelectorAll(".slide"));
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (slides.length === 0 || !nextBtn || !prevBtn) return;

  let currentIndex = 0;

  function updateCarousel() {
    slides.forEach((slide) => slide.classList.remove("active"));

    const currentSlide = slides[currentIndex];
    if (!currentSlide) return;
    currentSlide.classList.add("active");

    const offset =
      currentSlide.offsetLeft -
      track.offsetWidth / 2 +
      currentSlide.offsetWidth / 2;

    track.style.transform = `translateX(-${offset}px)`;
  }

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 4000);

  updateCarousel();
})();

