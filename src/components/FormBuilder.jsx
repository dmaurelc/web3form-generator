import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import CustomizationPanel from './CustomizationPanel';
import PreviewPanel from './PreviewPanel';
import { Button } from '@/components/ui/button';

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    formType: 'basico',
    fields: [],
    style: 'tailwind',
  });

  useEffect(() => {
    // Asegurarse de que siempre haya una sección por defecto con un botón
    if (formConfig.fields.length === 0) {
      addDefaultSection();
    } else {
      const lastSection = formConfig.fields[formConfig.fields.length - 1];
      if (!lastSection.fields[0].some(field => field.type === 'button')) {
        addDefaultButton();
      }
    }
  }, [formConfig.fields]);

  const addDefaultSection = () => {
    const newSection = {
      id: `seccion_${Date.now()}`,
      type: 'section',
      columns: 1,
      fields: [[]],
    };
    setFormConfig(prevConfig => ({
      ...prevConfig,
      fields: [...prevConfig.fields, newSection],
    }));
    addDefaultButton();
  };

  const addDefaultButton = () => {
    const newButton = {
      id: `campo_${Date.now()}`,
      type: 'button',
      label: 'Enviar',
      name: 'submit',
    };
    setFormConfig(prevConfig => {
      const updatedFields = [...prevConfig.fields];
      const lastSection = updatedFields[updatedFields.length - 1];
      lastSection.fields[0].push(newButton);
      return { ...prevConfig, fields: updatedFields };
    });
  };

  const updateFormConfig = (newConfig) => {
    setFormConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const updatedFields = Array.from(formConfig.fields);
    const [sourceSection, sourceColumn] = source.droppableId.split('-');
    const [destSection, destColumn] = destination.droppableId.split('-');

    if (sourceSection === destSection && sourceColumn === destColumn) {
      // Reordering within the same column
      const sectionIndex = updatedFields.findIndex(section => section.id === sourceSection);
      const columnFields = Array.from(updatedFields[sectionIndex].fields[parseInt(sourceColumn)]);
      const [reorderedItem] = columnFields.splice(source.index, 1);
      columnFields.splice(destination.index, 0, reorderedItem);
      updatedFields[sectionIndex].fields[parseInt(sourceColumn)] = columnFields;
    } else {
      // Moving between columns or sections
      const sourceSectionIndex = updatedFields.findIndex(section => section.id === sourceSection);
      const destSectionIndex = updatedFields.findIndex(section => section.id === destSection);
      const sourceColumnFields = Array.from(updatedFields[sourceSectionIndex].fields[parseInt(sourceColumn)]);
      const destColumnFields = Array.from(updatedFields[destSectionIndex].fields[parseInt(destColumn)]);
      const [movedItem] = sourceColumnFields.splice(source.index, 1);
      destColumnFields.splice(destination.index, 0, movedItem);
      updatedFields[sourceSectionIndex].fields[parseInt(sourceColumn)] = sourceColumnFields;
      updatedFields[destSectionIndex].fields[parseInt(destColumn)] = destColumnFields;
    }

    updateFormConfig({ fields: updatedFields });
  };

  const hasActiveFields = formConfig.fields.some(section => 
    section.fields.some(column => column.length > 0 && column.some(field => field.type !== 'button'))
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <CustomizationPanel formConfig={formConfig} updateFormConfig={updateFormConfig} />
        </div>
        <div className="w-full md:w-2/3">
          <PreviewPanel formConfig={formConfig} updateFormConfig={updateFormConfig} />
          {!hasActiveFields && (
            <div className="text-center mt-4">
              <p>No hay campos activos en el formulario.</p>
              <Button onClick={() => addDefaultSection()} className="mt-2">Agregar campos</Button>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;