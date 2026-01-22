export type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'signature';

export interface FormField {
  id: string;
  label: string;
  value: string;
  type: FieldType;
  boxCount?: number;
  checked?: boolean; // For checkboxes
  options?: string[]; // For checkbox groups
  helpText?: string; // Optional helping text below field label
  width?: string; // Optional custom width
  height?: string; // Optional custom height
  showPhoto?: boolean; // For combined signature/photo field
  showSignature?: boolean; // For combined signature/photo field
}

export interface Section {
  id: string;
  title: string;
  fields: FormField[];
}

export interface HeaderConfig {
  logoText: string;
  logoHighlight: string;
  subHeader: string[]; // Array for multi-line support
  companyName: string;
  formTitle: string;
  disclaimer: string;
  applicationDate?: string; // Optional editable field
  applicationNumber?: string; // Optional editable field
}

export interface Page {
  id: string;
  header?: HeaderConfig; // Kept optional for compatibility logic
  sections: Section[];
}

// Flattened state means we don't strictly need Page interface for state, 
// but we might use it for the allocated layout.
export interface AllocatedPage {
  pageNumber: number;
  items: (Section | 'header')[];
}
