const slides = Array.from(document.querySelectorAll(".top-slide"));
const current = document.querySelector("[data-gallery-current]");
let active = 0;

function showSlide(index) {
  if (!slides.length) return;
  active = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === active);
  });
  if (current) current.textContent = String(active + 1);
}

const previousButton = document.querySelector("[data-gallery-prev]");
const nextButton = document.querySelector("[data-gallery-next]");

if (previousButton) {
  previousButton.addEventListener("click", () => showSlide(active - 1));
}

if (nextButton) {
  nextButton.addEventListener("click", () => showSlide(active + 1));
}

if (slides.length > 1) {
  window.setInterval(() => showSlide(active + 1), 4500);
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav ? siteNav.classList.toggle("is-open") : false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (siteNav) {
  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));

if (galleryImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<button type="button">Close</button><img alt="">';
  document.body.append(lightbox);
  const lightboxImage = lightbox.querySelector("img");
  const close = lightbox.querySelector("button");

  galleryImages.forEach((image) => {
    image.addEventListener("click", () => {
      if (!lightboxImage) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
    });
  });

  if (close) {
    close.addEventListener("click", () => lightbox.classList.remove("is-open"));
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.classList.remove("is-open");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") lightbox.classList.remove("is-open");
  });
}

const intakeForm = document.querySelector("[data-intake-form]");
const portraitChoiceLinks = document.querySelectorAll("[data-portrait-choice]");

portraitChoiceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const choice = link.getAttribute("data-portrait-choice");
    const input = intakeForm
      ? intakeForm.querySelector(`input[name="portrait_type"][value="${choice}"]`)
      : null;
    if (input instanceof HTMLInputElement) input.checked = true;
  });
});

if (intakeForm instanceof HTMLFormElement) {
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!intakeForm.reportValidity()) return;

    const data = new FormData(intakeForm);
    const name = `${data.get("first_name") || ""} ${data.get("last_name") || ""}`.trim();
    const subject = `Watercolor portrait inquiry from ${name}`;
    const body = [
      `Hi Breanne,`,
      ``,
      `I'd love to ask about a custom watercolor portrait.`,
      ``,
      `Name: ${name}`,
      `Email: ${data.get("email") || ""}`,
      `Portrait style: ${data.get("portrait_type") || "Not sure yet"}`,
      `Preferred size: ${data.get("portrait_size") || "Not sure yet"}`,
      `Number of subjects: ${data.get("subjects") || "1 subject"}`,
      ``,
      `About the portrait:`,
      `${data.get("message") || ""}`,
      ``,
      `I'll attach any reference photos to this email.`,
    ].join("\n");

    window.location.href = `mailto:artistbreannecraig@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
