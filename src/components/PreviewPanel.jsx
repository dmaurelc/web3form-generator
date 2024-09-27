import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateFormCode, generateFormCSS } from '../utils/formGenerator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Edit, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const PreviewPanel = ({ formConfig, updateFormConfig }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const formCode = generateFormCode(formConfig);
  const formCSS = formConfig.style === 'css' ? generateFormCSS(formConfig) : '';

  const copyCode = () => {
    const codeToCopy = formConfig.style === 'css' ? `${formCode}\n\n${formCSS}` : formCode;
    navigator.clipboard.writeText(codeToCopy);
    alert('Code copied to clipboard!');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const newFields = [...formConfig.fields];
    let draggedItem;

    if (sourceId === 'preview') {
      [draggedItem] = newFields.splice(sourceIndex, 1);
    } else {
      const sectionIndex = newFields.findIndex(field => field.id === sourceId);
      [draggedItem] = newFields[sectionIndex].fields.splice(sourceIndex, 1);
      if (newFields[sectionIndex].fields.length === 0) {
        newFields.splice(sectionIndex, 1);
      }
    }

    if (destId === 'preview') {
      newFields.splice(destIndex, 0, draggedItem);
    } else {
      const sectionIndex = newFields.findIndex(field => field.id === destId);
      if (sectionIndex === -1) {
        const newSection = {
          id: destId,
          type: 'section',
          columns: parseInt(destId.split('_')[1]),
          fields: [draggedItem]
        };
        newFields.splice(destIndex, 0, newSection);
      } else {
        newFields[sectionIndex].fields.splice(destIndex, 0, draggedItem);
      }
    }

    updateFormConfig({ fields: newFields });
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = formConfig.fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : 
      field.type === 'section' ? { ...field, fields: field.fields.map(subField => 
        subField.id === fieldId ? { ...subField, ...updates } : subField
      )} : field
    );
    updateFormConfig({ fields: updatedFields });
  };

  const removeField = (fieldId) => {
    const updatedFields = formConfig.fields.reduce((acc, field) => {
      if (field.id === fieldId) return acc;
      if (field.type === 'section') {
        const updatedSectionFields = field.fields.filter(subField => subField.id !== fieldId);
        if (updatedSectionFields.length > 0) {
          acc.push({ ...field, fields: updatedSectionFields });
        }
      } else {
        acc.push(field);
      }
      return acc;
    }, []);
    updateFormConfig({ fields: updatedFields });
  };

  const moveField = (fieldId, direction) => {
    const newFields = [...formConfig.fields];
    let fieldIndex = -1;
    let sectionIndex = -1;

    newFields.forEach((field, index) => {
      if (field.id === fieldId) {
        fieldIndex = index;
      } else if (field.type === 'section') {
        const subFieldIndex = field.fields.findIndex(subField => subField.id === fieldId);
        if (subFieldIndex !== -1) {
          fieldIndex = subFieldIndex;
          sectionIndex = index;
        }
      }
    });

    if (fieldIndex === -1) return;

    if (sectionIndex === -1) {
      if ((direction === 'up' && fieldIndex > 0) || (direction === 'down' && fieldIndex < newFields.length - 1)) {
        const temp = newFields[fieldIndex];
        newFields[fieldIndex] = newFields[fieldIndex + (direction === 'up' ? -1 : 1)];
        newFields[fieldIndex + (direction === 'up' ? -1 : 1)] = temp;
      }
    } else {
      const sectionFields = newFields[sectionIndex].fields;
      if ((direction === 'up' && fieldIndex > 0) || (direction === 'down' && fieldIndex < sectionFields.length - 1)) {
        const temp = sectionFields[fieldIndex];
        sectionFields[fieldIndex] = sectionFields[fieldIndex + (direction === 'up' ? -1 : 1)];
        sectionFields[fieldIndex + (direction === 'up' ? -1 : 1)] = temp;
      }
    }

    updateFormConfig({ fields: newFields });
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'section':
        return (
          <Droppable droppableId={field.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid grid-cols-${field.columns} gap-4`}
              >
                {field.fields.map((subField, index) => (
                  <Draggable key={subField.id} draggableId={subField.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-4 p-2"
                      >
                        {renderField(subField)}
                        {renderFieldControls(subField)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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

  const renderFieldControls = (field) => (
    <div className="mt-2 flex justify-end space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
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
      <Button variant="outline" size="icon" onClick={() => moveField(field.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="outline" size="icon" onClick={() => moveField(field.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="outline" size="icon" onClick={() => removeField(field.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
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
                          className="mb-4 p-2"
                        >
                          {renderField(field)}
                          {field.type !== 'section' && renderFieldControls(field)}
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
            <Tabs defaultValue="html">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                {formConfig.style === 'css' && <TabsTrigger value="css">CSS</TabsTrigger>}
              </TabsList>
              <TabsContent value="html">
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{formCode}</code>
                </pre>
              </TabsContent>
              {formConfig.style === 'css' && (
                <TabsContent value="css">
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{formCSS}</code>
                  </pre>
                </TabsContent>
              )}
            </Tabs>
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