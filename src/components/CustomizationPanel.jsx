import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TextIcon, AlignJustify, CheckSquare, Radio, FileText, CalendarIcon, Hash, Mail, Lock, Phone } from 'lucide-react';

const CustomizationPanel = ({ formConfig, updateFormConfig }) => {
  const addSection = (columns) => {
    const newSection = {
      id: `section_${Date.now()}`,
      type: 'section',
      columns,
      fields: [],
    };
    updateFormConfig({ fields: [...formConfig.fields, newSection] });
  };

  const fieldTypes = [
    { type: 'text', icon: TextIcon },
    { type: 'textarea', icon: AlignJustify },
    { type: 'checkbox', icon: CheckSquare },
    { type: 'radio', icon: Radio },
    { type: 'select', icon: TextIcon },
    { type: 'file', icon: FileText },
    { type: 'date', icon: CalendarIcon },
    { type: 'number', icon: Hash },
    { type: 'email', icon: Mail },
    { type: 'password', icon: Lock },
    { type: 'tel', icon: Phone },
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
          <h3 className="text-lg font-medium mb-2">Add Fields</h3>
          <div className="grid grid-cols-3 gap-2">
            {fieldTypes.map((field) => (
              <div
                key={field.type}
                draggable
                onDragStart={(e) => onDragStart(e, field.type)}
                className="flex items-center justify-center cursor-move"
              >
                <Button
                  className="w-full flex items-center justify-center space-x-2 py-2"
                  variant="outline"
                >
                  <field.icon className="w-4 h-4" />
                  <span>{field.type}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Add Sections</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => addSection(2)} variant="outline">2 Columns</Button>
            <Button onClick={() => addSection(3)} variant="outline">3 Columns</Button>
            <Button onClick={() => addSection(4)} variant="outline">4 Columns</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;