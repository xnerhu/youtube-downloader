#!/usr/bin/env node

import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { prompt } from 'enquirer';
import * as cp from 'cli-progress';
import * as ytdl from 'ytdl-core';

const cli = async () => {
  const bar = new cp.Bar(
    {
      format: '[{bar}] {percentage}% | ETA: {eta}s',
    },
    cp.Presets.shades_classic,
  );

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

  const video = ytdl(url, { quality, begin });

  video.pipe(createWriteStream(resolve(process.cwd(), 'video.mp4')));

  video.once('response', res => {
    bar.start(res.headers['content-length'], 0);
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    bar.update(downloaded);
  });

  video.on('end', () => {
    bar.stop();
  });
};

cli();
