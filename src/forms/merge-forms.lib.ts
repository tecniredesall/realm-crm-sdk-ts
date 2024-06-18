/**
 * FieldAttribute
 * @param name: Attribute that will be used to validate.
 *           e.g SectionsFieldsSpecificTypeApp || SectionsFieldsSpecificTypeType
 * @param value: Value of the attribute that will be to validate.
 *          e.g  trumudity | transformaciones || buyer | seller
 * @param regex: Apply the rule based on regex
 *
 */
 export type FieldAttribute = {
  name: string;
  value: any;
  regex?: boolean;
};

export enum FieldAttributeFilters {
  SpecificType = 'specific_type.*.type',
  SpecificApp = 'specific_type.*.app',
}

export type FilterForm = {
  filterFields?: Array<FieldAttribute>;
  groupFieldsInArray?: boolean;
  groupedFields?: boolean;
};

export class MergeForms {
  private forms: Array<unknown>;
  protected searches: Array<unknown>;

  private publicPartitionKey: string;
  private privatePartitionKey: string;

  constructor() {
    this.forms = [];
    this.searches = [];
    this.publicPartitionKey = 'public';
  }

  public getSearch(filters: object, connector = 'mongo') {
    this.privatePartitionKey = filters['_partitionKey'];
    let hasExtraForm = false;
    if (Object.keys(filters).includes("extra_form")) {
      delete filters["extra_form"];
      hasExtraForm = true;
    }

    const searchPool: Array<object> = [];

    if (filters['target'] && filters['context']) {
      // With Target & Context
      const extraFilters = { context: { $exists: false } };
      const filterTargetContext: object = { ...filters };
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: filterTargetContext,
      });
      const filterTarget: object = { ...filters };
      delete filterTarget['context'];
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: { ...filterTarget, ...extraFilters },
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterTargetContext,
          _partitionKey: this.publicPartitionKey,
        },
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterTarget,
          ...extraFilters,
          _partitionKey: this.publicPartitionKey,
        },
      });
    } else if (filters['target'] && !filters['context']) {
      // With Target
      const extraFilters = { context: { $exists: false } };
      const filterWithoutTarget: object = { ...filters, ...extraFilters };
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: filterWithoutTarget,
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterWithoutTarget,
          _partitionKey: this.publicPartitionKey,
        },
      });
    } else if (filters['context'] && !filters['target']) {
      // With context
      const extraFilters = { context: { $exists: false } };
      const filterTargetContext: object = {
        ...filters,
        target: { $exists: false },
      };
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: filterTargetContext,
      });
      const filterTarget: object = { ...filters };
      delete filterTarget['context'];
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: { ...filterTarget, ...extraFilters },
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterTargetContext,
          _partitionKey: this.publicPartitionKey,
        },
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterTarget,
          ...extraFilters,
          _partitionKey: this.publicPartitionKey,
        },
      });
    } else {
      // Without Target & Context
      const extraFilters = {
        context: { $exists: false },
        target: { $exists: false },
      };
      const filterWithoutTargetContext: object = {
        ...filters,
        ...extraFilters,
      };
      searchPool.push({
        searchOn: this.privatePartitionKey,
        filters: filterWithoutTargetContext,
      });
      searchPool.push({
        searchOn: this.publicPartitionKey,
        filters: {
          ...filterWithoutTargetContext,
          _partitionKey: this.publicPartitionKey,
        },
      });
    }

    // Extra Forms
    if (hasExtraForm) {
      searchPool.push({
        searchOn: this.publicPartitionKey,
        extraForm: true,
        filters: {
          _partitionKey: this.publicPartitionKey,
          coll_name: filters["coll_name"],
          context: { $exists: false },
          target: { $exists: false },
        }
      })
    }

    if (connector == 'realm') {
      const searchPoolRealm: Array<any> = [];
      searchPool.forEach((element) => {
        const search = element;
        search['filters'] = this.mongoToRealmQuery(search['filters']);
        searchPoolRealm.push(search);
      });
      return searchPoolRealm;
    }
    return searchPool;
  }

  private mongoToRealmQuery(mongoQuery: object): string {
    let output = '';

    const sizeQuery = Object.keys(mongoQuery).length;
    Object.keys(mongoQuery).forEach((key, index) => {
      const value = mongoQuery[key];
      const oper = index < sizeQuery - 1 ? 'AND' : '';
      if (typeof value == 'object') {
        if (Object.keys(value).indexOf('$exists') >= 0) {
          if (key == 'context') {
            output += `${key}.@count = 0 ${oper} `;
          } else {
            if (value['$exists'] == false) {
              output += `${key} = null ${oper} `;
            }
          }
        }
      } else if (typeof value == 'string') {
        output += `${key} == "${value}" ${oper} `;
      }
    });
    return output;
  }

  public addForm(form: any, search?: any): void {
    this.forms.push(form);
    if (form && search) {
      this.searches.push(search);
    }

  }

  public addForms(forms: Array<any>, searches?: Array<any>): void {
    this.forms = [...this.forms, ...forms];
    if (forms.length && searches) {
      this.searches = [...this.searches, ...searches];
    }
  }
  /**
   * @deprecated The method will be replaced by getForm
   */
  public getForms() {
    return this.getForm();
  }

  public getForm(filterForm?: FilterForm): Array<any> {
    const lfbp = this.limitFormsByPriority();
    let forms: Array<any> = lfbp.forms;
    if (lfbp.privateFormExists && lfbp.publicFormExists) {
      if (lfbp.extraFormExists) {
        //Merge formws[1]: public  //form[2]: public-extra
        let res = this.mergeFormSections([forms[1], forms[2]]);
        // Merge forms[0]: private  // res:  public-final
        forms = this.mergeFormSections([forms[0], { "sections": res }])
      } else {
        forms = this.mergeFormSections(forms);
      }
    } else {
      if (lfbp.extraFormExists) {
        // Merge forms[0]: private  // forms[1]:  extra
        forms = this.mergeFormSections([forms[0], forms[1]])
      } else {
        forms = forms.length ? forms[0]['sections'] || [] : [];
      }

    }

    forms = this.orderSections(forms);

    for (const filterField of filterForm?.filterFields || []) {

      forms = this.filterFields(filterField, forms);
    }

    if (filterForm?.groupedFields) forms = this.groupedFields(forms);

    if (filterForm?.groupFieldsInArray) forms = this.groupFieldsInArray(forms);

    return forms.filter(({ fields }) => (fields?.length ? true : false));
  }

  public mergeFormSections(forms: Array<any>) {
    const _forms: Array<any> = [];
    const privateForm: any = forms[0];
    const publicForm: any = forms[1];

    let privateFormSections = [];
    let publicFormSections = [];
    const privateSectionKeys = [];
    if (privateForm['sections']) {
      privateFormSections = privateForm['sections'];
    }

    if (publicForm['sections']) {
      publicFormSections = publicForm['sections'];
    }
    const getSectionByKey = (i: Array<any>, k: string) => {
      const exists: any = [];
      i.forEach((e) => {
        if (k == 'empty') {
          if (!e['section_key']) {
            exists.push(e);
          }
        } else {
          if (e['section_key'] === k) {
            exists.push(e);
          }
        }
      });
      return exists;
    };
    const checkFieldKey = (i: Array<any>, k: string) => {
      let exists: any = false;
      i.forEach((e) => {
        if (e['key'] === k) {
          exists = true;
        }
      });
      return exists;
    };

    privateFormSections.forEach((item) => {
      if (item['section_key']) {
        const section = item;
        const sectionKey = section['section_key'];
        let sectionFields = [];
        let sectionByKeyFields = [];
        getSectionByKey(publicFormSections, sectionKey).forEach(
          (sectionByKey) => {
            if (sectionByKey['section_order']) {
              section['section_order'] = sectionByKey['section_order'];
            }
            if (sectionByKey['fields']) {
              sectionByKeyFields = [
                ...sectionByKeyFields,
                ...sectionByKey['fields'],
              ];
            }
          },
        );
        if (section['fields']) {
          sectionByKeyFields.forEach((sectionByKeyField) => {
            if (sectionByKeyField['key']) {
              if (!checkFieldKey(section['fields'], sectionByKeyField['key'])) {
                sectionFields.push(sectionByKeyField);
              }
            } else {
              sectionFields.push(sectionByKeyField);
            }
          });
          sectionFields = [...sectionFields, ...section['fields']];
        } else {
          sectionFields = sectionByKeyFields;
        }
        section['fields'] = sectionFields;
        _forms.push(section);
        privateSectionKeys.push(sectionKey);
      } else {
        _forms.push(item);
      }
    });

    publicFormSections.forEach((section) => {
      if (section['section_key']) {
        if (privateSectionKeys.indexOf(section['section_key']) == -1) {
          _forms.push(section);
        }
      } else {
        _forms.push(section);
      }
    });
    return _forms;
  }

  public limitFormsByPriority() {
    const forms = [];
    let privateFormExists = false;
    let publicFormExists = false;
    let extraFormExists = false;
    let extraForm = null;

    this.forms.forEach((element: object, index: number) => {
      let hasExtraForm = false;
      if (this.searches.length) {
        if (Object.keys(this.searches[index]).includes("extraForm") &&
          this.searches[index]["extraForm"]) {
          hasExtraForm = true;
        }
      }

      if (element['_partitionKey'] === this.publicPartitionKey && !hasExtraForm) {
        // is public form
        if (!publicFormExists) {
          forms.push(element);
          publicFormExists = true;
        }
      } if (element['_partitionKey'] === this.publicPartitionKey && hasExtraForm) {
        if (!extraFormExists) {
          extraFormExists = true;
          extraForm = element;
        }
      } else {
        // is private form
        if (!privateFormExists) {
          privateFormExists = true;
          forms.push(element);
        }
      }

    });
    if (extraFormExists) {
      forms.push(extraForm);
    }
    return { privateFormExists, publicFormExists, extraFormExists, forms };
  }

  public orderSections(sections: Array<any>) {
    return sections
      .sort(
        (a, b) =>
          (a?.section_order || 999999998) - (b?.section_order || 999999999),
      )
      .map(({ fields, ...rest }) => ({
        ...rest,
        fields: fields ? this.orderFields(fields) : [],
      }));
  }

  public orderFields(fields: Array<any>) {
    return fields.sort(
      (a, b) => (a?.order || 999999998) - (b?.order || 999999999),
    );
  }

  public filterFields(fieldAttribute: FieldAttribute, sections: Array<any>) {
    const _filterFields = (fields: Array<any>) => {
      return fields
        .map((field) => {
          if (
            fieldAttribute.name == FieldAttributeFilters.SpecificApp ||
            fieldAttribute.name == FieldAttributeFilters.SpecificType
          ) {
            if (field?.specific_type) {
              const hasEqualsTypes = [];
              const hasntEqualsTypes = [];
              const hasntTypes = [];

              for (const sp of field.specific_type) {
                if (fieldAttribute.name == FieldAttributeFilters.SpecificType) {
                  if (sp?.type) {
                    if (sp?.type == fieldAttribute.value) {
                      hasEqualsTypes.push(sp.type);
                    } else {
                      hasntEqualsTypes.push(sp.type);
                    }
                  } else {
                    hasntTypes.push(sp.type);
                  }
                } else if (
                  fieldAttribute.name == FieldAttributeFilters.SpecificApp
                ) {
                  if (sp?.app) {
                    if (sp?.app.indexOf(fieldAttribute.value) > -1) {
                      hasEqualsTypes.push(sp.app);
                    } else {
                      hasntEqualsTypes.push(sp.app);
                    }
                  } else {
                    hasntTypes.push(sp.app);
                  }
                }
              }
              if (hasEqualsTypes.length) {
                return field;
              }
              if (hasntTypes.length == field.specific_type.length) {
                return field;
              }
              return false;
            }
            return field;
          } else {
            if (Reflect.has(field, fieldAttribute.name)) {
              const attrVal = String(Reflect.get(field, fieldAttribute.name));
              if (
                fieldAttribute.regex &&
                attrVal.search(fieldAttribute.value) > -1
              ) {
                return field;
              } else if (
                !fieldAttribute.regex &&
                attrVal === fieldAttribute.value
              ) {
                return field;
              }
              return false;
            }
            return false;
          }
        })
        .filter((field) =>
          typeof field == 'boolean' && !field ? false : true,
        );
    };

    return sections
      .map(({ fields, ...others }) => {
        return { ...others, fields: _filterFields(fields) };
      })
      .filter(({ fields }) => (fields?.length ? true : false));
  }

  public groupFieldsInArray(sections: Array<any>) {
    return sections.map((section) => {
      const { fields, ...rest } = section;

      const _fields: Array<any> = [];

      const keyArray = fields
        .map((e) => e.path)
        .filter(
          (e: any) =>
            e &&
            e.match(/.+(\.\*)/) &&
            e !== 'extras.*' &&
            e !== 'relationships.*',
        )
        .filter((item, i, ar) => ar.indexOf(item) === i);

      if (keyArray.length > 0) {
        keyArray.forEach((key) => {
          const _subSectionFields: any[] = [];
          const subFields = fields.filter((e) => e.path && e.path === key);
          subFields.forEach((field) => {
            _subSectionFields.splice(field.order, 1, field as never);
          });
          _fields.splice(subFields[0].order, 1, {
            type: 'array',
            key: key.substring(0, key.length - 2),
            specific_type: subFields[0].specific_type,
            fields: [..._subSectionFields],
          } as never);
        });
      }

      fields
        .filter((e) => !e.path || (e.path && !keyArray.includes(e.path)))
        .forEach((field: any) => {
          _fields.splice(field.order, 1, field as never);
        });

      return { ...rest, fields: _fields };
    });
  }

  public groupedFields(sections: Array<any>) {
    return sections.map((section) => {
      const { fields, ...rest } = section;
      const _fields: Array<any> = [];

      const keyParentGrouped = fields
        .filter((e) => e.grouped_fields && e.grouped_fields.parent)
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .map(({ key }) => key);

      const keyGrouped = fields
        .map(({ key, grouped_fields }) => ({ key, grouped_fields }))
        .filter(
          (e: any) =>
            e.grouped_fields && keyParentGrouped.includes(e.grouped_fields.key),
        )
        .filter((item, i, ar) => ar.indexOf(item) === i);

      if (keyGrouped.length === 0) return { ...rest, fields };

      keyGrouped
        .filter((e) => e.grouped_fields && e.grouped_fields.parent)
        .forEach((e) => {
          const keyParent = e.key;
          const keyChield = keyGrouped
            .filter(
              (e) =>
                !e.grouped_fields.parent && e.grouped_fields.key === keyParent,
            )
            .map((e) => e.key);
          const parent = fields.find((e) => e.key === keyParent);
          const chield = fields.filter((e) => keyChield.includes(e.key));
          _fields.splice(parent.order, 1, {
            ...parent,
            grouped_fields: chield,
          } as never);
        });

      fields
        .filter((e) => !keyGrouped.map((k) => k.key).includes(e.key))
        .forEach((field: any) => {
          _fields.splice(field.order, 1, field as never);
        });

      return { ...rest, fields: _fields };
    });
  }
}
