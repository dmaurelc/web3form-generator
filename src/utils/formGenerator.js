export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field, index) => {
    const { type, label, name, placeholder, required, content, min, max, step, value, options } = field;
    const className = style === 'tailwind' ? 'mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `form__${type}`;
    const requiredAttr = required ? 'required' : '';
    const fieldName = generateUniqueName(name, index);
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="${type}" id="${fieldName}" name="${fieldName}" placeholder="${placeholder}" class="${className} w-full" ${requiredAttr}>
          </div>
        `;
      case 'textarea':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <textarea id="${fieldName}" name="${fieldName}" rows="3" class="${className} w-full" placeholder="${placeholder}" ${requiredAttr}></textarea>
          </div>
        `;
      case 'select':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <select id="${fieldName}" name="${fieldName}" class="${className} w-full" ${requiredAttr}>
              <option value="">Select an option</option>
              ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
            </select>
          </div>
        `;
      case 'radio':
      case 'checkbox':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <span class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</span>
            ${options.map((option, optionIndex) => `
              <div class="${style === 'tailwind' ? 'flex items-center' : 'form__option'}">
                <input type="${type}" id="${fieldName}_${optionIndex}" name="${fieldName}" value="${option.value}" class="${className}" ${requiredAttr}>
                <label for="${fieldName}_${optionIndex}" class="${style === 'tailwind' ? 'ml-2 block text-sm text-gray-900' : 'form__option-label'}">${option.label}</label>
              </div>
            `).join('\n')}
          </div>
        `;
      case 'file':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="file" id="${fieldName}" name="${fieldName}" class="${className}" ${requiredAttr}>
          </div>
        `;
      case 'button':
        const alignmentClass = style === 'tailwind' ? {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          'full-width': 'w-full',
        }[field.alignment || 'left'] : '';
        return `
          <div class="${style === 'tailwind' ? `mb-4 ${alignmentClass}` : 'form__group'}">
            <button type="submit" class="${style === 'tailwind' ? `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${field.alignment === 'full-width' ? 'w-full' : ''}` : 'form__button'}">${label}</button>
          </div>
        `;
      case 'html':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            ${content}
          </div>
        `;
      case 'slider':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="range" id="${fieldName}" name="${fieldName}" min="${min}" max="${max}" step="${step}" value="${value}" class="${className}" ${requiredAttr}>
            <span class="text-sm text-gray-500">Value: <span id="${fieldName}_value">${value}</span></span>
            <script>
              document.getElementById('${fieldName}').addEventListener('input', function() {
                document.getElementById('${fieldName}_value').textContent = this.value;
              });
            </script>
          </div>
        `;
      case 'numberIncrement':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <div class="flex items-center">
              <button type="button" onclick="decrement('${fieldName}')" class="${style === 'tailwind' ? 'px-2 py-1 border rounded-l' : 'form__button-decrement'}">-</button>
              <input type="number" id="${fieldName}" name="${fieldName}" value="${value}" min="${min}" max="${max}" step="${step}" class="${className} text-center" ${requiredAttr}>
              <button type="button" onclick="increment('${fieldName}')" class="${style === 'tailwind' ? 'px-2 py-1 border rounded-r' : 'form__button-increment'}">+</button>
            </div>
            <script>
              function increment(id) {
                var input = document.getElementById(id);
                var value = parseFloat(input.value);
                var step = parseFloat(input.step);
                var max = parseFloat(input.max);
                input.value = Math.min(value + step, max);
              }
              function decrement(id) {
                var input = document.getElementById(id);
                var value = parseFloat(input.value);
                var step = parseFloat(input.step);
                var min = parseFloat(input.min);
                input.value = Math.max(value - step, min);
              }
            </script>
          </div>
        `;
      default:
        return '';
    }
  };

  const generateUniqueName = (baseName, index) => {
    return index === 0 ? baseName : `${baseName}-${index}`;
  };

  const formFields = fields.map(section => 
    `<div class="${style === 'tailwind' ? `grid grid-cols-1 sm:grid-cols-${section.columns} gap-4` : `form__section form__section--${section.columns}-columns`}">
      ${section.fields.map(column => 
        column.map((field, index) => generateFieldHtml(field, index)).join('')
      ).join('')}
    </div>`
  ).join('');

  const formHtml = `
    <form action="https://api.web3forms.com/submit" method="POST" class="${style === 'tailwind' ? 'space-y-4 max-w-4xl mx-auto border border-gray-300 p-6 rounded-md' : 'form'}">
      <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
      ${formFields}
    </form>
  `;

  return formHtml;
};

export const generateFormCSS = (formConfig) => {
  return `
    .form {
      max-width: 64rem;
      margin: 0 auto;
      padding: 1.5rem;
      background-color: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
    }

    .form__group {
      margin-bottom: 1rem;
    }

    .form__label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form__input,
    .form__textarea,
    .form__select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 1rem;
    }

    .form__input:focus,
    .form__textarea:focus,
    .form__select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form__checkbox,
    .form__radio {
      margin-right: 0.5rem;
    }

    .form__button {
      background-color: #3b82f6;
      color: #ffffff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .form__button:hover {
      background-color: #2563eb;
    }

    .form__section {
      margin-bottom: 1.5rem;
    }

    .form__section--2-columns {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form__section--3-columns {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .form__section--4-columns {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .form__section--2-columns,
      .form__section--3-columns,
      .form__section--4-columns {
        grid-template-columns: 1fr;
      }
    }
  `;
};