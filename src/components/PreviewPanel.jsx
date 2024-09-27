import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateFormCode, generateFormCSS } from '../utils/formGenerator';
import { Edit, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const PreviewPanel = ({ formConfig, updateFormConfig }) => {
  const [activeTab, setActiveTab] = useState('vista previa');

  const formCode = generateFormCode(formConfig);
  const formCSS = formConfig.style === 'css' ? generateFormCSS(formConfig) : '';

  const copiarCodigo = () => {
    const codigoACopiar = formConfig.style === 'css' ? `${formCode}\n\n${formCSS}` : formCode;
    navigator.clipboard.writeText(codigoACopiar);
    alert('¡Código copiado al portapapeles!');
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, sectionId, columnIndex) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('fieldType');
    const newField = createField(fieldType);
    
    const updatedFields = formConfig.fields.map(field => {
      if (field.id === sectionId) {
        const updatedColumns = [...field.fields];
        if (!updatedColumns[columnIndex]) {
          updatedColumns[columnIndex] = [];
        }
        updatedColumns[columnIndex].push(newField);
        return { ...field, fields: updatedColumns };
      }
      return field;
    });

    updateFormConfig({ fields: updatedFields });
  };

  const createField = (type) => ({
    id: `campo_${Date.now()}`,
    type,
    label: `Nuevo campo ${type}`,
    name: `campo_${Date.now()}`,
    placeholder: '',
    options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Opción 1', 'Opción 2'] : undefined,
  });

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

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return (
          <div className="mb-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input type={field.type} id={field.name} name={field.name} placeholder={field.placeholder} />
          </div>
        );
      // Añadir casos para otros tipos de campo...
      default:
        return null;
    }
  };

  const renderFieldControls = (sectionId, columnIndex, field) => (
    <div className="mt-2 flex justify-end space-x-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
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
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" onClick={() => moveField(sectionId, columnIndex, field.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => moveField(sectionId, columnIndex, field.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => removeField(sectionId, columnIndex, field.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const renderSectionControls = (section) => (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" onClick={() => moveSection(section.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => moveSection(section.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => removeSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
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
            {formConfig.fields.map((section) => (
              <div key={section.id} className={`group relative grid grid-cols-${section.columns} gap-4 mb-4 p-4 border border-dashed border-gray-300 rounded-lg`}>
                {renderSectionControls(section)}
                {Array.from({ length: section.columns }).map((_, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="border border-dashed border-gray-300 p-4 rounded-lg min-h-[100px]"
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, section.id, columnIndex)}
                  >
                    {section.fields[columnIndex]?.map((field) => (
                      <div key={field.id} className="mb-4">
                        {renderField(field)}
                        {renderFieldControls(section.id, columnIndex, field)}
                      </div>
                    ))}
                  </div>
                ))}
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