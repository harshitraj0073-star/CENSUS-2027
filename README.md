# Census 2027: Digital Enumeration Portal

> **Office of the Registrar General & Census Commissioner, India**  
> *Ministry of Home Affairs, Government of India*

A web-based digital enumeration and public awareness portal for the upcoming Census 2027 initiative. Designed with accessible semantic HTML, responsive styling, and modular form validation.

---

## 🏛️ Features

- **Multi-Phase Architecture:**
  - **Phase 1:** House Listing and Housing Census enumeration workflow.
  - **Phase 2:** Population enumeration, demographic data collection, and citizen verification.
- **Accessibility First:**
  - Screen-reader friendly skip navigation links.
  - Semantic HTML landmarks (`<main>`, `<header>`, `role="banner"`, `aria-label`).
- **Interactive Portal:**
  - Interactive information dashboards (`info.html`, `portal.html`).
  - Client-side form validation suite (`tests/form-validation.test.js`).

---

## 🚀 Running Locally

You can run this project locally with any static web server:

```bash
# Using Python 3
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## 📁 Repository Structure

```text
CENSUS-2027/
├── index.html        # Entry landing page
├── portal.html       # Main enumeration portal dashboard
├── info.html         # Citizen information and guidelines
├── phase1.html       # House listing & housing census module
├── phase2.html       # Population enumeration module
├── css/
│   └── style.css     # Clean responsive design system
├── js/
│   ├── api.js        # Data layer and API handlers
│   └── app.js        # Core interaction logic
└── tests/
    └── form-validation.test.js  # Form validation test suite
```

---

## 🛠️ Tech Stack

- **HTML5** & Semantic Web APIs
- **Vanilla CSS3** (Responsive design, dark/light accessibility contrast)
- **Vanilla JavaScript** (ES6+)
