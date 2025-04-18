
// Type definitions
type TranslationMap = {
  [key: string]: string;
};

// ARMv8 to English translations
const armToEnglishMap: TranslationMap = {
  // Arithmetic operations
  'ADD': 'Add {2} and {3} and store the result in {1}',
  'SUB': 'Subtract {3} from {2} and store the result in {1}',
  'MUL': 'Multiply {2} by {3} and store the result in {1}',
  'ADDI': 'Add immediate value {3} to {2} and store the result in {1}',
  'SUBI': 'Subtract immediate value {3} from {2} and store the result in {1}',
  
  // Logic operations
  'AND': 'Perform bitwise AND between {2} and {3} and store the result in {1}',
  'ORR': 'Perform bitwise OR between {2} and {3} and store the result in {1}',
  'EOR': 'Perform bitwise XOR between {2} and {3} and store the result in {1}',
  
  // Move & Shift operations
  'MOV': 'Move the value in {2} to {1}',
  'LSL': 'Logical shift left {2} by {3} bits and store the result in {1}',
  'LSR': 'Logical shift right {2} by {3} bits and store the result in {1}',
  
  // Memory operations
  'LDR': 'Load the value from memory address at {2} into {1}',
  'STR': 'Store the value in {1} into memory address at {2}',
  'LDUR': 'Load the value from memory address at {2} into {1}',
  'STUR': 'Store the value in {1} into memory address at {2}',
  
  // Branching operations
  'B': 'Branch to {1}',
  'BL': 'Branch to {1} and save the return address in the link register',
  'RET': 'Return to the address stored in the link register',
  'CBZ': 'Compare {1} to zero and branch to {2} if equal',
  'CBNZ': 'Compare {1} to zero and branch to {2} if not equal',
};

// Function to handle multiple lines of ARM code
export const translateToEnglish = (armCode: string): string => {
  if (!armCode.trim()) return 'Please enter an ARMv8 instruction.';
  
  // Split input by newlines to handle multiple instructions
  const instructions = armCode.split('\n').filter(line => line.trim());
  
  if (instructions.length === 0) {
    return 'Please enter an ARMv8 instruction.';
  }
  
  // Process each instruction separately
  const translations = instructions.map(instruction => {
    const parsedInstruction = parseArmInstruction(instruction);
    if (!parsedInstruction) return `Invalid format: ${instruction}`;
    
    const { opcode, args } = parsedInstruction;
    
    if (!armToEnglishMap[opcode]) {
      return `Unknown instruction: ${opcode}`;
    }
    
    let translation = armToEnglishMap[opcode];
    
    // Replace placeholders with actual arguments
    for (let i = 0; i < args.length; i++) {
      translation = translation.replace(`{${i+1}}`, args[i]);
    }
    
    return translation + '.';
  });
  
  // Join translations with line breaks if multiple
  return translations.join('\n');
};

