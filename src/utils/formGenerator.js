export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field, index) => {
    const { type, label, name, placeholder, required, content, min, max, step, value } = field;
    const className = style === 'tailwind' ? 'w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `formulario__${type}`;
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
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="${type}" id="${fieldName}" name="${fieldName}" placeholder="${placeholder}" class="${className}" ${requiredAttr}>
          </div>
        `;
      case 'textarea':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <textarea id="${fieldName}" name="${fieldName}" rows="3" class="${className}" placeholder="${placeholder}" ${requiredAttr}></textarea>
          </div>
        `;
      case 'select':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <select id="${fieldName}" name="${fieldName}" class="${className}" ${requiredAttr}>
              <option value="">Selecciona una opción</option>
              ${field.options.map(option => `<option value="${option}">${option}</option>`).join('\n')}
            </select>
          </div>
        `;
      case 'radio':
      case 'checkbox':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <span class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</span>
            ${field.options.map((option, optionIndex) => `
              <div class="${style === 'tailwind' ? 'flex items-center' : 'formulario__opcion'}">
                <input type="${type}" id="${fieldName}_${optionIndex}" name="${fieldName}" value="${option}" class="${className}" ${requiredAttr}>
                <label for="${fieldName}_${optionIndex}" class="${style === 'tailwind' ? 'ml-2 block text-sm text-gray-900' : 'formulario__opcion-etiqueta'}">${option}</label>
              </div>
            `).join('\n')}
          </div>
        `;
      case 'file':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
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
          <div class="${style === 'tailwind' ? `mb-4 ${alignmentClass}` : 'formulario__grupo'}">
            <button type="submit" class="${style === 'tailwind' ? `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${field.alignment === 'full-width' ? 'w-full' : ''}` : 'formulario__boton'}">${label}</button>
          </div>
        `;
      case 'html':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            ${content}
          </div>
        `;
      case 'slider':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="range" id="${fieldName}" name="${fieldName}" min="${min}" max="${max}" step="${step}" value="${value}" class="${className}" ${requiredAttr}>
            <span class="text-sm text-gray-500">Valor: <span id="${fieldName}_value">${value}</span></span>
            <script>
              document.getElementById('${fieldName}').addEventListener('input', function() {
                document.getElementById('${fieldName}_value').textContent = this.value;
              });
            </script>
          </div>
        `;
      case 'numberIncrement':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${fieldName}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <div class="flex items-center">
              <button type="button" onclick="decrement('${fieldName}')" class="${style === 'tailwind' ? 'px-2 py-1 border rounded-l' : 'formulario__boton-decremento'}">-</button>
              <input type="number" id="${fieldName}" name="${fieldName}" value="${value}" min="${min}" max="${max}" step="${step}" class="${className} text-center" ${requiredAttr}>
              <button type="button" onclick="increment('${fieldName}')" class="${style === 'tailwind' ? 'px-2 py-1 border rounded-r' : 'formulario__boton-incremento'}">+</button>
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
    `<div class="${style === 'tailwind' ? `grid grid-cols-1 sm:grid-cols-${section.columns} gap-4` : `formulario__seccion formulario__seccion--${section.columns}-columnas`}">
      ${section.fields.map(column => 
        column.map((field, index) => generateFieldHtml(field, index)).join('')
      ).join('')}
    </div>`
  ).join('');

  const formHtml = `
    <form action="https://api.web3forms.com/submit" method="POST" class="${style === 'tailwind' ? 'space-y-6 max-w-4xl mx-auto' : 'formulario'}">
      <input type="hidden" name="access_key" value="TU_CLAVE_DE_ACCESO_AQUI">
      ${formFields}
    </form>
  `;

  return formHtml;
};

export const generateFormCSS = (formConfig) => {
  return `
    .formulario {
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .formulario__grupo {
      margin-bottom: 20px;
    }

    .formulario__etiqueta {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .formulario__text,
    .formulario__email,
    .formulario__password,
    .formulario__number,
    .formulario__tel,
    .formulario__date,
    .formulario__textarea,
    .formulario__select,
    .formulario__file,
    .formulario__slider {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .formulario__textarea {
      height: 100px;
    }

    .formulario__opcion {
      margin-bottom: 5px;
    }

    .formulario__opcion-etiqueta {
      margin-left: 5px;
    }

    .formulario__boton,
    .formulario__boton-decremento,
    .formulario__boton-incremento {
      padding: 10px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .formulario__boton:hover,
    .formulario__boton-decremento:hover,
    .formulario__boton-incremento:hover {
      background-color: #357ae8;
    }

    .formulario__seccion {
      display: grid;
      gap: 20px;
    }

    @media (min-width: 640px) {
      .formulario__seccion--1-columnas {
        grid-template-columns: 1fr;
      }

      .formulario__seccion--2-columnas {
        grid-template-columns: repeat(2, 1fr);
      }

      .formulario__seccion--3-columnas {
        grid-template-columns: repeat(3, 1fr);
      }

      .formulario__seccion--4-columnas {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 639px) {
      .formulario__seccion {
        grid-template-columns: 1fr;
      }
    }
  `;
};