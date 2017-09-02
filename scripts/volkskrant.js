setTimeout(() => {
    const article = document.querySelector(".article__content");

    if (!article) {
        return;
    }

    const text = article.textContent
        .split(/\n/)
        .map((l) => l.trim())
        .filter((l) => l !== '')
        .join('. ');

    const words = text
        .split(/(\b[^\s]+\b)/)
        .map((w) => w.trim())
        .filter((w) => ['', '.', "'", ','].indexOf(w) === -1);

    $(".article__meta--v2").append(`— <span>${words.length} woorden</span>`);
}, 3000);