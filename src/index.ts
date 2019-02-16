#!/usr/bin/env node

import { prompt } from 'enquirer';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';

const cli = async () => {
  const { url, quality, format, begin } = await prompt([
    {
      type: 'input',
      name: 'url',
      message: "What's the url?",
    },
    {
      type: 'autocomplete',
      name: 'quality',
      message: 'Select quality',
      choices: ['highest', 'lowest'],
      initial: 'highest',
    },
    {
      type: 'autocomplete',
      name: 'format',
      message: 'Select format',
      choices: ['mp4', 'mp3', 'gif', 'ogg', 'wav'],
      initial: 'mp4',
    },
    {
      type: 'input',
      name: 'begin',
      message: 'Begin',
      initial: '0:00',
    },
  ]);

  // TODO
  ytdl(url, { quality, begin }).pipe(fs.createWriteStream(`video.mp4`));
};

cli();
