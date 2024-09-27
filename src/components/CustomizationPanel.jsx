import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TextIcon, AlignJustify, CheckSquare, Radio, FileText, CalendarIcon, Hash, Mail, Lock, Phone, Type, Code } from 'lucide-react';
import SectionIcon from './SectionIcon';

const CustomizationPanel = ({ formConfig, updateFormConfig }) => {
  const addSection = (columns = 1) => {
    const newSection = {
      id: `seccion_${Date.now()}`,
      type: 'section',
      columns,
      fields: Array(columns).fill([]),
    };
    updateFormConfig({ fields: [...formConfig.fields, newSection] });
  };

  const addField = (type) => {
    const newField = createField(type);
    const updatedFields = [...formConfig.fields];
    const lastSection = updatedFields[updatedFields.length - 1];
    
    if (lastSection && lastSection.type === 'section') {
      const columnWithLeastFields = lastSection.fields.reduce((minIndex, column, index, array) => 
        column.length < array[minIndex].length ? index : minIndex, 0);
      
      lastSection.fields[columnWithLeastFields] = [...lastSection.fields[columnWithLeastFields], newField];
    } else {
      const newSection = {
        id: `seccion_${Date.now()}`,
        type: 'section',
        columns: 1,
        fields: [[newField]],
      };
      updatedFields.push(newSection);
    }
    
    updateFormConfig({ fields: updatedFields });
  };

  const createField = (type) => {
    const baseNames = {
      text: 'name',
      email: 'email',
      password: 'password',
      number: 'number',
      tel: 'phone',
      textarea: 'message',
      select: 'select',
      checkbox: 'checkbox',
      radio: 'radio',
      file: 'file',
      date: 'date',
      button: 'button',
      html: 'html'
    };

    const baseName = baseNames[type] || type;
    const existingFields = formConfig.fields.flatMap(section => section.fields.flat());
    const existingNames = existingFields.map(field => field.name);
    let newName = baseName;
    let counter = 1;

    while (existingNames.includes(newName)) {
      newName = `${baseName}-${counter}`;
      counter++;
    }

    return {
      id: `campo_${Date.now()}`,
      type,
      label: `Nuevo campo ${type}`,
      name: newName,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Opción 1', 'Opción 2'] : undefined,
    };
  };

  const fieldTypes = formConfig.formType === 'basico' 
    ? [
        { type: 'text', icon: TextIcon, label: 'Texto' },
        { type: 'email', icon: Mail, label: 'Correo' },
        { type: 'number', icon: Hash, label: 'Número' },
        { type: 'tel', icon: Phone, label: 'Teléfono' },
        { type: 'button', icon: Type, label: 'Botón' },
        { type: 'html', icon: Code, label: 'HTML' },
      ]
    : [
        { type: 'text', icon: TextIcon, label: 'Texto' },
        { type: 'textarea', icon: AlignJustify, label: 'Área de texto' },
        { type: 'checkbox', icon: CheckSquare, label: 'Casilla' },
        { type: 'radio', icon: Radio, label: 'Radio' },
        { type: 'select', icon: TextIcon, label: 'Selección' },
        { type: 'file', icon: FileText, label: 'Archivo' },
        { type: 'date', icon: CalendarIcon, label: 'Fecha' },
        { type: 'number', icon: Hash, label: 'Número' },
        { type: 'email', icon: Mail, label: 'Correo' },
        { type: 'password', icon: Lock, label: 'Contraseña' },
        { type: 'tel', icon: Phone, label: 'Teléfono' },
        { type: 'button', icon: Type, label: 'Botón' },
        { type: 'html', icon: Code, label: 'HTML' },
      ];

  const onDragStart = (e, type) => {
    e.dataTransfer.setData('fieldType', type);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Personaliza tu Formulario</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Formulario</label>
          <Select
            value={formConfig.formType}
            onValueChange={(value) => updateFormConfig({ formType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de formulario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basico">Básico</SelectItem>
              <SelectItem value="avanzado">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estilo</label>
          <Select
            value={formConfig.style}
            onValueChange={(value) => updateFormConfig({ style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">Tailwind CSS</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Campos</h3>
          <div className="grid grid-cols-3 gap-2">
            {fieldTypes.map((field) => (
              <div
                key={field.type}
                draggable
                onDragStart={(e) => onDragStart(e, field.type)}
                onClick={() => addField(field.type)}
                className="flex items-center justify-center cursor-pointer"
              >
                <Button
                  className="w-full h-10 flex items-center justify-center space-x-2 px-2 py-1 text-xs"
                  variant="outline"
                >
                  <field.icon className="w-4 h-4" />
                  <span>{field.label}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Columnas</h3>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((columns) => (
              <Button 
                key={columns} 
                onClick={() => addSection(columns)} 
                variant="outline" 
                className="flex flex-col items-center justify-center p-2 h-16"
              >
                <SectionIcon columns={columns} />
                <span className="mt-1 text-xs">{columns} {columns === 1 ? 'Columna' : 'Columnas'}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;