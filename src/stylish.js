import _ from 'lodash';
import getTree from './getTree.js';

const getIndent = (depth) => ' '.repeat(depth * 4 - 2);
const signOfDiffer = {
  nested: '  ',
  unchanged: '  ',
  deleted: '- ',
  added: '+ ',
};

const stringify = (currentValue, depth) => {
  if (!_.isObject(currentValue)) {
    return `${currentValue}`;
  }
  const lines = Object
    .entries(currentValue)
    .map(([key, value]) => `${getIndent(depth)}${signOfDiffer.unchanged}${key}: ${stringify(value, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${getIndent(depth - 1)}  }`;
};

const stylish = (obj1, obj2) => {
  const prepairedTree = getTree(obj1, obj2);
  const getRender = (tree, depth = 1) => {
    const result = tree.reduce((acc, obj) => {
      switch (obj.type) {
        case 'nested':
          return `${acc}${getIndent(depth)}${signOfDiffer[obj.type]}${obj.key}: ${getRender(obj.value, depth + 1)}\n`;
        case 'unchanged':
          return `${acc}${getIndent(depth)}${signOfDiffer[obj.type]}${obj.key}: ${stringify(obj.value, depth + 1)}\n`;
        case 'deleted':
          return `${acc}${getIndent(depth)}${signOfDiffer[obj.type]}${obj.key}: ${stringify(obj.value, depth + 1)}\n`;
        case 'added':
          return `${acc}${getIndent(depth)}${signOfDiffer[obj.type]}${obj.key}: ${stringify(obj.value, depth + 1)}\n`;
        case 'changed': {
          const deleteValue = `${getIndent(depth)}${signOfDiffer.deleted}${obj.key}: ${stringify(obj.value1, depth + 1)}\n`;
          const addedValue = `${getIndent(depth)}${signOfDiffer.added}${obj.key}: ${stringify(obj.value2, depth + 1)}\n`;
          return `${acc}${deleteValue}${addedValue}`;
        }
        default:
          return acc;
      }
    }, '');

    return `{\n${result}${' '.repeat(depth * 4 - 4)}}`;
  };
  return getRender(prepairedTree);
};

export default stylish;
