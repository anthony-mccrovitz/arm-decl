
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { translateText, TranslationMode } from '@/api/translate';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface TranslationFormProps {
  onResultReceived: (result: string) => void;
  currentMode: TranslationMode;
  onModeChange: (mode: TranslationMode) => void;
  inputText: string;
  setInputText: (text: string) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ 
  onResultReceived, 
  currentMode,
  onModeChange,
  inputText,
  setInputText
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-translate if input text is provided (for examples)
    if (inputText.trim()) {
      handleSubmit(new Event('auto') as unknown as React.FormEvent);
    }
  }, [inputText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to translate.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await translateText({
        text: inputText,
        mode: currentMode
      });
      
      if (response.success) {
        onResultReceived(response.result);
      } else {
        toast({
          title: "Translation failed",
          description: response.error || "An error occurred during translation.",
          variant: "destructive"
        });
        onResultReceived("Sorry, that instruction isn't supported yet.");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      onResultReceived("Sorry, that instruction isn't supported yet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (value: string) => {
    // Clear input and result on mode change
    setInputText('');
    onResultReceived('');
    onModeChange(value as TranslationMode);
  };

  const getInputPlaceholder = () => {
    return currentMode === 'toEnglish' 
      ? 'Enter ARMv8 instruction(s)...\nExample: ADD X1, X2, X3' 
      : 'Describe the operation in English...\nExample: Add X2 and X3 and store in X1';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs 
        value={currentMode}
        onValueChange={handleModeChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="toEnglish">ARMv8 → English</TabsTrigger>
          <TabsTrigger value="toArm">English → ARMv8</TabsTrigger>
        </TabsList>
        
        <TabsContent value="toEnglish" className="mt-3 space-y-1">
          <label htmlFor="armInput" className="text-sm font-medium">
            ARMv8 Instruction:
          </label>
          <Textarea
            id="armInput"
            placeholder={getInputPlaceholder()}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="code-font input-style h-16"
          />
        </TabsContent>
        
        <TabsContent value="toArm" className="mt-3 space-y-1">
          <label htmlFor="englishInput" className="text-sm font-medium">
            English Description:
          </label>
          <Textarea
            id="englishInput"
            placeholder={getInputPlaceholder()}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input-style h-16"
          />
        </TabsContent>
      </Tabs>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>
    </form>
  );
};

export default TranslationForm;
