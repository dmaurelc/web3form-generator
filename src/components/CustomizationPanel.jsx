import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CustomizationPanel = ({ formConfig, updateFormConfig }) => {
  const addField = (type) => {
    const newField = { 
      id: `field_${Date.now()}`,
      type, 
      label: `New ${type} field`, 
      name: `field_${Date.now()}`,
      placeholder: '',
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
    };
    updateFormConfig({ fields: [...formConfig.fields, newField] });
  };

  const addSection = (columns) => {
    const newSection = {
      id: `section_${Date.now()}`,
      type: 'section',
      columns,
      fields: [],
    };
    updateFormConfig({ fields: [...formConfig.fields, newSection] });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formConfig.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateFormConfig({ fields: items });
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
              <SelectItem value="bem">BEM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Add Fields</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 gap-2">
                  {['text', 'email', 'password', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date', 'file'].map((type, index) => (
                    <Draggable key={type} draggableId={type} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Button onClick={() => addField(type)}>{type}</Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Add Sections</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => addSection(2)}>2 Columns</Button>
            <Button onClick={() => addSection(3)}>3 Columns</Button>
            <Button onClick={() => addSection(4)}>4 Columns</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;