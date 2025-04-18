# ARMDecl 🧠🔧  
A natural language ↔ assembly translator for ARMv8, built for students, developers, and educators.  
Translate between plain English and ARMv8 assembly instructions — no syntax memorization needed.

## 🚀 About

**ARMDecl** is a tool that helps you understand and write ARMv8 assembly by letting you:
- Translate ARMv8 instructions into plain English
- Write natural English and see the corresponding ARMv8 instruction
- Quickly test, debug, and learn new instructions

This project was built as a CS 250-inspired tool at Purdue to help beginners learn ARMv8 syntax with ease.

---

## ✨ Features (v1.2)
- 🔁 **Bidirectional Translation**: English ⇄ ARMv8 instructions
- 📚 **Instruction Support**: ADD, SUB, LSL, LSR, MUL, AND, ORR, EOR, LDUR, STUR, CBZ, CBNZ, BL, B, RET
- 🔍 **Fuzzy Matching** for English queries (e.g., “add X2 and X3” → `ADD X1, X2, X3`)
- 📋 **Multi-line Input** support (up to 3 lines of ARMv8)
- ✅ **Purdue Instruction Set** (`LDUR`, `STUR` used instead of `LDR`/`STR`)
- 🔄 **Copy buttons**, example suggestions, input reset on tab switch
- 📱 **Responsive UI** with horizontal scroll and mobile-friendly layout

---

## 🛠️ Tech Stack
- **React + TypeScript**
- **Tailwind CSS**
- **Vite**
- **ShadCN UI Components**
- Regex-based translation logic

---

## 🧪 Run Locally

Clone and run the project locally:

```bash
git clone https://github.com/anthony-mccrovitz/arm-decl.git
cd arm-decl
npm install
npm run dev
