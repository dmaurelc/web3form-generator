import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NumberIncrementField = ({ field, updateField }) => {
  const increment = () => {
    updateField(field.id, { value: (field.value || 0) + (field.step || 1) });
  };

  const decrement = () => {
    updateField(field.id, { value: (field.value || 0) - (field.step || 1) });
  };

  return (
    <div className="mb-4">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
      <div className="flex items-center">
        <Button onClick={decrement} variant="outline" size="icon">-</Button>
        <Input
          type="number"
          id={field.id}
          value={field.value || 0}
          onChange={(e) => updateField(field.id, { value: parseFloat(e.target.value) })}
          className="mx-2"
        />
        <Button onClick={increment} variant="outline" size="icon">+</Button>
      </div>
    </div>
  );
};

export default NumberIncrementField;