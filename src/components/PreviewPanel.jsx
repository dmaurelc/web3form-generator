import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { generateFormCode } from '../utils/formGenerator';

const PreviewPanel = ({ formConfig }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const formCode = generateFormCode(formConfig);

  const copyCode = () => {
    navigator.clipboard.writeText(formCode);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: formCode }} />
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