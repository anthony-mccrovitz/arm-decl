
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownCircle, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface ResultDisplayProps {
  result: string;
  translationMode: 'toEnglish' | 'toArm';
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, translationMode }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard', {
      position: 'bottom-right',
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-3 text-muted-foreground">
        <ArrowDownCircle className="mb-1 h-5 w-5" />
        <p className="text-sm">Your translation results will appear here</p>
      </div>
    );
  }

  // Split the result by new lines to handle multi-line translations
  const resultLines = result.split('\n');

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">
          {translationMode === 'toEnglish' ? 'English Translation' : 'ARMv8 Instruction'}
        </h3>
        
        <Button 
          onClick={handleCopy} 
          variant="outline" 
          size="sm" 
          aria-label="Copy to clipboard"
          className="h-7 px-2 py-1"
        >
          {copied ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardContent className={`p-3 ${translationMode === 'toArm' ? 'code-font' : ''}`}>
          {resultLines.map((line, index) => (
            <div key={index} className={`text-center ${index > 0 ? 'mt-2 pt-2 border-t' : ''}`}>
              {line}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDisplay;
