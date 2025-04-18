
import React from 'react';
import { Button } from '@/components/ui/button';
import { TranslationMode } from '@/api/translate';
import { Card, CardContent } from '@/components/ui/card';

interface ExamplesSectionProps {
  currentMode: TranslationMode;
  onExampleClick: (text: string) => void;
}

const ExamplesSection: React.FC<ExamplesSectionProps> = ({ currentMode, onExampleClick }) => {
  const armExamples = [
    { text: 'ADD X1, X2, X3', description: 'Basic addition' },
    { text: 'SUB X5, X4, X3', description: 'Subtraction' },
    { text: 'LSL X7, X2, #2', description: 'Shift left by 2 bits' },
    { text: 'LDUR X1, [X2, #8]', description: 'Load from memory with offset' },
    { text: 'STUR X3, [X4, #16]', description: 'Store to memory with offset' },
    { text: 'CBNZ X1, label', description: 'Branch if not zero' },
    { text: 'MUL X6, X1, X2', description: 'Multiply registers' },
  ];

  const englishExamples = [
    { text: 'Add X2 and X3 and store in X1', description: 'Basic addition' },
    { text: 'Subtract X3 from X4 and store in X5', description: 'Subtraction' },
    { text: 'Shift X2 left by 2 bits and store in X7', description: 'Shift left' },
    { text: 'Load value from memory at X2 + 8 into X1', description: 'Load with offset' },
    { text: 'Store value in X3 into memory at X4 + 16', description: 'Store with offset' },
    { text: 'If X1 is not zero, jump to label', description: 'Conditional branch' },
    { text: 'Multiply X1 by X2 and store result in X6', description: 'Multiplication' },
  ];

  const examples = currentMode === 'toEnglish' ? armExamples : englishExamples;

  return (
    <Card className="mb-4 bg-muted/40">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">Try Examples:</p>
        </div>
        
        {/* Horizontally scrollable examples */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2 min-w-max">
            {examples.map((example, index) => (
              <Button 
                key={index} 
                variant="outline"
                size="sm"
                className="h-auto py-1 text-left bg-background hover:bg-muted text-xs whitespace-nowrap"
                onClick={() => onExampleClick(example.text)}
                title={example.description}
              >
                <span className={currentMode === 'toEnglish' ? 'code-font' : ''}>
                  {example.text.length > 25 ? example.text.substring(0, 25) + '...' : example.text}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamplesSection;
