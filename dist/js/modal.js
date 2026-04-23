export function initModal() {
    const modalHTML = `
    <div id="login-modal" class="modal-overlay" style="display:none;">
      <div class="modal-content">
        <button id="modal-close-btn" class="modal-close">&times;</button>
        <h2 class="title-h2" style="font-size: 1.5rem">Log In</h2>
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="login-email">Email <span style="color:var(--color-main)">*</span></label>
            <input type="email" id="login-email" name="email" placeholder="example@email.com" required>
            <span class="error-msg" id="login-email-error">Invalid email format</span>
          </div>
          <div class="form-group">
            <label for="login-password">Password <span style="color:var(--color-main)">*</span></label>
            <div class="password-wrapper">
              <input type="password" id="login-password" name="password" placeholder="Enter your password" required>
              <button type="button" id="toggle-password" class="toggle-password-btn">
                <!-- SVG Eye Icon -->
                <svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
            <span class="error-msg" id="login-password-error">Password is required</span>
          </div>
          <div class="form-actions">
          <div class="checkbox-group">
            <input type="checkbox" id="test">
            <label for="test">Remember me</label>

          </div>
          <div class="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          </div>
          <div class="form-actions" style="margin-top: 20px;">
            <button type="submit" class="main-btn" style="width:100%">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');
    document.addEventListener('click', (e) => {
        const target = e.target;
        const isLoginBtn = target.closest('#login-modal-open-btn');
        if (isLoginBtn) {
            e.preventDefault();
            if (modal)
                modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        if (e.target === modal) {
            closeModal();
        }
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', closeModal);
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
            clearErrors();
        }
    }
    toggleBtn === null || toggleBtn === void 0 ? void 0 : toggleBtn.addEventListener('click', () => {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            toggleBtn.style.color = "var(--color-main)";
        }
        else {
            passInput.type = 'password';
            toggleBtn.style.color = "#999";
        }
    });
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('login-email-error').style.display = 'block';
            emailInput.style.borderColor = 'red';
            isValid = false;
        }
        if (passInput.value.trim() === '') {
            document.getElementById('login-password-error').style.display = 'block';
            passInput.style.borderColor = 'red';
            isValid = false;
        }
        if (isValid) {
            alert('Login logic triggered successfully!');
            closeModal();
        }
    });
    function clearErrors() {
        const errors = document.querySelectorAll('.error-msg');
        errors.forEach(el => el.style.display = 'none');
        emailInput.style.borderColor = '';
        passInput.style.borderColor = '';
    }
}
