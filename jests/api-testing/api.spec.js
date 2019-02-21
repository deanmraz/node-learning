const { has, get, set, isEmpty } = require('lodash');

const users = [
  {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  },
  {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James 2',
  },
  {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James 3',
  },
  {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James 4',
  },
];

const toType = (rules, data) => {

  // flatten rules
  const flatten = {};
  for(const rule in rules) {
    const type = rules[rule];
    if (rule.indexOf('*') > -1) {
      const parentPath = rule.substr(0, rule.indexOf('*') - 1);
      let propertyValue;
      if (isEmpty(parentPath)) {
        propertyValue = data;
      } else {
        propertyValue = get(data, parentPath);
      }
      if (propertyValue) {
        for (let propertyNumber = 0; propertyNumber < propertyValue.length; propertyNumber++) {
          flatten[rule.replace('*', propertyNumber)] = type;
        }
      }
    } else {
      flatten[rule] = type;
    }
  }

  console.log(flatten);

  for (const rule in flatten) {
    const value = get(data, rule);
    if (has(data, rule) && value) {
      set(data, rule, flatten[rule]);
    }
  }

  return data;
}

describe('API Test Demos', () => {
  test('Nested Objects', () => {
    expect(toType({
      '*.createdAt': 'DATETIME',
      '*.id': 'NUMBER',
    }, users)).toMatchSnapshot();
  });

  test('Nested Objects with attribute prefix', () => {
    expect(toType({
      'data.*.createdAt': 'DATETIME',
      'data.*.id': 'NUMBER',
    }, {
      data: users
    })).toMatchSnapshot();
  });
  test('Nested Objects with attribute prefix deeper', () => {
    expect(toType({
      'data.second.*.createdAt': 'DATETIME',
      'data.second.*.id': 'NUMBER',
    }, {
      data: {
        second: users
      }
    })).toMatchSnapshot();
  });
  test('Nested Objects with attribute prefix deeper', () => {
    expect(toType({
      'data.second.*.createdAt': 'DATETIME',
      'data.second.*.id': 'NUMBER',
    }, {
      data: {
        second: users
      }
    })).toMatchSnapshot();
  });

  test('Do not set null or empty values', () => {
    expect(toType({
      'data.*.createdAt': 'DATETIME',
      'data.*.id': 'NUMBER',
      'data.*.hasMany.*.id': 'NUMBER',
    }, {
      data: [
        {
          createdAt: new Date(),
          name: 'LeBron James',
        },
        {
          createdAt: new Date(),
          id: null,
          name: 'LeBron James 2',
        },
      ]
    })).toMatchSnapshot();
  });

  test('Nested Objects with attribute prefix deeper', () => {
    expect(toType({
      'data.*.createdAt': 'DATETIME',
      'data.*.id': 'NUMBER',
      'data.*.hasMany.*.id': 'NUMBER',
    }, {
      data: [
        {
          createdAt: new Date(),
          id: Math.floor(Math.random() * 20),
          name: 'LeBron James',
          hasMany: [
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
          ]
        },
        {
          createdAt: new Date(),
          id: Math.floor(Math.random() * 20),
          name: 'LeBron James 2',
          hasMany: [
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
            { id: Math.floor(Math.random() * 20), name: 'Has Many', },
          ]
        },
      ]
    })).toMatchSnapshot();
  });

});
