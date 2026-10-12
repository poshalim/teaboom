const formatPrice = (value) => {
  const cents = Math.round(value * 100) % 100;
  const formatted = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(value);

  return `${formatted} ₽`;
};

const discountPercent = (price, oldPrice) => {
  if (!(oldPrice > price)) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

const initProduct = () => {
  const form = document.getElementById("product-form");
  if (!form) return;

  const skuNode = form.querySelector(".sku__value");
  const priceNode = form.querySelector(".price__current");
  const oldPriceNode = form.querySelector(".price__old");
  const discountLabel = form.querySelector(".price__off");
  const badge = document.querySelector(".product__badge");
  const badgeValue = badge?.querySelector("[data-badge-value]");
  const note = form.querySelector("[data-note]");
  const button = form.querySelector(".cart-btn");
  let resetTimer = 0;

  const selectedPack = () => form.querySelector('input[name="pack"]:checked');

  const render = () => {
    const pack = selectedPack();
    if (!pack) return;

    const price = Number(pack.dataset.price);
    const oldPrice = Number(pack.dataset.old);
    const discount = discountPercent(price, oldPrice);
    const onSale = discount > 0;
    const label = `−${discount}%`;

    form.querySelectorAll(".pack").forEach((item) => {
      item.classList.toggle("is-selected", item.contains(pack));
    });

    skuNode.textContent = pack.dataset.sku;
    priceNode.textContent = formatPrice(price);
    oldPriceNode.textContent = formatPrice(oldPrice);
    oldPriceNode.hidden = !onSale;
    discountLabel.textContent = label;
    discountLabel.hidden = !onSale;

    if (badge && badgeValue) {
      badgeValue.textContent = label;
      badge.hidden = !onSale;
    }
  };

  form.addEventListener("focusin", (event) => {
    if (event.target.name !== "pack") return;

    form.querySelectorAll(".pack").forEach((item) => {
      item.classList.toggle("is-focused", item.contains(event.target));
    });
  });

  form.addEventListener("focusout", () => {
    form.querySelectorAll(".pack").forEach((item) => {
      item.classList.remove("is-focused");
    });
  });

  form.addEventListener("change", (event) => {
    if (event.target.name !== "pack") return;

    render();
    if (note) note.hidden = true;
    button.classList.remove("is-added");
    window.clearTimeout(resetTimer);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const pack = selectedPack();
    if (!pack) return;

    button.classList.add("is-added");

    if (note) {
      note.hidden = false;
      note.textContent = `Ананасовый улун, ${pack.dataset.weight} — добавлено`;
      note.title = note.textContent;
    }

    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      button.classList.remove("is-added");
    }, 1600);
  });

  render();
};

const initScrollboxes = () => {
  document.querySelectorAll("[data-scrollbox]").forEach((box) => {
    const body = box.querySelector(".scrollbox__body");
    const more = box.querySelector(".scrollbox__more");
    if (!body) return;

    const update = () => {
      const overflow = body.scrollHeight - body.clientHeight > 4;
      const atEnd = body.scrollTop + body.clientHeight >= body.scrollHeight - 4;
      const canScroll = overflow && !atEnd;

      box.classList.toggle("is-overflow", canScroll);
      if (more) more.hidden = !canScroll;
    };

    body.addEventListener("scroll", update, { passive: true });

    more?.addEventListener("click", () => {
      body.scrollBy({ top: Math.max(56, body.clientHeight * 0.7), behavior: "smooth" });
    });

    update();
    window.addEventListener("resize", update);
  });
};

initProduct();
initScrollboxes();
