# Best Shop - Suitcase E-Commerce 🧳

This is a responsive e-commerce web application developed as a Capstone Project for the Front-end Fundamentals course. The project demonstrates a fully functional front-end interface for a suitcase store, built with modern web technologies and best practices.

## 🚀 Features Implemented

* **Dynamic Data Rendering:** Products are dynamically loaded and rendered from a local `data.json` file using TypeScript and asynchronous functions (`fetch`).
* **Interactive JavaScript Carousel:** A custom-built, smooth-scrolling carousel on the Home page for featured items.
* **Smart Filtering & Categorization:** Products are filtered and displayed in specific sections (e.g., "Selected Products", "New Arrivals", "Top Best Sets") based on their properties.
* **Shopping Cart Functionality:** Users can add products to the cart. The cart badge updates in real-time, and the cart data is persistently stored using browser `LocalStorage`.
* **Responsive Design:** The layout is fully adaptive for mobile, tablet, and desktop devices, including a functional mobile hamburger menu.
* **Code Quality & Linting:** The project is configured with modern linters (**ESLint** with Flat Config for TypeScript and **Stylelint** for SCSS) to ensure code consistency and maintainability.

## 🛠️ Technologies Used

* **HTML5** (Semantic markup)
* **SCSS / CSS** (BEM methodology, CSS variables, Flexbox/Grid)
* **TypeScript** (Strict typing, DOM manipulation, ES Modules)
* **Node.js & NPM** (Package management and custom scripts)
* **ESLint & Stylelint** (Quality control)

## 💻 How to Run the Project Locally

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-repository-url>
    ```

2.  **Install dependencies:**
    Navigate to the project folder and run:
    ```bash
    npm install
    ```

3.  **Start the development servers:**
    Depending on your specific `package.json` setup, start the TypeScript compiler, SCSS compiler, and Live Server. Usually, this is done via:
    ```bash
    npm run dev
    ```


4.  **Check Code Quality (Linting):**
    To run the configured linters for both TypeScript and SCSS, execute:
    ```bash
    npm run lint
    ```

## ✅ Self-Assessment

**Final Project Score: 64 / 64**

The project has been fully implemented according to the requirements checklist provided by the EPAM Campus team. All functional and technical criteria have been met.