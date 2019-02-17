import { prompt } from 'inquirer';
import * as ytdl from 'ytdl-core';
import * as ora from 'ora';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { Bar, Presets } from 'cli-progress';

export default async () => {
  const { url } = await prompt({
    type: 'input',
    name: 'url',
    message: "What's the url?",
  });

  let spinner = ora('Checking...').start();
  let info;

  try {
    info = await ytdl.getBasicInfo(url);
    spinner.stop();
  } catch (err) {
    return spinner.warn('Incorrect url.');
  }

  const { quality, start, end } = await prompt([
    {
      type: 'list',
      name: 'quality',
      message: 'Select quality',
      choices: ['highest', 'lowest'],
      default: 'highest',
    },
    {
      type: 'list',
      name: 'format',
      message: 'Select format',
      choices: ['mp4', 'mp3', 'gif', 'ogg', 'wav'],
      default: 'mp4',
    },
    {
      type: 'input',
      name: 'start',
      message: 'Start',
      default: '0:00',
    },
    {
      type: 'input',
      name: 'end',
      message: 'End',
      default: '0:00',
    },
  ]);

  const bar = new Bar(
    {
      format: '[{bar}] {percentage}% | ETA: {eta}s',
      clearOnComplete: true,
    },
    Presets.shades_classic,
  );

  const { title } = info.player_response.videoDetails;
  const video = ytdl(url, { quality, begin: start });

  spinner = ora().start();

  video.pipe(createWriteStream(resolve(process.cwd(), title + '.mp4')));

  video.once('response', res => {
    bar.start(res.headers['content-length'], 0);
    spinner.stop();
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    bar.update(downloaded);
  });

  video.on('end', () => {
    bar.stop();
  });
};
