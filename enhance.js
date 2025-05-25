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
    "sci-fi style, alien planet background, glowing elements"
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
