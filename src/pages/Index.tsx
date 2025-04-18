
import React, { useState } from 'react';
import Header from '@/components/Header';
import TranslationForm from '@/components/TranslationForm';
import ResultDisplay from '@/components/ResultDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { TranslationMode } from '@/api/translate';
import ExamplesSection from '@/components/ExamplesSection';

const Index: React.FC = () => {
  const [result, setResult] = useState('');
  const [currentMode, setCurrentMode] = useState<TranslationMode>('toEnglish');
  const [inputText, setInputText] = useState('');

  const handleModeChange = (mode: TranslationMode) => {
    setCurrentMode(mode);
    setResult('');
    setInputText('');
  };

  const handleExampleClick = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <ExamplesSection 
                currentMode={currentMode} 
                onExampleClick={handleExampleClick} 
              />
              
              <TranslationForm 
                onResultReceived={setResult}
                currentMode={currentMode}
                onModeChange={handleModeChange}
                inputText={inputText}
                setInputText={setInputText}
              />
              
              <div className="mt-6">
                <ResultDisplay 
                  result={result} 
                  translationMode={currentMode} 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-5 text-sm text-muted-foreground">
            <h3 className="font-medium mb-1">Supported Instructions:</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1 list-disc list-inside">
              <li>ADD, SUB, MUL</li>
              <li>ADDI, SUBI</li>
              <li>AND, ORR, EOR</li>
              <li>MOV, LSL, LSR</li>
              <li>LDUR, STUR</li>
              <li>B, BL, RET</li>
              <li>CBZ, CBNZ</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="py-3 px-4 border-t border-border mt-5">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          <p>ARMDecl - ARMv8 Assembly ↔ English Translator</p>
          <p className="mt-1">Inspired by <a href="https://cdecl.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CDecl.org</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
