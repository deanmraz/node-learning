const { has, get, set, isEmpty, isNull } = require('lodash');

const users = [
  {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  },
  {
    createdAt: new Date(),
    id: 0, // should not be zero
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

const flattenWildCards = (rule, data, type, flatten) => {
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
        flattenWildCards(rule.replace('*', propertyNumber), data, type, flatten);
      }
    }
  } else {
    flatten[rule] = type;
  }
}

const toType = (rules, data) => {

  const flatten = {};
  for(const rule in rules) {
    const type = rules[rule];
    flattenWildCards(rule, data, type, flatten);
  }

  for (const rule in flatten) {
    const value = get(data, rule);
    if (has(data, rule) && !isNull(value)) {
      set(data, rule, flatten[rule]);
    }
  }

  return data;
}

describe('API Test Demos', () => {
  test('Wildcard first level array', () => {
    expect(toType({
      '*.createdAt': 'DATETIME',
      '*.id': 'NUMBER',
    }, [...users])).toMatchSnapshot();
  });

  test('Wildcard 2nd level data.array', () => {
    expect(toType({
      'data.*.createdAt': 'DATETIME',
      'data.*.id': 'NUMBER',
    }, {
      data: [...users]
    })).toMatchSnapshot();
  });

  test('Wildcard 3rd level data.secondary.array', () => {
    expect(toType({
      'data.second.*.createdAt': 'DATETIME',
      'data.second.*.id': 'NUMBER',
    }, {
      data: {
        second: [...users]
      }
    })).toMatchSnapshot();
  });

  test('Keep NULL values', () => {
    expect(toType({
      'data.*.id': 'NUMBER',
      'data.*.createdAt': 'DATETIME',
    }, {
      data: [
        {
          createdAt: new Date(),
          id: null,
          name: 'LeBron James 2',
        },
        {
          createdAt: new Date(),
          id: Math.floor(Math.random() * 20),
          name: 'LeBron James 2',
        },
      ]
    })).toMatchSnapshot();
  });

  test('Only sanitize attributes that exist', () => {
    expect(toType({
      'data.*.id': 'NUMBER',
      'data.*.createdAt': 'DATETIME',
    }, {
      data: [
        {
          createdAt: new Date(),
          name: 'LeBron James',
        },
        {
          createdAt: new Date(),
          id: Math.floor(Math.random() * 20),
          name: 'LeBron James 2',
        },
      ]
    })).toMatchSnapshot();
  });

  test('Sanitize Zero Number', () => {
    expect(toType({
      'data.*.id': 'NUMBER',
      'data.*.createdAt': 'DATETIME',
    }, {
      data: [
        {
          createdAt: new Date(),
          id: 0,
          name: 'LeBron James',
        },
        {
          createdAt: new Date(),
          id: Math.floor(Math.random() * 20),
          name: 'LeBron James 2',
        },
      ]
    })).toMatchSnapshot();
  });

  test('Handle double wildcard data.*.hasMany.*.something', () => {
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
