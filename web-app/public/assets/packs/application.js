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
    'data-partner-*'
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
            partnerForm.addEventListener('submit', (event) => {
              event.preventDefault();
              const formData = new FormData(partnerForm);
              console.debug('Form submitted (sanitized):', Object.fromEntries(formData));

              // TODO: Add actual form submission logic
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
