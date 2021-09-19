declare module '*.glsl' {
  // eslint-disable-next-line node/no-unpublished-import
  import type {GlslShader} from 'webpack-glsl-minify';
  const content: GlslShader;
  export = content;
}

declare module '*.frag' {
  // eslint-disable-next-line node/no-unpublished-import
  import type {GlslShader} from 'webpack-glsl-minify';
  const content: GlslShader;
  export default content;
}

declare module '*.vert' {
  // eslint-disable-next-line node/no-unpublished-import
  import type {GlslShader} from 'webpack-glsl-minify';
  const content: GlslShader;
  export default content;
}
