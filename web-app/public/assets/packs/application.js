if (window.partnerDomain) {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  };

  const ALLOWED_TAGS = [
    'div', 'form', 'input', 'label', 'select', 'option', 'textarea', 'button',
    'span', 'img', 'p', 'strong', 'em', 'ul', 'li', 'ol', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'video'
  ]

  const ALLOWED_ATTR = [
    'class', 'id', 'name', 'type', 'value', 'placeholder', 'for', 'checked',
    'selected', 'onclick', 'onchange', 'oninput', 'style', 'src', 'title', 'alt',
    'data-partner-*', 'required', 'pattern', 'min', 'max', 'minlength', 'maxlength'
  ]

  const ALLOWED_ATTR_VALUES = {
    'data-partner-id': /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'data-partner-domain': /^IFRM-\d{6}$/
  }

  const secureFetch = async (url, headers = {}) => {
    try {
      const response = await fetch(url, {
        headers: { ...headers, 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  (async () => {
    try {
      const partnerDomain = sanitizeString(window.partnerDomain || '');
      const partnerId = sanitizeString(window.partnerId || '');
      const partnerUrl = new URL(window.partnerUrl || '').toString();

      if (!partnerDomain || !partnerId || !partnerUrl) {
        throw new Error('Missing or invalid partner configuration');
      }

      const response = await secureFetch(
        `${window.originUrl}/api/partners/portal?ifr_code=${encodeURIComponent(partnerDomain)}`,
        { 'X-Partner-Url': partnerUrl.replace(/\/$/, '') }
      );

      if (response.status === 202) {
        const data = await response.text();
        const partnerContainer = document.querySelector(`[data-partner-id="${partnerId}"]`);

        if (partnerContainer) {
          console.info('Partner metadata:', { partnerDomain, partnerId, partnerUrl });
          console.info('_+_+_+_ Bakaikg Partner IFrame loaded successfully. _+_+_+_');

          partnerContainer.textContent = '';

          const template = document.createElement('template');

          template.innerHTML = DOMPurify.sanitize(data, {
            ALLOWED_TAGS: ALLOWED_TAGS,
            ALLOWED_ATTR: ALLOWED_ATTR,
            ALLOWED_ATTR_VALUES: ALLOWED_ATTR_VALUES,
            WHOLE_DOCUMENT: false
          });

          partnerContainer.appendChild(template.content.cloneNode(true));

          const partnerForm = partnerContainer.querySelector('form');
          if (partnerForm) {
            const submitButton = partnerForm.querySelector('button[type="submit"]');
            const formInputs = partnerForm.querySelectorAll("input, select, textarea");
            const successMessage = partnerForm.querySelector('#form-success-message');

            function validateField(field) {
              const errorElement = document.getElementById(`error-${field.name}`);
              const isValid = field.checkValidity();

              if (errorElement) {
                if (!isValid && field.required) {
                  errorElement.textContent = 'Это поле обязательно для заполнения';
                  errorElement.style.display = 'block';

                  field.classList.add('error');
                } else {
                  errorElement.style.display = 'none';

                  field.classList.remove('error');
                }
              }

              return isValid;
            };

            function validateForm() {
              let formIsValid = true;

              formInputs.forEach(input => {
                if (!validateField(input)) {
                  formIsValid = false;
                }
              });

              submitButton.disabled = !formIsValid;
              return formIsValid;
            };

            formInputs.forEach(input => {
              input.addEventListener('input', () => {
                validateField(input);
                validateForm();
              });

              input.addEventListener('blur', () => {
                validateField(input);
                validateForm();
              });

              if (input.type === 'radio' || input.type === 'checkbox') {
                input.addEventListener('change', () => {
                  const groupName = input.name;
                  const group = document.querySelectorAll(`[name="${groupName}"]`);

                  group.forEach(radio => validateField(radio));
                  validateForm();
                });
              }
            });

            partnerForm.addEventListener('submit', async (event) => {
              event.preventDefault();
              event.stopPropagation();

              if (!validateForm()) return;

              const formData = new FormData(partnerForm);

              try {
                submitButton.disabled = true;
                successMessage.style.display = 'block';

                partnerForm.reset();

                formInputs.forEach(input => {
                  const errorElement = document.getElementById(`error-${input.name}`);

                  if (errorElement) {
                    errorElement.style.display = 'none';
                  }

                  input.classList.remove('error');
                  submitButton.remove();
                });

              } catch (error) {
                submitButton.disabled = false;
                console.error('Form submission error:', error);
              } finally {
                console.debug('Form submitted (sanitized):', Object.fromEntries(formData));
              }
            });
          }
        }
      } else {
        console.warn('Unexpected API response:', response.status);
      }

      const createSecureFunction = (baseName, fn) => {
        const safeName = `${baseName}_${partnerId.replace(/-/g, '_').toUpperCase()}`;
        if (window[safeName]) return;
        window[safeName] = fn;
        return safeName;
      };

      createSecureFunction('partnerOpenModal', (modalId) => {
        const sanitizedId = sanitizeString(modalId);
        const modal = document.getElementById(sanitizedId);
        if (!modal) return;

        const modalContent = modal.querySelector('.partner-form-modal-content');
        if (!modalContent) return;

        modal.classList.remove('fadeOutUp');
        modalContent.classList.remove('fadeOutUp');
        modal.classList.add('active');
        modalContent.classList.add('fadeInDown');

        setTimeout(() => {
          modalContent.classList.remove('fadeInDown');
        }, 400);
      });

      createSecureFunction('partnerCloseModal', (modalId) => {
        const sanitizedId = sanitizeString(modalId);
        const modal = document.getElementById(sanitizedId);
        if (!modal) return;

        const modalContent = modal.querySelector('.partner-form-modal-content');

        if (!modalContent) return;

        modalContent.classList.add('fadeOutUp');
        setTimeout(() => {
          modal.classList.remove('active');
          modalContent.classList.remove('fadeOutUp');
        }, 400);
      });

      document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
          event.target.classList.remove('active');
        }
      });

    } catch (error) {
      console.error('Initialization failed:', error);
    }
  })();
}
