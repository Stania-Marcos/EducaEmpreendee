// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Carousel functionality
const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".carousel-indicator");
let currentSlide = 0;

function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("bg-white"));

  // Show the selected slide
  slides[index].classList.add("active");
  indicators[index].classList.add("bg-white");
  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prev);
}

// Auto-advance carousel every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const carousel = document.querySelector(".relative.h-full.w-full");
carousel.addEventListener("mouseenter", () => clearInterval(slideInterval));
carousel.addEventListener("mouseleave", () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
});

// Manual controls
document.getElementById("carousel-next").addEventListener("click", () => {
  clearInterval(slideInterval);
  nextSlide();
  slideInterval = setInterval(nextSlide, 5000);
});

document.getElementById("carousel-prev").addEventListener("click", () => {
  clearInterval(slideInterval);
  prevSlide();
  slideInterval = setInterval(nextSlide, 5000);
});

// Indicator controls
indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    clearInterval(slideInterval);
    showSlide(index);
    slideInterval = setInterval(nextSlide, 5000);
  });
});

// Initialize carousel
showSlide(0);

// Back to top button
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.remove("opacity-0", "invisible");
    backToTopButton.classList.add("opacity-100", "visible");
  } else {
    backToTopButton.classList.remove("opacity-100", "visible");
    backToTopButton.classList.add("opacity-0", "invisible");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});
