import * as twgl from 'twgl.js';
import basicFS from './shaders/basic.frag';
import basicVS from './shaders/basic.vert';

class Renderer {
  private animationHandler = -1;
  private basicProgram: twgl.ProgramInfo;
  private fullscreenBuffer: twgl.BufferInfo;
  private lastTime = 0;

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

  render(time: number): void {
    const gl = this.gl;
    const dt = time - this.lastTime;

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
      [basicFS.uniforms['u_time'].variableName]: [time, dt],
    });

    twgl.setBuffersAndAttributes(gl, this.basicProgram, this.fullscreenBuffer);
    twgl.drawBufferInfo(gl, this.fullscreenBuffer);

    this.lastTime = time;
    this.animationHandler = requestAnimationFrame(this.render);
  }
}

export {Renderer};
