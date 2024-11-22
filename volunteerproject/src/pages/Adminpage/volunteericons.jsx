import React from 'react';

const IconWrapper = ({ children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const ButtonIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </IconWrapper>
);
export const Table = ({ children, className, ...props }) => (
    <table className={`w-full border-collapse ${className}`} {...props}>{children}</table>
  );
  
  export const TableBody = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
  
  export const TableCell = ({ children, className, ...props }) => (
    <td className={`p-2 border border-gray-200 ${className}`} {...props}>{children}</td>
  );
  
  export const TableHead = ({ children, ...props }) => <thead className="bg-gray-100" {...props}>{children}</thead>;
  
  export const TableHeader = ({ children, className, ...props }) => (
    <th className={`p-2 text-left font-semibold border border-gray-200 ${className}`} {...props}>{children}</th>
  );
  
  export const TableRow = ({ children, ...props }) => <tr {...props}>{children}</tr>;
  
  export const Dialog = ({ children, ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div {...props}>
        {React.Children.map(children, child =>
          React.cloneElement(child, { isOpen, setIsOpen })
        )}
      </div>
    );
  };
  
  export const DialogTrigger = ({ children, setIsOpen }) => (
    <div onClick={() => setIsOpen(true)}>{children}</div>
  );
  
  export const DialogContent = ({ children, isOpen, setIsOpen }) => isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        {children}
        <button onClick={() => setIsOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
      </div>
    </div>
  ) : null;
export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogTitle = ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>;
export const DialogDescription = ({ children }) => <p className="text-gray-600">{children}</p>;
export const DialogFooter = ({ children }) => <div className="mt-4 flex justify-end">{children}</div>;
export const Select = ({ children, className, ...props }) => (
    <select 
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ children, ...props }) => <option {...props}>{children}</option>;
export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = ({ children }) => <>{children}</>;
export const Button = ({ children, className, ...props }) => (
    <button 
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

export const TableIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </IconWrapper>
);

export const DialogIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
    <line x1="15" y1="21" x2="15" y2="9" />
  </IconWrapper>
);

export const InputIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </IconWrapper>
);

export const LabelIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M7 7H17" />
    <path d="M7 12H17" />
    <path d="M7 17H13" />
  </IconWrapper>
);

export const SelectIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <polyline points="9 11 12 14 15 11" />
  </IconWrapper>
);

export const Edit = (props) => (
  <IconWrapper {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </IconWrapper>
);

export const Trash2 = (props) => (
  <IconWrapper {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </IconWrapper>
);

export const Download = (props) => (
  <IconWrapper {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </IconWrapper>
);