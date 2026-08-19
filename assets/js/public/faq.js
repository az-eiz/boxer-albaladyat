(function initFaq() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach(other => {
                other.classList.remove("active");

                const otherAnswer = other.querySelector(".faq-answer");
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            if (!isOpen) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + 40 + "px";
            }
        });

        if (item.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + 40 + "px";
        }
    });
})();
