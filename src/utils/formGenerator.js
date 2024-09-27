export const generateFormCode = (formConfig) => {
  const { formType, fields, style } = formConfig;

  const generateFieldHtml = (field) => {
    const { type, label, name } = field;
    const className = style === 'tailwind' ? 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' : `form__${type}`;
    
    switch (type) {
      case 'text':
      case 'email':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <input type="${type}" id="${name}" name="${name}" class="${className}">
          </div>
        `;
      case 'textarea':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <textarea id="${name}" name="${name}" rows="3" class="${className}"></textarea>
          </div>
        `;
      case 'select':
        return `
          <div class="${style === 'tailwind' ? 'mb-4' : 'form__group'}">
            <label for="${name}" class="${style === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form__label'}">${label}</label>
            <select id="${name}" name="${name}" class="${className}">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
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