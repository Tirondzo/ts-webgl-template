import * as twgl from 'twgl.js';
import basicFS from './shaders/basic.frag';
import basicVS from './shaders/basic.vert';
import type {Tuple} from './utils/types';

class Renderer {
  private animationHandler = -1;
  private basicProgram: twgl.ProgramInfo;
  private fullscreenBuffer: twgl.BufferInfo;
  private onUpdateSubscription: VoidFunction | null = null;

  stats = {
    ft: 0, // time between frame begin and end (frame time)
    dt: 0, // time between frame begin points (delta time)
    fps: 0, // Frames Per Second
    lastTime: 0, // last render timestamp
  };

  props = {
    color: [1.0, 1.0, 1.0, 1.0] as Tuple<number, 4>,
    sinOffset: [2, 4],
    timeMultiplier: 1.0,
    time: 1000,
  };

  constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext) {
    this.render = this.render.bind(this);

    this.basicProgram = twgl.createProgramInfo(gl, [basicVS.sourceCode, basicFS.sourceCode], ['vin_position']);

    // prettier-ignore
    this.fullscreenBuffer = twgl.createBufferInfoFromArrays(gl, {
      vin_position: {numComponents: 2, data: [
        -1, 3,
        3, -1,
        -1, -1
      ]}
    });
  }

  static initialize(canvas: HTMLCanvasElement): Renderer | null {
    const attributes: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    };
    const gl = canvas.getContext('webgl2', attributes);
    if (gl === null) {
      return null;
    }
    return new Renderer(canvas, gl);
  }

  start(): void {
    this.animationHandler = requestAnimationFrame(this.render);
  }

  stop(): void {
    cancelAnimationFrame(this.animationHandler);
  }

  onUpdate(cb: VoidFunction) {
    this.onUpdateSubscription = cb;
  }

  render(time: number): void {
    const t0 = performance.now();
    const gl = this.gl;
    this.stats.dt = time - this.stats.lastTime;
    this.props.time += this.stats.dt * this.props.timeMultiplier;
    this.stats.fps = 1000.0 / this.stats.dt; // approximation from delta time, you can count frames in second instead

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(1, 0, 1, 1); // 🟪
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.basicProgram.program);
    const w = this.canvas.width;
    const h = this.canvas.height;

    const dpr = window.devicePixelRatio || 1;
    const screenSize = [w, h, 1.0 / w, 1.0 / h];
    const screenRatio = [dpr, 1.0 / dpr, w / h, h / w];

    twgl.setUniforms(this.basicProgram, {
      [basicVS.uniforms['u_screen_size'].variableName]: screenSize,
      [basicVS.uniforms['u_screen_ratio'].variableName]: screenRatio,
      [basicFS.uniforms['u_time'].variableName]: [this.props.time, this.stats.dt],
      [basicFS.uniforms['u_offset'].variableName]: this.props.sinOffset,
      [basicFS.uniforms['u_color'].variableName]: this.props.color,
    });

    twgl.setBuffersAndAttributes(gl, this.basicProgram, this.fullscreenBuffer);
    twgl.drawBufferInfo(gl, this.fullscreenBuffer);

    this.stats.lastTime = time;
    this.animationHandler = requestAnimationFrame(this.render);
    this.stats.ft = performance.now() - t0;

    if (this.onUpdateSubscription !== null) this.onUpdateSubscription();
  }
}

export {Renderer};
