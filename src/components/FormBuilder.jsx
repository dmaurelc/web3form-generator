import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import CustomizationPanel from './CustomizationPanel';
import PreviewPanel from './PreviewPanel';

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    formType: 'basico',
    fields: [],
    style: 'tailwind',
  });

  const updateFormConfig = (newConfig) => {
    setFormConfig({ ...formConfig, ...newConfig });
  };

  const onDragEnd = (result) => {
    // Handle drag end logic here
    // This function will be implemented to update the form configuration
    // based on the drag and drop result
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <CustomizationPanel formConfig={formConfig} updateFormConfig={updateFormConfig} />
        </div>
        <div className="w-full md:w-2/3">
          <PreviewPanel formConfig={formConfig} updateFormConfig={updateFormConfig} />
        </div>
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;