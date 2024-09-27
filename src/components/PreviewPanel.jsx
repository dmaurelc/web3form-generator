import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { generateFormCode, generateFormCSS } from '../utils/formGenerator';
import { Edit, ArrowUp, ArrowDown, Trash2, AlertCircle, Plus, Minus, Copy } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const PreviewPanel = ({ formConfig, updateFormConfig }) => {
  const [activeTab, setActiveTab] = useState('vista previa');
  const [editingLabel, setEditingLabel] = useState(null);

  const formCode = generateFormCode(formConfig);
  const formCSS = formConfig.style === 'css' ? generateFormCSS(formConfig) : '';

  const copiarCodigo = () => {
    const codigoACopiar = formConfig.style === 'css' ? `${formCode}\n\n${formCSS}` : formCode;
    navigator.clipboard.writeText(codigoACopiar);
    alert('¡Código copiado al portapapeles!');
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
        let newFields = Array(newColumns).fill().map((_, i) => section.fields[i] || []);
        
        // Reorganize fields if columns are reduced
        if (newColumns < section.columns) {
          const allFields = section.fields.flat();
          newFields = Array(newColumns).fill().map(() => []);
          allFields.forEach((field, index) => {
            const columnIndex = index % newColumns;
            newFields[columnIndex].push(field);
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
            const fieldToDuplicate = { ...column[fieldIndex], id: `campo_${Date.now()}` };
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

  const renderField = (field) => {
    // ... (el código existente para renderField permanece sin cambios)
  };

  const renderFieldControls = (sectionId, columnIndex, field) => (
    <div className="mt-2 flex justify-end space-x-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Campo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label">Etiqueta</Label>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={field.required}
                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
              />
              <Label htmlFor="required">Campo obligatorio</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveField(sectionId, columnIndex, field.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveField(sectionId, columnIndex, field.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeField(sectionId, columnIndex, field.id)}><Trash2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateField(field.id, { required: !field.required })}><AlertCircle className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => duplicateField(sectionId, columnIndex, field.id)}><Copy className="h-4 w-4" /></Button>
    </div>
  );

  const renderSectionControls = (section) => (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => adjustSectionColumns(section.id, -1)} disabled={section.columns <= 1}><Minus className="h-4 w-4" /></Button>
      <span>{section.columns} {section.columns === 1 ? 'Columna' : 'Columnas'}</span>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => adjustSectionColumns(section.id, 1)} disabled={section.columns >= 4}><Plus className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSection(section.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSection(section.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="vista previa">Vista Previa</TabsTrigger>
          <TabsTrigger value="codigo">Código</TabsTrigger>
        </TabsList>
        <TabsContent value="vista previa">
          <div className="p-4">
            {formConfig.fields.map((section, index) => (
              <div
                key={section.id}
                className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg"
              >
                {renderSectionControls(section)}
                <div className={`grid grid-cols-${section.columns} gap-4`}>
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
                                  className="mb-4"
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
          </div>
        </TabsContent>
        <TabsContent value="codigo">
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
            <Button onClick={copiarCodigo} className="mt-4">
              Copiar Código
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewPanel;