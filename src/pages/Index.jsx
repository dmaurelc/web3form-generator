import React from 'react';
import FormBuilder from '../components/FormBuilder';

const Index = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Web3Form Generator</h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <FormBuilder />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} Web3Form Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;