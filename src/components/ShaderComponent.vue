<template>
  <div ref="container" class="shader-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
// import glsl from 'babel-plugin-glsl/macro';

const WaveShaderMaterial = class extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0.0, 0.0, 0.0) },
        uTexture: { value: new THREE.Texture() }
      },
      vertexShader: `
        precision mediump float;

        varying vec2 vUv;
        varying float vWave;

        uniform float uTime;

        void main() {
          vUv = uv;

          vec3 pos = position;
          float noiseFreq = 2.0;
          float noiseAmp = 0.4;
          float noiseValue = sin(pos.x * noiseFreq + uTime);
          pos.z += noiseValue * noiseAmp;
          vWave = pos.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
        }
      `,
      fragmentShader: `
        precision mediump float;

        uniform vec3 uColor;
        uniform float uTime;
        uniform sampler2D uTexture;

        varying vec2 vUv;
        varying float vWave;

        void main() {
          float wave = vWave * 0.2;
          vec3 texture = texture2D(uTexture, vUv + wave).rgb;
          gl_FragColor = vec4(texture, 1.0); 
        }
      `
    });
  }
};

export default defineComponent({
  name: 'ShaderComponent',
  props: {
    shaderImage: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const container = ref<HTMLElement | null>(null);
    const image = new Image();

    onMounted(() => {
      if (!container.value) return;

      image.src = props.shaderImage;
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const scale = 0.6;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        if (container.value) {
          renderer.setSize(width * scale, height * scale);
          container.value.appendChild(renderer.domElement);
        }

        const geometry = new THREE.PlaneGeometry(3, 3);
        const material = new WaveShaderMaterial();
        material.uniforms.uTexture.value = new THREE.TextureLoader().load(props.shaderImage);

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        camera.position.z = 7;

        const animate = () => {
          requestAnimationFrame(animate);
          material.uniforms.uTime.value += 0.01;
          renderer.render(scene, camera);
        };

        animate();
      };
    });

    return {
      container
    };
  }
});
</script>

<style scoped>
.shader-container {
  width: 500px; 
  height: 500px; 
  
  position: absolute;
  bottom: -100px;
  left: -350px;
}
</style>