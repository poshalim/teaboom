const initGallery = () => {
  const root = document.querySelector("[data-gallery]");
  const lightbox = document.getElementById("lightbox");
  if (!root || !lightbox) return;

  const thumbs = [...root.querySelectorAll(".gallery__thumb")];
  const photo = root.querySelector(".gallery__photo");
  const lightboxPhoto = lightbox.querySelector("[data-lightbox-photo]");
  const count = lightbox.querySelector("[data-lightbox-count]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const stage = root.querySelector(".gallery__stage");
  let index = 0;
  let startX = 0;

  const isOpen = () => !lightbox.hidden;

  const show = (next) => {
    index = (next + thumbs.length) % thumbs.length;
    const thumb = thumbs[index];

    photo.src = thumb.dataset.src;
    photo.alt = thumb.dataset.alt;
    lightboxPhoto.src = thumb.dataset.src;
    lightboxPhoto.alt = thumb.dataset.alt;
    count.textContent = `${index + 1} из ${thumbs.length}`;

    thumbs.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    if (!isOpen()) {
      thumb.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };

  const step = (delta) => show(index + delta);

  const openLightbox = () => {
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
  };

  root.querySelector("[data-gallery-prev]").addEventListener("click", () => step(-1));
  root.querySelector("[data-gallery-next]").addEventListener("click", () => step(1));

  thumbs.forEach((thumb, thumbIndex) => {
    thumb.addEventListener("click", () => show(thumbIndex));
  });

  root.querySelector("[data-gallery-open]").addEventListener("click", openLightbox);
  closeButton.addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => step(-1));
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => step(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  });

  stage.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) < 40) return;
    step(delta < 0 ? 1 : -1);
  }, { passive: true });

  show(0);
};

initGallery();
