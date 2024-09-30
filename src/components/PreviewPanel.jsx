import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateFormCode, generateFormCSS } from '../utils/formGenerator';
import { Edit, ArrowUp, ArrowDown, Trash2, Copy, Star, Minus, Plus } from 'lucide-react';
import SliderField from './SliderField';
import NumberIncrementField from './NumberIncrementField';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PreviewPanel = ({ formConfig, updateFormConfig }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [editingLabel, setEditingLabel] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState('html');

  const formCode = generateFormCode(formConfig);
  const formCSS = formConfig.style === 'css' ? generateFormCSS(formConfig) : '';

  const copyCode = () => {
    const codeToCopy = activeCodeTab === 'html' ? formCode : formCSS;
    navigator.clipboard.writeText(codeToCopy);
    toast.success('Code copied to clipboard!');
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = formConfig.fields.map(section => {
      if (section.type === 'section') {
        const updatedColumns = section.fields.map(column =>
          column.map(field => field.id === fieldId ? { ...field, ...updates } : field)
        );
        return { ...section, fields: updatedColumns };
      }
      return section;
    });
    updateFormConfig({ fields: updatedFields });
  };

  const removeField = (sectionId, columnIndex, fieldId) => {
    const updatedFields = formConfig.fields.map(section => {
      if (section.id === sectionId) {
        const updatedColumns = section.fields.map((column, idx) => 
          idx === columnIndex ? column.filter(field => field.id !== fieldId) : column
        );
        return { ...section, fields: updatedColumns };
      }
      return section;
    });
    updateFormConfig({ fields: updatedFields });
  };

  const moveField = (sectionId, columnIndex, fieldId, direction) => {
    const updatedFields = formConfig.fields.map(section => {
      if (section.id === sectionId) {
        const updatedColumns = section.fields.map((column, idx) => {
          if (idx === columnIndex) {
            const fieldIndex = column.findIndex(field => field.id === fieldId);
            if (fieldIndex === -1) return column;
            const newIndex = fieldIndex + (direction === 'up' ? -1 : 1);
            if (newIndex < 0 || newIndex >= column.length) return column;
            const updatedColumn = [...column];
            [updatedColumn[fieldIndex], updatedColumn[newIndex]] = [updatedColumn[newIndex], updatedColumn[fieldIndex]];
            return updatedColumn;
          }
          return column;
        });
        return { ...section, fields: updatedColumns };
      }
      return section;
    });
    updateFormConfig({ fields: updatedFields });
  };

  const moveSection = (sectionId, direction) => {
    const sectionIndex = formConfig.fields.findIndex(field => field.id === sectionId);
    if (sectionIndex === -1) return;
    const newIndex = sectionIndex + (direction === 'up' ? -1 : 1);
    if (newIndex < 0 || newIndex >= formConfig.fields.length) return;
    const updatedFields = [...formConfig.fields];
    [updatedFields[sectionIndex], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[sectionIndex]];
    updateFormConfig({ fields: updatedFields });
  };

  const removeSection = (sectionId) => {
    const updatedFields = formConfig.fields.filter(field => field.id !== sectionId);
    updateFormConfig({ fields: updatedFields });
  };

  const adjustSectionColumns = (sectionId, adjustment) => {
    const updatedFields = formConfig.fields.map(section => {
      if (section.id === sectionId) {
        const newColumns = Math.max(1, Math.min(4, section.columns + adjustment));
        let newFields = [...section.fields];
        
        if (newColumns > section.columns) {
          // Add new columns
          for (let i = section.columns; i < newColumns; i++) {
            newFields.push([]);
          }
        } else if (newColumns < section.columns) {
          // Remove columns and redistribute fields
          const removedFields = newFields.slice(newColumns).flat();
          newFields = newFields.slice(0, newColumns);
          removedFields.forEach((field, index) => {
            newFields[index % newColumns].push(field);
          });
        }
        
        return { ...section, columns: newColumns, fields: newFields };
      }
      return section;
    });
    updateFormConfig({ fields: updatedFields });
  };

  const duplicateField = (sectionId, columnIndex, fieldId) => {
    const updatedFields = formConfig.fields.map(section => {
      if (section.id === sectionId) {
        const updatedColumns = section.fields.map((column, idx) => {
          if (idx === columnIndex) {
            const fieldIndex = column.findIndex(field => field.id === fieldId);
            if (fieldIndex === -1) return column;
            const fieldToDuplicate = { ...column[fieldIndex], id: `field_${Date.now()}` };
            return [...column.slice(0, fieldIndex + 1), fieldToDuplicate, ...column.slice(fieldIndex + 1)];
          }
          return column;
        });
        return { ...section, fields: updatedColumns };
      }
      return section;
    });
    updateFormConfig({ fields: updatedFields });
  };

  const handleLabelClick = (fieldId, currentLabel) => {
    setEditingLabel({ id: fieldId, label: currentLabel });
  };

  const handleLabelChange = (e) => {
    setEditingLabel(prev => ({ ...prev, label: e.target.value }));
  };

  const handleLabelBlur = () => {
    if (editingLabel) {
      updateField(editingLabel.id, { label: editingLabel.label });
      setEditingLabel(null);
    }
  };

  const renderField = (field) => {
    const labelElement = (
      <Label
        htmlFor={field.id}
        onClick={() => handleLabelClick(field.id, field.label)}
        className="cursor-pointer mb-1 block font-medium text-sm text-gray-700"
      >
        {editingLabel && editingLabel.id === field.id ? (
          <Input
            value={editingLabel.label}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            autoFocus
          />
        ) : (
          <>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </>
        )}
      </Label>
    );

    const fieldWrapper = (content) => (
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        {labelElement}
        {content}
      </div>
    );

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return fieldWrapper(
          <Input type={field.type} id={field.id} placeholder={field.placeholder} className="w-full mt-1" />
        );
      case 'textarea':
        return fieldWrapper(
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            className="w-full mt-1 p-2 border rounded-md"
            rows="3"
          ></textarea>
        );
      case 'select':
        return fieldWrapper(
          <Select>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
      case 'radio':
        return fieldWrapper(
          <div className="mt-2 space-y-2">
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type={field.type}
                  id={`${field.id}_${index}`}
                  name={field.id}
                  value={option.value}
                  className="mr-2"
                />
                <Label htmlFor={`${field.id}_${index}`} className="text-sm text-gray-700">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      case 'file':
        return fieldWrapper(
          <Input type="file" id={field.id} className="w-full mt-1" />
        );
      case 'button':
        const alignmentClass = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          'full-width': 'w-full',
        }[field.alignment || 'left'];
        return (
          <div className={`mb-4 ${alignmentClass}`}>
            <Button className={field.alignment === 'full-width' ? 'w-full' : ''}>{field.label}</Button>
          </div>
        );
      case 'html':
        return (
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: field.content }}></div>
        );
      case 'slider':
        return fieldWrapper(
          <SliderField field={field} updateField={updateField} />
        );
      case 'numberIncrement':
        return fieldWrapper(
          <NumberIncrementField field={field} updateField={updateField} />
        );
      case 'rating':
        return fieldWrapper(
          <div className="flex items-center mt-1">
            {[...Array(field.maxRating)].map((_, index) => (
              <Star
                key={index}
                className={`h-6 w-6 ${index < field.value ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => updateField(field.id, { value: index + 1 })}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderFieldControls = (sectionId, columnIndex, field) => (
    <div className="mt-2 flex justify-end space-x-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-4 w-4" /></Button>
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
            {field.type !== 'button' && field.type !== 'html' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={field.placeholder}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}
            {field.type !== 'button' && field.type !== 'html' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                />
                <Label htmlFor="required">Required field</Label>
              </div>
            )}
            {field.type === 'button' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alignment">Alignment</Label>
                <Select
                  value={field.alignment || 'left'}
                  onValueChange={(value) => updateField(field.id, { alignment: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {(field.type === 'checkbox' || field.type === 'radio' || field.type === 'select') && (
              <div className="grid gap-4">
                <Label>Options</Label>
                {field.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option.value}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = { ...newOptions[index], value: e.target.value };
                        updateField(field.id, { options: newOptions });
                      }}
                      placeholder="Value"
                    />
                    <Input
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = { ...newOptions[index], label: e.target.value };
                        updateField(field.id, { options: newOptions });
                      }}
                      placeholder="Label"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index);
                        updateField(field.id, { options: newOptions });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const newOptions = [...field.options, { value: '', label: '' }];
                    updateField(field.id, { options: newOptions });
                  }}
                >
                  Add option
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(sectionId, columnIndex, field.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(sectionId, columnIndex, field.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeField(sectionId, columnIndex, field.id)}><Trash2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => duplicateField(sectionId, columnIndex, field.id)}><Copy className="h-4 w-4" /></Button>
    </div>
  );

  const renderSectionControls = (section) => (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => adjustSectionColumns(section.id, -1)} disabled={section.columns <= 1}><Minus className="h-4 w-4" /></Button>
      <span>{section.columns} {section.columns === 1 ? 'Column' : 'Columns'}</span>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => adjustSectionColumns(section.id, 1)} disabled={section.columns >= 4}><Plus className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(section.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(section.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const hasActiveFields = formConfig.fields.some(section => 
    section.fields.some(column => column.length > 0)
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="p-4">
            {formConfig.fields.map((section, index) => (
              <div
                key={section.id}
                className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg"
              >
                {renderSectionControls(section)}
                <div className={`grid grid-cols-1 ${
                  section.columns === 1 ? 'md:grid-cols-1' :
                  section.columns === 2 ? 'md:grid-cols-2' :
                  section.columns === 3 ? 'md:grid-cols-3' :
                  'md:grid-cols-4'
                } gap-4`}>
                  {Array.from({ length: section.columns }).map((_, columnIndex) => (
                    <Droppable key={`${section.id}-${columnIndex}`} droppableId={`${section.id}-${columnIndex}`} type="FIELD">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="border border-dashed border-gray-300 p-4 rounded-lg min-h-[100px]"
                        >
                          {section.fields[columnIndex]?.map((field, fieldIndex) => (
                            <Draggable key={field.id} draggableId={field.id} index={fieldIndex}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-4 p-2 bg-gray-50 rounded border border-gray-200"
                                >
                                  {renderField(field)}
                                  {renderFieldControls(section.id, columnIndex, field)}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </div>
            ))}
            {!hasActiveFields && (
              <div className="text-center mt-4 p-8 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Empty Form</h2>
                <p className="text-lg font-medium text-gray-600">There are no active fields or columns in the form.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="mt-4 relative">
            <Tabs defaultValue="html" onValueChange={setActiveCodeTab}>
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                {formConfig.style === 'css' && <TabsTrigger value="css">CSS Vanilla</TabsTrigger>}
              </TabsList>
              <TabsContent value="html">
                <div className="relative group">
                  <SyntaxHighlighter
                    language="html"
                    style={vscDarkPlus}
                    className="rounded-lg p-4 whitespace-pre-wrap break-words"
                  >
                    {formCode}
                  </SyntaxHighlighter>
                  <Button
                    onClick={copyCode}
                    className="absolute top-2 right-2 bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-600"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy Code
                  </Button>
                </div>
              </TabsContent>
              {formConfig.style === 'css' && (
                <TabsContent value="css">
                  <div className="relative group">
                    <SyntaxHighlighter
                      language="css"
                      style={vscDarkPlus}
                      className="rounded-lg p-4 whitespace-pre-wrap break-words"
                    >
                      {formCSS}
                    </SyntaxHighlighter>
                    <Button
                      onClick={copyCode}
                      className="absolute top-2 right-2 bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-600"
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy Code
                    </Button>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewPanel;