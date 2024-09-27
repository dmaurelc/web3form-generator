import React from 'react';
import { Slider } from "@/components/ui/slider";

const SliderField = ({ field, updateField }) => {
  return (
    <div className="mb-4">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
      <Slider
        id={field.id}
        min={field.min || 0}
        max={field.max || 100}
        step={field.step || 1}
        value={[field.value || 0]}
        onValueChange={(value) => updateField(field.id, { value: value[0] })}
      />
      <span className="text-sm text-gray-500">Valor: {field.value || 0}</span>
    </div>
  );
};

export default SliderField;