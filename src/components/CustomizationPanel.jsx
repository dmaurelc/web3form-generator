import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const CustomizationPanel = ({ formConfig, updateFormConfig }) => {
  const addField = (type) => {
    const newField = { type, label: `New ${type} field`, name: `field_${Date.now()}` };
    updateFormConfig({ fields: [...formConfig.fields, newField] });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Customize Your Form</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Form Type</label>
          <Select
            value={formConfig.formType}
            onValueChange={(value) => updateFormConfig({ formType: value })}
          >
            <Select.Option value="basic">Basic</Select.Option>
            <Select.Option value="advanced">Advanced</Select.Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <Select
            value={formConfig.style}
            onValueChange={(value) => updateFormConfig({ style: value })}
          >
            <Select.Option value="tailwind">Tailwind CSS</Select.Option>
            <Select.Option value="bem">BEM</Select.Option>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Add Fields</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => addField('text')}>Text</Button>
            <Button onClick={() => addField('email')}>Email</Button>
            <Button onClick={() => addField('textarea')}>Textarea</Button>
            <Button onClick={() => addField('select')}>Select</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;