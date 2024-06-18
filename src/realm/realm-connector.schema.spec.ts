
import Realm from "realm";
export type forms = {
    _id: Realm.BSON.ObjectId;
    _partitionKey: string;
    active?: boolean;
    collection?: string;
    created_at?: Date;
    created_by?: Realm.BSON.ObjectId;
    deleted_at?: Date;
    extras: Realm.List<forms_extras>;
    sections: Realm.List<forms_sections>;
    status?: string;
    updated_at?: Date;
  };
  
  export const formsSchema = {
    name: 'forms',
    properties: {
      _id: 'objectId',
      _partitionKey: 'string',
      active: 'bool?',
      collection: 'string?',
      created_at: 'date?',
      created_by: 'objectId?',
      deleted_at: 'date?',
      extras: 'forms_extras[]',
      sections: 'forms_sections[]',
      status: 'string?',
      updated_at: 'date?',
    },
    primaryKey: '_id',
  };
  
  export type forms_extras = {
    key?: string;
    updated_at?: Date;
    values: Realm.List<forms_extras_values>;
  };
  
  export const forms_extrasSchema = {
    name: 'forms_extras',
    embedded: true,
    properties: {
      key: 'string?',
      updated_at: 'date?',
      values: 'forms_extras_values[]',
    },
  };
  
  export type forms_extras_values = {
    collection?: string;
    value?: string;
    value_id?: Realm.BSON.ObjectId;
    value_type?: string;
  };
  
  export const forms_extras_valuesSchema = {
    name: 'forms_extras_values',
    embedded: true,
    properties: {
      collection: 'string?',
      value: 'string?',
      value_id: 'objectId?',
      value_type: 'string?',
    },
  };
  
  export type forms_sections = {
    fields: Realm.List<forms_sections_fields>;
    seccion_name: Realm.Dictionary<string>;
  };
  
  export const forms_sectionsSchema = {
    name: 'forms_sections',
    embedded: true,
    properties: {
      fields: 'forms_sections_fields[]',
      seccion_name: 'string{}',
    },
  };
  
  export type forms_sections_fields = {
    icon: Realm.Dictionary<string>;
    key?: string;
    labels: Realm.Dictionary<string>;
    options?: forms_sections_fields_options;
    place_holder: Realm.Dictionary<string>;
    principal?: boolean;
    rules: Realm.Dictionary<any>;
    rules_errors: Realm.List<forms_sections_fields_rules_errors>;
    type?: string;
  };
  
  export const forms_sections_fieldsSchema = {
    name: 'forms_sections_fields',
    embedded: true,
    properties: {
      icon: 'string{}',
      key: 'string?',
      labels: 'string{}',
      options: 'forms_sections_fields_options',
      place_holder: 'string{}',
      principal: 'bool?',
      rules: '{}',
      rules_errors: 'forms_sections_fields_rules_errors[]',
      type: 'string?',
    },
  };
  
  export type forms_sections_fields_options = {
    catalog?: string;
    is_catalog?: boolean;
    values: Realm.List<forms_sections_fields_options_values>;
  };
  
  export const forms_sections_fields_optionsSchema = {
    name: 'forms_sections_fields_options',
    embedded: true,
    properties: {
      catalog: 'string?',
      is_catalog: 'bool?',
      values: 'forms_sections_fields_options_values[]',
    },
  };
  
  export type forms_sections_fields_options_values = {
    key?: string;
    value: Realm.Dictionary<string>;
  };
  
  export const forms_sections_fields_options_valuesSchema = {
    name: 'forms_sections_fields_options_values',
    embedded: true,
    properties: {
      key: 'string?',
      value: 'string{}',
    },
  };
  
  export type forms_sections_fields_rules_errors = {
    message: Realm.Dictionary<string>;
    type?: string;
  };
  
  export const forms_sections_fields_rules_errorsSchema = {
    name: 'forms_sections_fields_rules_errors',
    embedded: true,
    properties: {
      message: 'string{}',
      type: 'string?',
    },
  };

  export default [formsSchema, forms_extrasSchema, forms_extras_valuesSchema, forms_sectionsSchema, forms_sections_fieldsSchema, forms_sections_fields_optionsSchema, forms_sections_fields_options_valuesSchema, forms_sections_fields_rules_errorsSchema];