#!/usr/bin/env node

import { prompt } from 'inquirer';

const cli = () => {
  prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to download?',
      choices: ['A video', 'A playlist'],
    },
    {
      type: 'input',
      name: 'title',
      message: 'What is the title or the url?',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select format:',
      choices: ['mp4', 'mp3', 'gif', 'ogg', 'wav'],
    },
    {
      type: 'input',
      name: 'crop-start',
      message: 'Start',
      default: '0:00',
    },
    {
      type: 'input',
      name: 'crop-end',
      message: 'End',
      default: '0:00',
    },
  ]);
};

cli();
