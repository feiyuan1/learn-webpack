// import {getOptions} from 'loader-utils'; // api deperacated
// import validateOptions from 'schema-utils';

// import schema from './options.json';

export const raw = true;

export default function loader(source) {
  console.log('test-loader-source: ', typeof source)
  const { version, webpack } = this;

  // const options = getOptions(this) || {};

  // validateOptions(schema, options, 'Loader');

  const newSource = `
  /**
   * Loader API Version: ${version}
   * Is this in "webpack mode": ${webpack}
   */
  /**
   * Original Source From Loader
   */
  ${source}`;

  console.log('newSource: ', newSource)

  return `${newSource}`;
}