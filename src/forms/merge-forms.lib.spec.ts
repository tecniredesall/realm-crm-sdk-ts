import { Test, TestingModule } from '@nestjs/testing';
import { MergeForms } from './merge-forms.lib';

describe('MergeForms', () => {
  let lib: MergeForms;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MergeForms],
    }).compile();

    lib = module.get<MergeForms>(MergeForms);
  });

  it('Get search pool[_partitionKey, coll_name, target, context]', () => {
    expect(
      lib.getSearch({
        _partitionKey: 'organization_id=private',
        coll_name: 'people',
        target: 'bartercard',
        context: 'seller',
      }),
    ).toStrictEqual([
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          target: 'bartercard',
          context: 'seller',
        },
      },
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          target: 'bartercard',
          context: { $exists: false },
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          target: 'bartercard',
          context: 'seller',
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          target: 'bartercard',
          context: { $exists: false },
        },
      },
    ]);
  });

  it('Get search pool[_partitionKey, coll_name, target]', () => {
    expect(
      lib.getSearch({
        _partitionKey: 'organization_id=private',
        coll_name: 'people',
        target: 'bartercard',
      }),
    ).toStrictEqual([
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          target: 'bartercard',
          context: { $exists: false },
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          target: 'bartercard',
          context: { $exists: false },
        },
      },
    ]);
  });

  it('Get search pool[_partitionKey, coll_name, context] ', () => {
    expect(
      lib.getSearch({
        _partitionKey: 'organization_id=private',
        coll_name: 'people',
        context: 'seller',
      }),
    ).toStrictEqual([
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          context: 'seller',
          target: { $exists: false },
        },
      },
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          context: { $exists: false },
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          context: 'seller',
          target: { $exists: false },
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          context: { $exists: false },
        },
      },
    ]);
  });

  it('Get search pool[_partitionKey, coll_name]', () => {
    expect(
      lib.getSearch({
        _partitionKey: 'organization_id=private',
        coll_name: 'people',
      }),
    ).toStrictEqual([
      {
        searchOn: 'organization_id=private',
        filters: {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
          context: { $exists: false },
          target: { $exists: false },
        },
      },
      {
        searchOn: 'public',
        filters: {
          _partitionKey: 'public',
          coll_name: 'people',
          context: { $exists: false },
          target: { $exists: false },
        },
      },
    ]);
  });

  it('Order sections', () => {
    expect(
      lib.orderSections([
        { item: 'e', fields: [] },
        { section_order: 4, fields: [{ order: 9 }, { order: 1 }] },
        {
          section_order: 4,
          fields: [{ order: 9 }, { order: 8 }, { order: 1 }],
        },
        { section_order: 1, item: 'a' },
        { section_order: 2, item: 'b' },
      ]),
    ).toStrictEqual([
      { section_order: 1, item: 'a', fields: [] },
      { section_order: 2, item: 'b', fields: [] },
      { section_order: 4, fields: [{ order: 1 }, { order: 9 }] },
      { section_order: 4, fields: [{ order: 1 }, { order: 8 }, { order: 9 }] },
      { item: 'e', fields: [] },
    ]);
  });

  it('Order sections.fields', () => {
    expect(
      lib.orderFields([
        { order: 5 },
        { order: 7 },
        { order: 5 },
        { order: 4 },
        { order: 1 },
      ]),
    ).toStrictEqual([
      { order: 1 },
      { order: 4 },
      { order: 5 },
      { order: 5 },
      { order: 7 },
    ]);
  });
  it('Get forms', () => {
    [
      {
        _partitionKey: 'organization_id=private',
        coll_name: 'people',
        target: 'bartercard',
        context: 'seller',
        sections: [
          {
            section_order: 100,
            section_key: 'personal_data',
            fields: [
              {
                key: 'birthdate',
                type: 'text',
                order: 200,
              },
              {
                key: 'birthdate1',
                type: 'text',
                order: 102,
              },
            ],
          },
          {
            fields: [
              {
                key: 'nombre',
                type: 'text',
                order: 100,
              },
            ],
          },
          {
            fields: [
              {
                key: 'phone',
                type: 'text',
                order: 402,
              },
            ],
          },
          {
            section_order: 500,
            section_key: 'personal_data3',
          },
        ],
      },
      {
        _partitionKey: 'public',
        coll_name: 'people',
        target: 'bartercard',
        context: 'seller',
        sections: [
          {
            section_order: 101,
            section_key: 'personal_data',
            fields: [
              {
                key: 'birthdate',
                type: 'datetime',
                order: 102,
              },
              {
                key: 'birthdate0',
                type: 'text',
                order: 1,
              },
            ],
          },
          {
            fields: [
              {
                key: 'bio',
                type: 'textarea',
                order: 103,
              },
            ],
          },
          {
            section_order: 201,
            section_key: 'personal_data2',
            fields: [
              {
                key: 'email',
                type: 'text',
                order: 102,
              },
            ],
          },
        ],
      },
    ].forEach((e) => lib.addForm(e));
    expect(lib.getForms()).toStrictEqual([
      {
        section_order: 101,
        section_key: 'personal_data',
        fields: [
          {
            key: 'birthdate0',
            type: 'text',
            order: 1,
          },
          {
            key: 'birthdate1',
            type: 'text',
            order: 102,
          },
          {
            key: 'birthdate',
            type: 'text',
            order: 200,
          },
        ],
      },
      {
        section_order: 201,
        section_key: 'personal_data2',
        fields: [
          {
            key: 'email',
            type: 'text',
            order: 102,
          },
        ],
      },
      {
        fields: [
          {
            key: 'bio',
            type: 'textarea',
            order: 103,
          },
        ],
      },
      {
        fields: [
          {
            key: 'phone',
            type: 'text',
            order: 402,
          },
        ],
      },
      {
        fields: [
          {
            key: 'nombre',
            type: 'text',
            order: 100,
          },
        ],
      },
    ]);
  });

  it('Get search pool[_partitionKey, coll_name] (Realm)', () => {
    expect(
      lib.getSearch(
        {
          _partitionKey: 'organization_id=private',
          coll_name: 'people',
        },
        'realm',
      ),
    ).toStrictEqual([
      {
        searchOn: 'organization_id=private',
        filters:
          '_partitionKey == "organization_id=private" AND coll_name == "people" AND context.@count = 0 AND target = null  ',
      },
      {
        searchOn: 'public',
        filters:
          '_partitionKey == "public" AND coll_name == "people" AND context.@count = 0 AND target = null  ',
      },
    ]);
  });
});
