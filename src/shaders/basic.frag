#version 300 es
precision mediump float;

in vec2 vout_uv;
out vec4 fout_color;

uniform vec2 u_time;

void main()
{
  vec2 tpos = vout_uv;
  fout_color = vec4(sin(u_time.x * 0.001 + vout_uv.xyx + vec3(0,2,4))*.5 + .5, 1.);
}