// Utility function to parse ARMv8 instruction
const parseArmInstruction = (instruction: string): { 
  opcode: string,
  args: string[]
} | null => {
  const cleanedInstruction = instruction.trim().toUpperCase();
  
  // Handle memory operations with offsets (LDR, LDUR, STR, STUR)
  const memMatch = cleanedInstruction.match(/^(LDR|LDUR|STR|STUR)\s+([XR][0-9]+),\s*\[([XR][0-9]+)(?:,\s*#([0-9]+))?\]/i);
  if (memMatch) {
    const [fullMatch, opcode, dest, base, offset] = memMatch;
    if (offset) {
      return { 
        opcode, 
        args: [dest, `${base} + ${offset}`]
      };
    } else {
      return {
        opcode,
        args: [dest, base]
      };
    }
  }
  
  // Handle LSL, LSR with immediate values
  const shiftMatch = cleanedInstruction.match(/^(LSL|LSR)\s+([XR][0-9]+),\s*([XR][0-9]+),\s*#([0-9]+)/i);
  if (shiftMatch) {
    const [fullMatch, opcode, dest, reg, bits] = shiftMatch;
    return {
      opcode,
      args: [dest, reg, bits]
    };
  }
  
  // Handle ADD, SUB with immediate values
  const immMatch = cleanedInstruction.match(/^(ADDI|SUBI)\s+([XR][0-9]+),\s*([XR][0-9]+),\s*#([0-9]+)/i);
  if (immMatch) {
    const [fullMatch, opcode, dest, src, imm] = immMatch;
    return {
      opcode,
      args: [dest, src, imm]
    };
  }
  
  // Handle RET instruction (no arguments)
  if (cleanedInstruction.match(/^RET$/i)) {
    return {
      opcode: 'RET',
      args: []
    };
  }
  
  // Handle branch instructions with single label argument
  const branchMatch = cleanedInstruction.match(/^(B|BL)\s+(\w+)/i);
  if (branchMatch) {
    const [fullMatch, opcode, label] = branchMatch;
    return {
      opcode,
      args: [label]
    };
  }
  
  // Handle conditional branches
  const condBranchMatch = cleanedInstruction.match(/^(CBZ|CBNZ)\s+([XR][0-9]+),\s*(\w+)/i);
  if (condBranchMatch) {
    const [fullMatch, opcode, reg, label] = condBranchMatch;
    return {
      opcode,
      args: [reg, label]
    };
  }
  
  // Generic parsing for other instructions
  const match = cleanedInstruction.match(/^([A-Z]+)(.*)$/);
  if (!match) return null;
  
  const opcode = match[1];
  const argsStr = match[2].trim();
  let args: string[] = [];
  
  if (argsStr) {
    args = argsStr.split(',').map(arg => arg.trim());
  }
  
  return { opcode, args };
};

// Enhanced English to ARMv8 translation with more flexible matching
export const translateToArm = (englishText: string): string => {
  if (!englishText.trim()) return 'Please enter an English description.';
  
  // Split input by newlines or periods to handle multiple instructions
  const sentences = englishText
    .split(/\.\s*|\n/)
    .map(s => s.trim())
    .filter(Boolean);
  
  if (sentences.length === 0) {
    return 'Please enter an English description.';
  }
  
  // Process each instruction separately
  const translations = sentences.map(sentence => {
    const lowerText = sentence.toLowerCase();
    
    // ADD pattern - more flexible matching
    if (/add|sum|plus|addition/.test(lowerText) && 
        /store|save|put|place|into/.test(lowerText)) {
      // Try to extract registers
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        return `ADD ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // SUB pattern
    if (/subtract|minus|subtraction|difference/.test(lowerText) && 
        /from|between/.test(lowerText) &&
        /store|save|put|place|into/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        // In subtraction, word order matters for operand order
        const fromIndex = lowerText.indexOf('from');
        const firstRegIndex = lowerText.indexOf(regs[0].toLowerCase());
        const secondRegIndex = lowerText.indexOf(regs[1].toLowerCase());
        
        if (fromIndex > 0 && firstRegIndex > 0 && secondRegIndex > 0) {
          if (firstRegIndex < fromIndex && secondRegIndex > fromIndex) {
            return `SUB ${regs[2]}, ${regs[1]}, ${regs[0]}`;
          } else {
            return `SUB ${regs[2]}, ${regs[0]}, ${regs[1]}`;
          }
        }
        
        // Default order if we can't determine
        return `SUB ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // MUL pattern
    if (/multiply|multiplication|product|times/.test(lowerText) && 
        /store|save|put|place|into/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        return `MUL ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // AND pattern
    if (/bitwise\s+and|and\s+operation|logical\s+and/.test(lowerText) && 
        /store|save|put|place|into/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        return `AND ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // ORR pattern
    if (/bitwise\s+or|or\s+operation|logical\s+or/.test(lowerText) && 
        /store|save|put|place|into/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        return `ORR ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // EOR/XOR pattern
    if (/bitwise\s+xor|xor\s+operation|logical\s+xor|exclusive\s+or/.test(lowerText) && 
        /store|save|put|place|into/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 3) {
        return `EOR ${regs[2]}, ${regs[0]}, ${regs[1]}`;
      }
    }
    
    // MOV pattern
    if (/move|copy|transfer/.test(lowerText) && 
        /to|into/.test(lowerText) && 
        !/memory|address/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      if (regs.length >= 2) {
        return `MOV ${regs[1]}, ${regs[0]}`;
      }
    }
    
    // LSL pattern - IMPROVED REGEX
    if (/(?:logical\s+)?shift\s+(?:left|leftward)|(?:left\s+shift)/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      // Look for a number pattern like "2 bits", "by 2", "by 2 bits"
      const bitMatch = lowerText.match(/by\s*(\d+)(?:\s+bits)?|(\d+)\s+bits/);
      const bits = bitMatch ? (bitMatch[1] || bitMatch[2]) : "0";
      
      if (regs.length >= 2) {
        // In LSL X7, X2, #2 - the first reg is destination, second is source
        // Find which register comes first in the text
        const firstRegIndex = lowerText.indexOf(regs[0].toLowerCase());
        const secondRegIndex = lowerText.indexOf(regs[1].toLowerCase());
        
        if (firstRegIndex >= 0 && secondRegIndex >= 0) {
          // If destination is mentioned after the source
          if (firstRegIndex < secondRegIndex && 
              /(?:store|save|place|put)\s+(?:in|into|to)/.test(lowerText)) {
            return `LSL ${regs[1]}, ${regs[0]}, #${bits}`;
          } else {
            return `LSL ${regs[1]}, ${regs[0]}, #${bits}`;
          }
        }
        
        // Default ordering 
        return `LSL ${regs[1]}, ${regs[0]}, #${bits}`;
      }
    }
    
    // LSR pattern - IMPROVED REGEX
    if (/(?:logical\s+)?shift\s+(?:right|rightward)|(?:right\s+shift)/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      // Look for a number pattern like "2 bits", "by 2", "by 2 bits"
      const bitMatch = lowerText.match(/by\s*(\d+)(?:\s+bits)?|(\d+)\s+bits/);
      const bits = bitMatch ? (bitMatch[1] || bitMatch[2]) : "0";
      
      if (regs.length >= 2) {
        // Similar logic as LSL for determining register order
        const firstRegIndex = lowerText.indexOf(regs[0].toLowerCase());
        const secondRegIndex = lowerText.indexOf(regs[1].toLowerCase());
        
        if (firstRegIndex >= 0 && secondRegIndex >= 0) {
          // If destination is mentioned after the source
          if (firstRegIndex < secondRegIndex && 
              /(?:store|save|place|put)\s+(?:in|into|to)/.test(lowerText)) {
            return `LSR ${regs[1]}, ${regs[0]}, #${bits}`;
          } else {
            return `LSR ${regs[1]}, ${regs[0]}, #${bits}`;
          }
        }
        
        // Default ordering
        return `LSR ${regs[1]}, ${regs[0]}, #${bits}`;
      }
    }
    
    // LDUR pattern (preferred over LDR)
    if (/load|read|get/.test(lowerText) && /value|data|content/.test(lowerText) && 
        /from|at/.test(lowerText) && /memory|address/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      const offsetMatch = lowerText.match(/([xr]\d+)\s*\+\s*(\d+)/i);
      
      if (regs.length >= 2) {
        if (offsetMatch) {
          return `LDUR ${regs[1]}, [${regs[0]}, #${offsetMatch[2]}]`;
        }
        return `LDUR ${regs[1]}, [${regs[0]}]`;
      }
    }
    
    // STUR pattern (preferred over STR)
    if (/store|write|save|put/.test(lowerText) && 
        /into|to|at/.test(lowerText) && 
        /memory|address/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      const offsetMatch = lowerText.match(/([xr]\d+)\s*\+\s*(\d+)/i);
      
      if (regs.length >= 2) {
        if (offsetMatch) {
          return `STUR ${regs[0]}, [${regs[1]}, #${offsetMatch[2]}]`;
        }
        return `STUR ${regs[0]}, [${regs[1]}]`;
      }
    }
    
    // B pattern
    if (/branch\s+to|jump\s+to/.test(lowerText) && 
        !/save|link|return/.test(lowerText)) {
      const labelMatch = extractLabel(lowerText);
      if (labelMatch) {
        return `B ${labelMatch}`;
      }
    }
    
    // BL pattern
    if (/branch|jump|call/.test(lowerText) && 
        /save|link|return address/.test(lowerText)) {
      const labelMatch = extractLabel(lowerText);
      if (labelMatch) {
        return `BL ${labelMatch}`;
      }
    }
    
    // RET pattern - IMPROVED REGEX
    if (/\breturn\b|\bret\b/.test(lowerText)) {
      // More flexible matching - just need the word "return" in various contexts
      return `RET`;
    }
    
    // CBZ pattern
    if (/compare|if/.test(lowerText) && 
        /zero|equals 0|is 0|equals zero|is zero/.test(lowerText) && 
        /branch|jump/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      const labelMatch = extractLabel(lowerText);
      
      if (regs.length >= 1 && labelMatch) {
        return `CBZ ${regs[0]}, ${labelMatch}`;
      }
    }
    
    // CBNZ pattern
    if (/compare|if/.test(lowerText) && 
        /not zero|not equals 0|isn't 0|is not zero|isn't zero/.test(lowerText) && 
        /branch|jump/.test(lowerText)) {
      const regs = extractRegisters(lowerText);
      const labelMatch = extractLabel(lowerText);
      
      if (regs.length >= 1 && labelMatch) {
        return `CBNZ ${regs[0]}, ${labelMatch}`;
      }
    }
    
    // If nothing matched, return a generic message
    return 'Could not determine the appropriate ARMv8 instruction.';
  });
  
  // Join translations if multiple
  return translations.join('\n');
};

// Improved helper to extract register references
const extractRegisters = (text: string): string[] => {
  // Match any register references like X0, X1, x2, etc.
  const regMatches = Array.from(text.matchAll(/\b([xr])(\d+)\b/gi));
  
  // Deduplicate and format registers
  const uniqueRegs = [...new Set(regMatches.map(match => match[0].toUpperCase()))];
  return uniqueRegs;
};

// Helper to extract labels
const extractLabel = (text: string): string | null => {
  // Look for words that might be labels
  const labelMatch = text.match(/\b(to|at)\s+(\w+)(\s|$)/i);
  if (labelMatch && labelMatch[2]) {
    // Filter out common words that shouldn't be labels
    const nonLabels = ["the", "a", "an", "address", "value", "register", "memory"];
    if (!nonLabels.includes(labelMatch[2].toLowerCase())) {
      return labelMatch[2];
    }
  }
  
  // Default to 'label' if no specific label found
  if (/label|target/i.test(text)) {
    return "label";
  }
  
  return null;
};
