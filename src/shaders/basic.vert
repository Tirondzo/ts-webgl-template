#version 300 es
in vec2 vin_position;

uniform vec4 u_screen_size;
uniform vec4 u_screen_ratio;

out vec2 vout_uv;

void main()
{
  vout_uv = (vin_position + 1.0) * 0.5;
  gl_Position = vec4(vin_position, 0.0, 1.0);
}