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

  const sections = [
    {
      section_order: 101,
      section_key: 'personal_data',
      fields: [
        {
          key: 'age',
          type: 'number',
          order: 102,
          specific_type: [
            {
              type: 'buyer',
            },
            {
              type: 'seller',
            },
          ],
        },
        {
          key: 'birthdate0',
          specific_type: [
            {
              type: 'seller',
              app: ['harvex'],
            },
          ],
        },
        {
          key: 'birthdate',
          specific_type: [
            {
              type: 'buyer',
              app: ['trumodity', 'transformaciones'],
            },
            {
              type: 'seller',
              app: ['transformaciones'],
            },
          ],
        },
      ],
    },
    {
      section_order: 201,
      section_key: 'personal_data2',
      fields: [
        {
          key: 'email',
          specific_type: [
            {
              app: ['trumodity', 'silosys_mobile'],
            },
          ],
        },
      ],
    },
    {
      section_order: 500,
      section_key: 'personal_data3',
      fields: [],
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
          specific_type: [],
        },
      ],
    },
  ];

  it('Specific Type filters SectionsFieldsSpecificTypeApp[harvex]', () => {
    expect(
      lib.filterFields(
        {
          name: 'specific_type.*.app',
          value: 'harvex',
        },
        sections,
      ),
    ).toStrictEqual([
      {
        section_order: 101,
        section_key: 'personal_data',
        fields: [
          {
            key: 'age',
            type: 'number',
            order: 102,
            specific_type: [
              {
                type: 'buyer',
              },
              {
                type: 'seller',
              },
            ],
          },
          {
            key: 'birthdate0',
            specific_type: [
              {
                type: 'seller',
                app: ['harvex'],
              },
            ],
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
            specific_type: [],
          },
        ],
      },
    ]);
  });

  it('Specific Type filters SectionsFieldsSpecificTypeType[seller]', () => {
    expect(
      lib.filterFields(
        {
          name: 'specific_type.*.type',
          value: 'seller',
        },
        sections,
      ),
    ).toStrictEqual([
      {
        section_order: 101,
        section_key: 'personal_data',
        fields: [
          {
            key: 'age',
            type: 'number',
            order: 102,
            specific_type: [
              {
                type: 'buyer',
              },
              {
                type: 'seller',
              },
            ],
          },
          {
            key: 'birthdate0',
            specific_type: [
              {
                type: 'seller',
                app: ['harvex'],
              },
            ],
          },
          {
            key: 'birthdate',
            specific_type: [
              {
                type: 'buyer',
                app: ['trumodity', 'transformaciones'],
              },
              {
                type: 'seller',
                app: ['transformaciones'],
              },
            ],
          },
        ],
      },
      {
        section_order: 201,
        section_key: 'personal_data2',
        fields: [
          {
            key: 'email',
            specific_type: [
              {
                app: ['trumodity', 'silosys_mobile'],
              },
            ],
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
            specific_type: [],
          },
        ],
      },
    ]);
  });

  it('Specific Type filters SectionsFieldsByRegeX[key=age]', () => {
    expect(
      lib.filterFields(
        {
          name: 'key',
          value: 'birthdate.*',
          regex: true,
        },
        sections,
      ),
    ).toStrictEqual([
      {
        section_order: 101,
        section_key: 'personal_data',
        fields: [
          {
            key: 'birthdate0',
            specific_type: [
              {
                type: 'seller',
                app: ['harvex'],
              },
            ],
          },
          {
            key: 'birthdate',
            specific_type: [
              {
                type: 'buyer',
                app: ['trumodity', 'transformaciones'],
              },
              {
                type: 'seller',
                app: ['transformaciones'],
              },
            ],
          },
        ],
      },
    ]);
  });
});
