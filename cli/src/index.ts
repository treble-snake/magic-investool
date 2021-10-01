import {DistinctQuestion, prompt} from 'inquirer';
import {openSync, readdirSync, writeFileSync} from 'fs';
import * as path from 'path';
import mkdirp from 'mkdirp';

const STORAGE_SUB_DIRS = ['yahoo-cache'];

const makeConfigPath = (dir: string) => path.join(dir, '.env');

const notEmpty = (input: any) => input ? true : 'Can\'t be empty';

const askEnv = (question: DistinctQuestion<any>) => {
  question.when = (answers) => {
    return !(answers.proceed === false);
  };
  question.validate = notEmpty;
  return question;
};

prompt([
  {
    type: 'input',
    name: 'root',
    message: 'Where is the Web UI located?',
    default: './web-ui',
    validate: (input) => {
      if (!input) {
        return 'Can not be empty';
      }

      try {
        readdirSync(input);
        return true;
      } catch (e) {
        return `The ${input} directory does not exist`;
      }
    }
  },
  {
    type: 'confirm',
    name: 'proceed',
    message: '.env file already exists. Do you want to proceed and overwrite it?',
    when: (answers) => {
      try {
        // TODO: read default from there
        // TODO: persist custom values?
        openSync(makeConfigPath(answers.root), 'r');
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  askEnv({
    type: 'input',
    name: 'ENV_MF_AUTH_EMAIL',
    message: 'Email used as a login for https://www.magicformulainvesting.com account:'
  }),
  askEnv({
    type: 'input',
    name: 'ENV_MF_AUTH_PASSWORD',
    message: 'Password for https://www.magicformulainvesting.com account:'
  }),
  askEnv({
    type: 'input',
    name: 'ENV_YAHOO_API_KEY',
    message: 'API key for Yahoo Finance API:'
  }),
  askEnv({
    type: 'input',
    name: 'ENV_STORAGE_DIR',
    message: 'Directory to store JSON files with data. Will be created if doesn\'t exist.'
  }),
  askEnv({
    type: 'input',
    name: 'ENV_REPORT_DIR',
    message: 'Directory to store TXT files with Magic Formula changelogs. Will be created if doesn\'t exist.'
  }),
])
  .then(async (answers) => {
    if (answers.proceed === false) {
      console.log('Aborted');
      return;
    }

    console.log(`\nCreating storage dirs at ${answers.ENV_STORAGE_DIR}`);
    if(!path.isAbsolute(answers.ENV_STORAGE_DIR)) {
      answers.ENV_STORAGE_DIR = path.join(process.cwd(), answers.ENV_STORAGE_DIR);
    }
    for (const dir of STORAGE_SUB_DIRS) {
      const storageResult = await mkdirp(path.join(answers.ENV_STORAGE_DIR, dir));
      console.log(`Storage dir ${dir}: ${storageResult || 'exists'}`);
    }

    console.log(`\nCreating reports dir at ${answers.ENV_REPORT_DIR}`);
    if(!path.isAbsolute(answers.ENV_REPORT_DIR)) {
      answers.ENV_REPORT_DIR = path.join(process.cwd(), answers.ENV_REPORT_DIR);
    }
    console.log(`Reports dir ${answers.ENV_REPORT_DIR}: ${
      (await mkdirp(answers.ENV_REPORT_DIR)) || 'exists'
    }`);

    console.log('\nComposing configs');
    const env = Object.entries(answers).reduce((acc, [name, value]) => {
      if (!name.startsWith('ENV_')) {
        return acc;
      }

      return `${acc}${name.substring(4)}=${value}\n`;
    }, '');

    const file = makeConfigPath(answers.root);
    writeFileSync(file, env);

    console.log(`Your config:\n${env}`);
    console.log(`\nConfig is written to ${file}`);

    console.log('\nAll done!');
  });