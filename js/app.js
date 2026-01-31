var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next1",
    prevEl: ".swiper-button-prev1",
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.forms["submit-to-google-sheet"];
  const submitButton = form.querySelector(".contact-form-btn");
  const spinner = submitButton.querySelector(".spinner");
  const buttonText = submitButton.querySelector(".button-text");
  const nameInput = form.querySelector("#name");
  const phoneInput = form.querySelector("#phone");
  const companyInput = form.querySelector("#company");
  const nameError = form.querySelector("#name-error");
  const phoneError = form.querySelector("#phone-error");
  const companyError = form.querySelector("#company-error");
  const succes = document.querySelector("#succes");
  const error = document.querySelector("#error");

  const overlay = document.querySelector(".overlay");

  // Phone number formatting
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/[^\d]/g, "");

    // Ensure it starts with +998
    if (!value.startsWith("998")) {
      value = "998" + value;
    }

    // Limit to 12 digits (+998 and 9 digits)
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    // Format: +998 90 999 99 99
    let formatted = "+998";
    if (value.length > 3) {
      formatted += " " + value.slice(3, 5);
    }
    if (value.length > 5) {
      formatted += " " + value.slice(5, 8);
    }
    if (value.length > 8) {
      formatted += " " + value.slice(8, 10);
    }
    if (value.length > 10) {
      formatted += " " + value.slice(10, 12);
    }

    e.target.value = formatted;

    // Validate phone number
    const isValidPhone = /^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(formatted);
    phoneError.style.display =
      isValidPhone || formatted.length === 0 ? "none" : "block";
  });

  // Prevent non-numeric input for phone
  phoneInput.addEventListener("keypress", function (e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Real-time validation for name and company
  nameInput.addEventListener("input", function () {
    nameError.style.display = nameInput.value.trim() === "" ? "block" : "none";
  });

  companyInput.addEventListener("input", function () {
    companyError.style.display =
      companyInput.value.trim() === "" ? "block" : "none";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = nameInput.value.trim() !== "";
    const isPhoneValid = /^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(
      phoneInput.value
    );
    const isCompanyValid = companyInput.value.trim() !== "";

    nameError.style.display = isNameValid ? "none" : "block";
    phoneError.style.display = isPhoneValid ? "none" : "block";
    companyError.style.display = isCompanyValid ? "none" : "block";

    if (!isNameValid || !isPhoneValid || !isCompanyValid) {
      return;
    }

    // Show loader and hide button text
    spinner.style.display = "block";
    buttonText.style.display = "none";
    submitButton.disabled = true;

    // Set timestamp
    const now = new Date();
    const timestamp = now.toLocaleString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    // Create FormData
    const formData = new FormData(form);
    formData.append("sheetName", "Lead");
    formData.append("Yuborilgan vaqt", timestamp);

    // Send data to Google Script
    fetch(
      "https://script.google.com/macros/s/AKfycbwN2kdM6WyJar8vBkZ3iU0E0FGgH1IfiME86Oeg5LVcv_1Aox_BU4SiHkrfXIoUlbnPzQ/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          form.reset();
          nameError.style.display = "none";
          phoneError.style.display = "none";
          companyError.style.display = "none";
          succes.classList.add("succes-active");
          overlay.style.display = "block";
        } else {
          alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
        error.classList.add("succes-active");
        overlay.style.display = "block";
      })
      .finally(() => {
        // Hide loader and show button text
        spinner.style.display = "none";
        buttonText.style.display = "inline";
        submitButton.disabled = false;
      });
  });
  const succes__btn = document.querySelectorAll(".succes__btn");
  succes__btn.forEach((item) => {
    item.addEventListener("click", function () {
      succes.classList.remove("succes-active");
      error.classList.remove("succes-active");
      overlay.style.display = "none"
    });
  });

  overlay.addEventListener("click", function () {
    succes.classList.remove("succes-active");
    error.classList.remove("succes-active");
    overlay.style.display = "none"
  });
});
