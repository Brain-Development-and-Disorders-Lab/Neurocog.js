// Configuration and data
import {config} from '../src/config/config';
import {init} from '../src/core/integration';
import {ImageLoader} from '../src/core/lib';
import './core/plugin';

// Timeline setup
const timeline = [];

// Images
const imageLoader = new ImageLoader(config);
const images = imageLoader.getImages();

const instructionsIntroduction = [
  `<h1>${config.name}</h1>` +
  `<span class="instructions-subtitle">` +
    `Please read these instructions carefully.</span>` +
  `<h2>Instructions</h2>` +
  `<img src=${images['chess']}></img>` +
  `<p>This is an example set of instructions.</p>`,
];

timeline.push({
  type: 'instructions',
  pages: instructionsIntroduction,
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

timeline.push({
  type: 'example-plugin',
});

// Initialise jsPsych using the configured timeline
init(timeline);
