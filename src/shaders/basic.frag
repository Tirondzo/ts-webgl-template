#version 300 es
precision mediump float;

in vec2 vout_uv;
out vec4 fout_color;

uniform vec2 u_time;
uniform vec2 u_offset;
uniform vec4 u_color;

void main()
{
  vec2 tpos = vout_uv;
  fout_color = vec4(sin(u_time.x * 0.001 + vout_uv.xyx + vec3(0,u_offset))*.5 + .5, 1.) * u_color;
}