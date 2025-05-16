import {FormConstructor} from '@pages/forms-constructor/interfaces';

export interface FormElementOption {
  id: string;
  value: string;
}

export interface FormElement {
  id: string;
  type: 'heading' | 'paragraph' | 'textfield' | 'phone' | 'dropdown' | 'radio' | 'checkbox' | 'image' | 'video' | 'info';
  label: string;
  description: string;
  icon?: string;
  placeholder?: string;
  options?: FormElementOption[];
  required?: boolean;
  isSelected?: boolean;
  newOptionValue?: string;
  value?: string;
  file?: File;
  defaultValue?: string;
}

export interface PartnerForm {
  id: string;
  title: string;
  data: FormConstructor[];
}
