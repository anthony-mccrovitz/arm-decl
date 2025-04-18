
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-6 border-b border-border">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-primary">ARM</span>Decl
          </h1>
          <p className="text-muted-foreground text-sm">
            Translate between ARMv8 assembly instructions and plain English.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
