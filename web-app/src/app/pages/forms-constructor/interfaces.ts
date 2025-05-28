import { UUIDTypes } from "uuid";
import {UserProfile} from '@services/auth.service';
import {FormElement} from '@pages/forms-constructor/create-form/models';

export interface ConstructorComponent {
  id: UUIDTypes;
  data: Object;
}

export enum DomainStatus {
  ACTIVE='ACTIVE',
  NOT_ACTIVE='NOT_ACTIVE'
}

export interface Domain {
  id: UUIDTypes;
  partner: Partner;
  code: string;
  url: string;
  status: DomainStatus
}

export interface Partner {
  id: UUIDTypes;
  name: string;
  login?: string;
  phone_number?: string;
  email?: string;
  domain?: Domain;
  logo?: string;
  person_contact?: string;
  category?: string;
  inn?: string;
  is_active?: boolean;
  created_at?: Date;
  source?: string;
}

export interface FormSettings {
  type: 'button' | 'logo' | 'normal';
  button?: {
    background: string;
    text: string;
    size: 'sm' | 'md' | 'lg';
    textColor: string;
    fontSize: 'sm' | 'md' | 'lg';
    hasShadow: boolean;
    isRounded: boolean;
  };
  logo?: {
    image: string;
    size: 'sm' | 'md' | 'lg';
    isCircle: boolean;
  };
}

export interface FormConstructor {
  id: UUIDTypes;
  title: string;
  partner: Partner;
  user: UserProfile;
  created_at?: Date;
  components_total?: number;
  components?: FormElement[];
  settings?: FormSettings;
  domain?: Domain
}
