/**
 * Modern Portfolio Application
 * A clean, accessible, and performant portfolio implementation
 */

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initNavigation();
    this.initTabs();
    this.initScrollSpy();
    this.initSmoothScrolling();
    this.initIntersectionObserver();
    this.initForm();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Mobile navigation toggle
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");

    if (navToggle && sidebar) {
      navToggle.addEventListener("click", () => this.toggleMobileNav());

      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (
          window.innerWidth <= 768 &&
          !sidebar.contains(e.target) &&
          !navToggle.contains(e.target) &&
          sidebar.classList.contains("open")
        ) {
          this.closeMobileNav();
        }
      });
    }

    // Handle window resize
    window.addEventListener(
      "resize",
      this.debounce(() => {
        if (window.innerWidth > 768) {
          this.closeMobileNav();
        }
      }, 150)
    );

    // Handle escape key for mobile nav
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar?.classList.contains("open")) {
        this.closeMobileNav();
        navToggle?.focus();
      }
    });
  }

  /**
   * Initialize navigation functionality
   */
  initNavigation() {
    const navLinks = document.querySelectorAll(
      ".sidebar__nav-link, .header__nav-link"
    );

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          this.scrollToSection(targetSection);
          this.updateActiveNavigation(targetId);

          // Close mobile nav if open
          if (window.innerWidth <= 768) {
            this.closeMobileNav();
          }
        }
      });
    });
  }

  /**
   * Initialize tab functionality
   */
  initTabs() {
    const tabButtons = document.querySelectorAll(".tabs__button");
    const tabContents = document.querySelectorAll(".tabs__content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked button and corresponding content
        button.classList.add("active");
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });
  }

  /**
   * Initialize scroll spy for active navigation highlighting
   */
  initScrollSpy() {
    const sections = document.querySelectorAll(".section[id]");
    const navLinks = document.querySelectorAll(
      ".sidebar__nav-link[data-section]"
    );

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.updateActiveNavigation(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  /**
   * Initialize smooth scrolling behavior
   */
  initSmoothScrolling() {
    // Already handled by CSS scroll-behavior, but can be enhanced here if needed
  }

  /**
   * Initialize intersection observer for animations
   */
  initIntersectionObserver() {
    const animatedElements = document.querySelectorAll(
      ".card, .timeline-item, .skill-category"
    );

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Set initial state for animation
    animatedElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(element);
    });
  }

  /**
   * Initialize contact form
   */
  initForm() {
    const form = document.getElementById("contactForm");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });

      // Add real-time validation
      const inputs = form.querySelectorAll(".form-input, .form-textarea");
      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearFieldError(input));
      });
    }
  }

  /**
   * Toggle mobile navigation
   */
  toggleMobileNav() {
    const sidebar = document.getElementById("sidebar");
    const navToggle = document.getElementById("navToggle");

    if (sidebar) {
      const isOpen = sidebar.classList.toggle("open");

      // Update aria attributes for accessibility
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", isOpen.toString());
      }

      // Manage focus for accessibility
      if (isOpen) {
        const firstNavLink = sidebar.querySelector(".sidebar__nav-link");
        firstNavLink?.focus();
      }
    }
  }

  /**
   * Close mobile navigation
   */
  closeMobileNav() {
    const sidebar = document.getElementById("sidebar");
    const navToggle = document.getElementById("navToggle");

    if (sidebar) {
      sidebar.classList.remove("open");

      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(section) {
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
    const offset = section.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }

  /**
   * Update active navigation state
   */
  updateActiveNavigation(activeId) {
    const navLinks = document.querySelectorAll(".sidebar__nav-link");

    navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /**
   * Handle form submission
   */
  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const isValid = this.validateForm(form);

    if (isValid) {
      // Here you would typically send the data to a server
      console.log("Form data:", data);

      // For demo purposes, show success message
      this.showFormMessage(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );
      form.reset();
    } else {
      this.showFormMessage("Please correct the errors above.", "error");
    }
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const inputs = form.querySelectorAll(".form-input, .form-textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = "";

    // Remove existing error
    this.clearFieldError(field);

    // Required field validation
    if (!value) {
      errorMessage = `${this.capitalize(fieldName)} is required.`;
      isValid = false;
    } else if (fieldName === "email" && !this.isValidEmail(value)) {
      errorMessage = "Please enter a valid email address.";
      isValid = false;
    } else if (fieldName === "message" && value.length < 10) {
      errorMessage = "Message must be at least 10 characters long.";
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add("error");

    let errorElement = field.parentNode.querySelector(".field-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "field-error";
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.color = "var(--color-error-500)";
    errorElement.style.fontSize = "var(--text-sm)";
    errorElement.style.marginTop = "var(--space-1)";
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = field.parentNode.querySelector(".field-error");
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Show form message
   */
  showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    messageElement.style.padding = "var(--space-3)";
    messageElement.style.borderRadius = "var(--radius-base)";
    messageElement.style.marginBottom = "var(--space-4)";
    messageElement.style.backgroundColor =
      type === "success"
        ? "var(--color-success-500)"
        : "var(--color-error-500)";
    messageElement.style.color = "white";

    const form = document.getElementById("contactForm");
    form.insertBefore(messageElement, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }

  /**
   * Utility functions
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});

// Add some CSS for error states
const style = document.createElement("style");
style.textContent = `
    .form-input.error,
    .form-textarea.error {
        border-color: var(--color-error-500) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .field-error {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .form-message {
        animation: slideDown 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
