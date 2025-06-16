// Efeito de hover nos cards
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.querySelector(".service-header").style.background =
      "linear-gradient(135deg, #3B82F6 0%, #3B82F6 100%)";
  });
  card.addEventListener("mouseleave", function () {
    this.querySelector(".service-header").style.background =
      "linear-gradient(135deg, #3B82F6 0%, #EC4899 100%)";
  });
});
