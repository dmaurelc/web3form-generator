export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field) => {
    const { type, label, name, placeholder } = field;
    const className = style === 'tailwind' ? 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `form__${type}`;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <input type="${type}" id="${name}" name="${name}" placeholder="${placeholder}" class="${className}">
          </div>
        `;
      case 'textarea':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <textarea id="${name}" name="${name}" rows="3" class="${className}" placeholder="${placeholder}"></textarea>
          </div>
        `;
      case 'select':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <select id="${name}" name="${name}" class="${className}">
              <option value="">Select an option</option>
              ${field.options.map(option => `<option value="${option}">${option}</option>`).join('\n')}
            </select>
          </div>
        `;
      case 'radio':
      case 'checkbox':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <span class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</span>
            ${field.options.map(option => `
              <div class="${style === 'tailwind' ? 'flex items-center' : 'form__option'}">
                <input type="${type}" id="${name}_${option}" name="${name}" value="${option}" class="${className}">
                <label for="${name}_${option}" class="${style === 'tailwind' ? 'ml-2 block text-sm text-gray-900' : 'form__option-label'}">${option}</label>
              </div>
            `).join('\n')}
          </div>
        `;
      case 'file':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <input type="file" id="${name}" name="${name}" class="${className}">
          </div>
        `;
      default:
        return '';
    }
  };

  const formFields = fields.map(generateFieldHtml).join('');

  const formHtml = `
    <form action="https://api.web3forms.com/submit" method="POST" class="${style === 'tailwind' ? 'space-y-6' : 'form'}">
      <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
      ${formFields}
      <div>
        <button type="submit" class="${style === 'tailwind' ? 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'form__submit'}">
          Submit
        </button>
      </div>
    </form>
  `;

  return formHtml;
};

export const generateFormCSS = (formConfig) => {
  return `
    .form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form__group {
      margin-bottom: 20px;
    }

    .form__label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form__text,
    .form__email,
    .form__password,
    .form__number,
    .form__tel,
    .form__date,
    .form__textarea,
    .form__select,
    .form__file {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .form__textarea {
      height: 100px;
    }

    .form__option {
      margin-bottom: 5px;
    }

    .form__option-label {
      margin-left: 5px;
    }

    .form__submit {
      width: 100%;
      padding: 10px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .form__submit:hover {
      background-color: #357ae8;
    }
  `;
};