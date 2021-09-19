import './index.scss';
import {Renderer} from './Renderer';

const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
console.assert(canvas !== null, "Element with id 'main-canvas' must exists");

const renderer = Renderer.initialize(canvas);
if (renderer) {
  renderer.start();
}

const invalidateCanvasSize = () => {
  canvas.width = canvas.clientHeight;
  canvas.width = canvas.clientWidth;
};
invalidateCanvasSize();
window.addEventListener('resize', invalidateCanvasSize);
