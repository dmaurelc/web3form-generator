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
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const updatedFields = Array.from(formConfig.fields);
    const [reorderedItem] = updatedFields.splice(source.index, 1);
    updatedFields.splice(destination.index, 0, reorderedItem);

    updateFormConfig({ fields: updatedFields });
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