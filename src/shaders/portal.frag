precision highp float;
uniform float time;
varying vec2 vTextureCoord;

float border(float d) {
  return -.3 * pow(2.0*d - 1.0, 16.0) + 1.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  float noise = cnoise(1.2 * vTextureCoord.xy + time*14.0) + 1.0;
  vec2 center = vec2(0.01, 0.01);
  vec2 toCenter = vTextureCoord.xy - center;
  float distFromCenter = max(0.0, 1.0 - sqrt(toCenter.x*toCenter.x + toCenter.y*toCenter.y)*2.0);
  float glowNoise = noise * distFromCenter;
  float borderRadius = 0.15;
  float distFromBorder = abs(distFromCenter - borderRadius);
  if (distFromBorder <= 1.0) {
    glowNoise += 1.0 - border(max(0.0, min(1.0, distFromBorder)));
  }
  vec3 color = vec3(0.2, 0.8, 1.2);
  vec3 pixel = color * vec3(glowNoise, glowNoise, glowNoise);
  gl_FragColor = vec4(pixel, glowNoise);
  //gl_FragColor = vec4(noise, noise, noise, 1.0);
}
