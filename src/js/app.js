import GrabAndDrop from './grabAndDrop.js';

const conteiner = document.querySelector('.conteiner');
const wrapperConteiner = document.querySelector('.wrapper');

const grabAndDrop = new GrabAndDrop(wrapperConteiner, conteiner);
grabAndDrop.init();
