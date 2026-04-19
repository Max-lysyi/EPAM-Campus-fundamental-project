export function initCarousel() {
    console.log('Карусель ініціалізовано: старий автоскрол видалено!');
    // Знаходимо наші елементи (увага на __grid з двома підкресленнями!)
    const container = document.querySelector('.travel-suitcases__grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    // Перевірка, чи всі елементи існують на сторінці
    if (!container || !prevBtn || !nextBtn) {
        console.error('Елементи каруселі не знайдені в HTML!');
        return;
    }
    // Логіка для кнопки "Вперед"
    nextBtn.addEventListener('click', () => {
        const firstCard = container.querySelector('.travel-suitcases__item');
        if (!firstCard)
            return;
        // Вираховуємо ширину кроку (ширина картки + відступ)
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollStep = firstCard.offsetWidth + gap;
        // Прокручуємо вправо
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
    // Логіка для кнопки "Назад"
    prevBtn.addEventListener('click', () => {
        const firstCard = container.querySelector('.travel-suitcases__item');
        if (!firstCard)
            return;
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollStep = firstCard.offsetWidth + gap;
        // Прокручуємо вліво (від'ємне значення)
        container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
}
