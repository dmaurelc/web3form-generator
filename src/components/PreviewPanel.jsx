import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateFormCode } from '../utils/formGenerator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PreviewPanel = ({ formConfig, updateFormConfig }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const formCode = generateFormCode(formConfig);

  const copyCode = () => {
    navigator.clipboard.writeText(formCode);
    alert('Code copied to clipboard!');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formConfig.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateFormConfig({ fields: items });
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = formConfig.fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    updateFormConfig({ fields: updatedFields });
  };

  const removeField = (fieldId) => {
    const updatedFields = formConfig.fields.filter(field => field.id !== fieldId);
    updateFormConfig({ fields: updatedFields });
  };

  const moveField = (fieldId, direction) => {
    const fieldIndex = formConfig.fields.findIndex(field => field.id === fieldId);
    if ((direction === 'up' && fieldIndex > 0) || (direction === 'down' && fieldIndex < formConfig.fields.length - 1)) {
      const newFields = [...formConfig.fields];
      const temp = newFields[fieldIndex];
      newFields[fieldIndex] = newFields[fieldIndex + (direction === 'up' ? -1 : 1)];
      newFields[fieldIndex + (direction === 'up' ? -1 : 1)] = temp;
      updateFormConfig({ fields: newFields });
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'section':
        return (
          <div className={`grid grid-cols-${field.columns} gap-4`}>
            {field.fields.map(renderField)}
          </div>
        );
      default:
        return (
          <div className="mb-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input type={field.type} id={field.name} name={field.name} placeholder={field.placeholder} />
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="preview">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {formConfig.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4 p-2 border rounded"
                        >
                          {renderField(field)}
                          <div className="mt-2 flex justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">Edit</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Field</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="label">Label</Label>
                                    <Input
                                      id="label"
                                      value={field.label}
                                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="placeholder">Placeholder</Label>
                                    <Input
                                      id="placeholder"
                                      value={field.placeholder}
                                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button onClick={() => moveField(field.id, 'up')}>Up</Button>
                            <Button onClick={() => moveField(field.id, 'down')}>Down</Button>
                            <Button variant="destructive" onClick={() => removeField(field.id)}>Remove</Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="code">
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{formCode}</code>
            </pre>
            <Button onClick={copyCode} className="mt-4">
              Copy Code
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewPanel;