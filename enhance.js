document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  const STYLE_PRESETS = [
    "anime style, soft lighting, digital painting",
    "cyberpunk theme, neon glow, futuristic background",
    "watercolor painting, pastel colors, dreamy atmosphere",
    "dark fantasy art, dramatic shadows, highly detailed",
    "oil painting, renaissance lighting, rich texture",
    "pixel art, retro video game style, vibrant colors",
    "3D render, cinematic lighting, high detail",
    "sci-fi style, alien planet background, glowing elements",
    "surreal biomechanical horror, intricate alien structures, ultra complex patterns, in the style of H.R. Giger",
    "biomech fusion, glowing organic systems, sci-fi abstraction, tentacles and skulls",
    "hyperrealism, ultra detail, glossy surfaces, neon light effects",
    "fractal patterns, surreal composition, macabre atmosphere",
    "moulting effect, decaying textures, organic transformation",
    "Tensor LoRA style, highly detailed, surreal biomechanical structures",
    "inspired by Alex Grey, visionary art, spiritual geometry",
    "inspired by Zdzisław Beksiński, dystopian surrealism, post-apocalyptic landscapes",
    "electrified effect, lightning strikes, energy currents",
    "baroque horror, ornate details, gothic architecture",
    "lovecraftian cosmic horror, eldritch abominations, non-euclidean geometry",
    "steampunk machinery, brass and copper textures, Victorian futurism",
    "bio-organic circuitry, glowing veins, technological flesh",
    "apocalyptic wasteland, radioactive glow, ruined civilizations",
    "psychedelic art, vivid colors, mind-bending patterns",
    "dark surrealism, psychological horror, dreamlike distortion",
    "neo-noir lighting, high contrast, dramatic shadows",
    "alien flora and fauna, exotic ecosystems, xenobiology",
    "crystalline structures, refractive surfaces, prismatic light",
    "industrial decay, rusted metal, broken machinery",
    "celestial bodies, cosmic phenomena, interstellar clouds",
    "hybrid creatures, genetic experimentation, unnatural anatomy"
  ];

  if (!enhanceBtn || !promptInput || !output) return;

  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      output.textContent = 'Prompt cannot be empty.';
      return;
    }

    output.innerHTML = '<span class="loading-spinner"></span>Enhancing...';

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result = await response.text();

      // Tambahkan gaya visual secara acak
      const randomStyle = STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)];
      result = `${result}, ${randomStyle}`;

      // Masukkan langsung ke input prompt
      promptInput.value = result;

      // Kosongkan hasil output karena tidak perlu tampil di bawah tombol
      output.innerHTML = '';
    } catch (error) {
      output.textContent = 'Failed to enhance prompt: ' + error.message;
    }
  });
});
