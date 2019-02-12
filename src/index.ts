#!/usr/bin/env node

import { prompt } from 'inquirer';

const cli = () => {
  prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to download?',
      choices: ['Video', 'Playlist'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is it called?',
    },
  ]);
};

cli();
