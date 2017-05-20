#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

const environmentFilesDirectory = path.join(__dirname, './../src/environments');
const targetEnvironmentTemplateFileName = 'environment.prod.ts.template';
const targetEnvironmentFileName = 'environment.prod.ts';

const defaultEnvValues = {
  CF_FIREBASE_API_KEY : process.env.FIREBASE_API_KEY,
  CF_FIREBASE_AUTH_DOMAIN : process.env.FIREBASE_AUTH_DOMAIN,
  CF_FIREBASE_DATABASE_URL : process.env.FIREBASE_DATABASE_URL,
  CF_FIREBASE_MESSAGING_SENDER_ID : process.env.FIREBASE_MESSAGING_SENDER_ID,
  CF_FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID,
  CF_FIREBASE_STORAGE_BUCKET : process.env.FIREBASE_STORAGE_BUCKET
};

// Load template file
const environmentTemplate = fs.readFileSync(
  path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName),
  {encoding: 'utf-8'}
);

// Generate output data
const output = ejs.render(environmentTemplate, Object.assign({}, defaultEnvValues, process.env));
// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironmentFileName), output);

process.exit(0);
