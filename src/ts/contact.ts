document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm') as HTMLFormElement;
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const statusMsg = document.getElementById('formStatus') as HTMLDivElement;

  
  const emailInput = document.getElementById('email') as HTMLInputElement;
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateField(emailInput);
    });
  }

  
  inputs.forEach(input => {
    if (input.id !== 'email') {
      input.addEventListener('blur', () => {
        validateField(input);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      
      statusMsg.className = 'status-msg success';
      statusMsg.textContent = 'Thank you for your message! We will get back to you soon.';
      statusMsg.style.display = 'block';
      form.reset();
      
      
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (group) {
          group.classList.remove('has-error');
          input.classList.remove('error');
        }
      });
      
      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'status-msg';
      }, 5000);
    } else {
      statusMsg.className = 'status-msg error';
      statusMsg.textContent = 'Please correct the errors in the form before submitting.';
      statusMsg.style.display = 'block';
    }
  });

  function validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;

    if (input.required && !input.value.trim()) {
      isValid = false;
      const errorDiv = group.querySelector('.error-msg') as HTMLElement;
      if (errorDiv) {
        errorDiv.textContent = `Please enter your ${input.id}`;
      }
    }

    if (input.id === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        const errorDiv = group.querySelector('.error-msg') as HTMLElement;
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email address';
        }
      }
    }

    if (isValid) {
      group.classList.remove('has-error');
      input.classList.remove('error');
    } else {
      group.classList.add('has-error');
      input.classList.add('error');
    }

    return isValid;
  }
});
