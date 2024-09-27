export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field) => {
    const { type, label, name, placeholder, required, content } = field;
    const className = style === 'tailwind' ? 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `formulario__${type}`;
    const requiredAttr = required ? 'required' : '';
    
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="${type}" id="${name}" name="${name}" placeholder="${placeholder}" class="${className}" ${requiredAttr}>
          </div>
        `;
      case 'textarea':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <textarea id="${name}" name="${name}" rows="3" class="${className}" placeholder="${placeholder}" ${requiredAttr}></textarea>
          </div>
        `;
      case 'select':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <select id="${name}" name="${name}" class="${className}" ${requiredAttr}>
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
            ${field.options.map(option => `
              <div class="${style === 'tailwind' ? 'flex items-center' : 'formulario__opcion'}">
                <input type="${type}" id="${name}_${option}" name="${name}" value="${option}" class="${className}" ${requiredAttr}>
                <label for="${name}_${option}" class="${style === 'tailwind' ? 'ml-2 block text-sm text-gray-900' : 'formulario__opcion-etiqueta'}">${option}</label>
              </div>
            `).join('\n')}
          </div>
        `;
      case 'file':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'formulario__etiqueta'}">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
            <input type="file" id="${name}" name="${name}" class="${className}" ${requiredAttr}>
          </div>
        `;
      case 'button':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            <button type="button" class="${style === 'tailwind' ? 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'formulario__boton'}">${label}</button>
          </div>
        `;
      case 'html':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'formulario__grupo'}">
            ${content}
          </div>
        `;
      default:
        return '';
    }
  };

  const formFields = fields.map(section => 
    `<div class="${style === 'tailwind' ? `grid grid-cols-${section.columns} gap-4` : `formulario__seccion formulario__seccion--${section.columns}-columnas`}">
      ${section.fields.map(column => 
        column.map(generateFieldHtml).join('')
      ).join('')}
    </div>`
  ).join('');

  const formHtml = `
    <form action="https://api.web3forms.com/submit" method="POST" class="${style === 'tailwind' ? 'space-y-6' : 'formulario'}">
      <input type="hidden" name="access_key" value="TU_CLAVE_DE_ACCESO_AQUI">
      ${formFields}
      <div>
        <button type="submit" class="${style === 'tailwind' ? 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'formulario__enviar'}">
          Enviar
        </button>
      </div>
    </form>
  `;

  return formHtml;
};

export const generateFormCSS = (formConfig) => {
  return `
    .formulario {
      max-width: 500px;
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
    .formulario__file {
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
    .formulario__enviar {
      width: 100%;
      padding: 10px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .formulario__boton:hover,
    .formulario__enviar:hover {
      background-color: #357ae8;
    }

    .formulario__seccion {
      display: grid;
      gap: 20px;
    }

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
  `;
};