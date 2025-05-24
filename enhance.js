document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  if (enhanceBtn) {
    enhanceBtn.addEventListener('click', async () => {
      const prompt = promptInput.value.trim();
      if (!prompt) {
        output.textContent = 'Prompt cannot be empty.';
        return;
      }

      output.innerHTML = '<span class="loading-spinner"></span>Enhancing...';

      try {
        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const result = await response.json();
        output.textContent = result.text || 'No enhanced text received.';
      } catch (error) {
        output.textContent = 'Failed to enhance prompt: ' + error.message;
      }
    });
  }
});
