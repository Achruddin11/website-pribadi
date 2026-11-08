
/* =========================================
   ACHRUDDIN - PERSONAL PORTFOLIO
   Main JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ---------- 1. ELEMENT SELECTORS ----------

    const menuToggle = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const themeToggle = document.querySelector(".theme-toggle");
    const backToTop = document.querySelector("#back-to-top");

    const contactForm = document.querySelector("#contact-form");

    const notification = document.querySelector("#notification");
    const notificationMessage = document.querySelector("#notification-message");

    const currentYear = document.querySelector("#current-year");


    // ---------- 2. CURRENT YEAR ----------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ---------- 3. MOBILE NAVIGATION ----------

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu after clicking a navigation link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", event => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                navMenu.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }


    // ---------- 4. DARK / LIGHT MODE ----------

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem("portfolio-theme", theme);

        if (themeToggle) {
            themeToggle.innerHTML = theme === "dark"
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';

            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Aktifkan mode terang"
                    : "Aktifkan mode gelap"
            );
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
    } else {
        setTheme("light");
    }

    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme");

            setTheme(currentTheme === "dark" ? "light" : "dark");
        });
    }


    // ---------- 5. ACTIVE NAVIGATION ON SCROLL ----------

    const sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (
                link.getAttribute("href") === `#${currentSection}`
            ) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink);

    updateActiveLink();


    // ---------- 6. BACK TO TOP BUTTON ----------

    function handleBackToTop() {
        if (!backToTop) return;

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    }

    window.addEventListener("scroll", handleBackToTop);

    handleBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    
    // ---------- 7. SCROLL REVEAL ANIMATION ----------

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observerInstance.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.05
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("active");
        });

    }


    // ---------- 8. NOTIFICATION FUNCTION ----------

    let notificationTimer;

    function showNotification(message, type = "success") {

        if (!notification || !notificationMessage) {
            alert(message);
            return;
        }

        notificationMessage.textContent = message;

        notification.classList.remove("success", "error");
        notification.classList.add(type, "show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 4000);
    }


    // ---------- 9. CONTACT FORM VALIDATION ----------

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name = contactForm.querySelector(
                '[name="name"]'
            )?.value.trim();

            const email = contactForm.querySelector(
                '[name="email"]'
            )?.value.trim();

            const subject = contactForm.querySelector(
                '[name="subject"]'
            )?.value.trim();

            const message = contactForm.querySelector(
                '[name="message"]'
            )?.value.trim();


            // Check required fields
            if (!name || !email || !subject || !message) {
                showNotification(
                    "Mohon lengkapi semua kolom formulir.",
                    "error"
                );
                return;
            }


            // Validate email format
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showNotification(
                    "Format alamat email tidak valid.",
                    "error"
                );
                return;
            }


            // Prepare email content
            const recipient = "EMAIL_ANDA@example.com";

            const emailSubject = encodeURIComponent(subject);

            const emailBody = encodeURIComponent(
                `Nama: ${name}\n` +
                `Email: ${email}\n\n` +
                `Pesan:\n${message}`
            );

            const mailtoLink =
                `mailto:${recipient}` +
                `?subject=${emailSubject}` +
                `&body=${emailBody}`;


            // Open user's email application
            window.location.href = mailtoLink;

            showNotification(
                "Aplikasi email sedang dibuka. Silakan kirim pesan Anda.",
                "success"
            );

        });
    }


    // ---------- 10. SMOOTH SCROLL ----------

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    // ---------- 11. SKILL PROGRESS ANIMATION ----------

    const skillBars = document.querySelectorAll(".skill-progress");

    if ("IntersectionObserver" in window) {

        const skillObserver = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const bar = entry.target;

                        const progress =
                            bar.getAttribute("data-progress") ||
                            getComputedStyle(bar).getPropertyValue("--progress");

                        bar.style.width = progress || "0%";

                        observerInstance.unobserve(bar);
                    }

                });

            },
            {
                threshold: 0.5
            }
        );

        skillBars.forEach(bar => {
            const initialWidth = bar.style.width;

            bar.style.width = "0%";

            if (!bar.hasAttribute("data-progress") && initialWidth) {
                bar.setAttribute("data-progress", initialWidth);
            }

            skillObserver.observe(bar);
        });

    }


    // ---------- 12. CONSOLE MESSAGE ----------

    console.log(
        "%cWelcome to Achruddin's Portfolio!",
        "color: #6366f1; font-size: 18px; font-weight: bold;"
    );

    console.log(
        "Website successfully loaded."
    );

});
