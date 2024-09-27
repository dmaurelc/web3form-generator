import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TextIcon, AlignJustify, CheckSquare, Radio, FileText, CalendarIcon, Hash, Mail, Lock, Phone, Type, Code, Sliders, PlusSquare, Star } from 'lucide-react';
import SectionIcon from './SectionIcon';

const CustomizationPanel = ({ formConfig, updateFormConfig }) => {
  const addSection = (columns = 1) => {
    const newSection = {
      id: `section_${Date.now()}`,
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
        id: `section_${Date.now()}`,
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
      text: 'Text',
      email: 'Email',
      password: 'Password',
      number: 'Number',
      tel: 'Phone',
      textarea: 'Text Area',
      select: 'Select',
      checkbox: 'Checkbox',
      radio: 'Radio',
      file: 'File',
      date: 'Date',
      button: 'Button',
      html: 'HTML',
      slider: 'Slider',
      numberIncrement: 'Number Increment',
      rating: 'Rating'
    };

    const baseName = baseNames[type] || type;
    const existingFields = formConfig.fields.flatMap(section => section.fields.flat());
    const existingNames = existingFields.map(field => field.name);
    let newName = baseName;
    let counter = 1;

    while (existingNames.includes(newName)) {
      newName = `${baseName} ${counter}`;
      counter++;
    }

    return {
      id: `field_${Date.now()}`,
      type,
      label: baseName,
      name: newName,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ] : undefined,
      alignment: type === 'button' ? 'left' : undefined,
      min: type === 'slider' ? 0 : undefined,
      max: type === 'slider' ? 100 : undefined,
      step: type === 'slider' || type === 'numberIncrement' ? 1 : undefined,
      value: type === 'slider' || type === 'numberIncrement' ? 0 : undefined,
      maxRating: type === 'rating' ? 5 : undefined,
    };
  };

  const fieldTypes = formConfig.formType === 'basic' 
    ? [
        { type: 'text', icon: TextIcon, label: 'Text' },
        { type: 'email', icon: Mail, label: 'Email' },
        { type: 'number', icon: Hash, label: 'Number' },
        { type: 'tel', icon: Phone, label: 'Phone' },
        { type: 'button', icon: Type, label: 'Button' },
        { type: 'html', icon: Code, label: 'HTML' },
      ]
    : [
        { type: 'text', icon: TextIcon, label: 'Text' },
        { type: 'textarea', icon: AlignJustify, label: 'Text Area' },
        { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
        { type: 'radio', icon: Radio, label: 'Radio' },
        { type: 'select', icon: TextIcon, label: 'Select' },
        { type: 'file', icon: FileText, label: 'File' },
        { type: 'date', icon: CalendarIcon, label: 'Date' },
        { type: 'number', icon: Hash, label: 'Number' },
        { type: 'email', icon: Mail, label: 'Email' },
        { type: 'password', icon: Lock, label: 'Password' },
        { type: 'tel', icon: Phone, label: 'Phone' },
        { type: 'button', icon: Type, label: 'Button' },
        { type: 'html', icon: Code, label: 'HTML' },
        { type: 'slider', icon: Sliders, label: 'Slider' },
        { type: 'numberIncrement', icon: PlusSquare, label: 'Number Increment' },
        { type: 'rating', icon: Star, label: 'Rating' },
      ];

  const onDragStart = (e, type) => {
    e.dataTransfer.setData('fieldType', type);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Customize Your Form</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Form Type</label>
          <Select
            value={formConfig.formType}
            onValueChange={(value) => updateFormConfig({ formType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select form type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <Select
            value={formConfig.style}
            onValueChange={(value) => updateFormConfig({ style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">Tailwind CSS</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Fields</h3>
          <div className="grid grid-cols-2 gap-2">
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
          <h3 className="text-lg font-medium mb-2">Columns</h3>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((columns) => (
              <Button 
                key={columns} 
                onClick={() => addSection(columns)} 
                variant="outline" 
                className="flex flex-col items-center justify-center p-2 h-16"
              >
                <SectionIcon columns={columns} />
                <span className="mt-1 text-xs">{columns} {columns === 1 ? 'Column' : 'Columns'}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;