export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field, index) => {
    const { type, label, name, placeholder, required, content, min, max, step, value, options } = field;
    const className = style === 'tailwind' ? 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `form__${type}`;
    const requiredAttr = required ? 'required' : '';
    const fieldName = generateUniqueName(name, index);
    
    const wrapField = (fieldHtml) => `
      <div class="${style === 'tailwind' ? 'mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200' : 'form__field-wrapper'}">
        <label for="${fieldName}" class="${style === 'tailwind' ? 'block mb-1 font-medium text-sm text-gray-700' : 'form__label'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
        ${fieldHtml}
      </div>
    `;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return wrapField(`<input type="${type}" id="${fieldName}" name="${fieldName}" placeholder="${placeholder}" class="${className}" ${requiredAttr}>`);
      case 'textarea':
        return wrapField(`<textarea id="${fieldName}" name="${fieldName}" rows="3" class="${className}" placeholder="${placeholder}" ${requiredAttr}></textarea>`);
      case 'select':
        return wrapField(`
          <select id="${fieldName}" name="${fieldName}" class="${className}" ${requiredAttr}>
            <option value="">Select an option</option>
            ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
          </select>
        `);
      case 'radio':
      case 'checkbox':
        return wrapField(`
          <div class="${style === 'tailwind' ? 'mt-2 space-y-2' : 'form__options'}">
            ${options.map((option, optionIndex) => `
              <div class="${style === 'tailwind' ? 'flex items-center' : 'form__option'}">
                <input type="${type}" id="${fieldName}_${optionIndex}" name="${fieldName}" value="${option.value}" class="${className}" ${requiredAttr}>
                <label for="${fieldName}_${optionIndex}" class="${style === 'tailwind' ? 'ml-2 text-sm text-gray-700' : 'form__option-label'}">${option.label}</label>
              </div>
            `).join('\n')}
          </div>
        `);
      case 'file':
        return wrapField(`<input type="file" id="${fieldName}" name="${fieldName}" class="${className}" ${requiredAttr}>`);
      case 'button':
        const alignmentClass = style === 'tailwind' ? {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          'full-width': 'w-full',
        }[field.alignment || 'left'] : '';
        return `
          <div class="${style === 'tailwind' ? `mb-4 ${alignmentClass}` : 'form__button-wrapper'}">
            <button type="submit" class="${style === 'tailwind' ? `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${field.alignment === 'full-width' ? 'w-full' : ''}` : 'form__button'}">${label}</button>
          </div>
        `;
      case 'html':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__html-content'}">
            ${content}
          </div>
        `;
      case 'slider':
        return wrapField(`
          <input type="range" id="${fieldName}" name="${fieldName}" min="${min}" max="${max}" step="${step}" value="${value}" class="${className}" ${requiredAttr}>
          <span class="text-sm text-gray-500">Value: <span id="${fieldName}_value">${value}</span></span>
          <script>
            document.getElementById('${fieldName}').addEventListener('input', function() {
              document.getElementById('${fieldName}_value').textContent = this.value;
            });
          </script>
        `);
      case 'numberIncrement':
        return wrapField(`
          <div class="${style === 'tailwind' ? 'flex items-center' : 'form__number-increment'}">
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
        `);
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

    .form__field-wrapper {
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

    .form__options {
      margin-top: 0.5rem;
    }

    .form__option {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .form__option-label {
      margin-left: 0.5rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .form__number-increment {
      display: flex;
      align-items: center;
    }

    .form__button-decrement,
    .form__button-increment {
      padding: 0.25rem 0.5rem;
      background-color: #f3f4f6;
      border: 1px solid #d1d5db;
      cursor: pointer;
    }

    .form__button-decrement {
      border-radius: 0.25rem 0 0 0.25rem;
    }

    .form__button-increment {
      border-radius: 0 0.25rem 0.25rem 0;
    }
  `;
};