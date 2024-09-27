import React, { useState } from 'react';
import CustomizationPanel from './CustomizationPanel';
import PreviewPanel from './PreviewPanel';

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    formType: 'basic',
    fields: [],
    style: 'tailwind',
  });

  const updateFormConfig = (newConfig) => {
    setFormConfig({ ...formConfig, ...newConfig });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        <CustomizationPanel formConfig={formConfig} updateFormConfig={updateFormConfig} />
      </div>
      <div className="w-full md:w-2/3">
        <PreviewPanel formConfig={formConfig} />
      </div>
    </div>
  );
};

export default FormBuilder;