document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  if (enhanceBtn) {
    enhanceBtn.addEventListener('click', async () => {
      const prompt = promptInput.value.trim();
      if (!prompt) {
        output.textContent = 'Silakan masukkan prompt untuk ditingkatkan.';
        return;
      }

      output.innerHTML = '<div class="loading-state"><span class="loading-spinner"></span><span>Meningkatkan prompt...</span></div>';
      enhanceBtn.disabled = true;

      try {
        // Template prompt yang dioptimalkan untuk Pollinations.ai
        const enhancementPrompt = `Tolong tingkatkan kualitas prompt berikut untuk pemrosesan AI:
        
        Prompt asli: "${prompt}"
        
        Berikan versi yang lebih detail dan jelas dengan:
        1. Menambahkan konteks spesifik
        2. Memperjelas tujuan
        3. Menyertakan contoh jika perlu
        4. Menggunakan bahasa yang lebih terstruktur
        
        Prompt yang ditingkatkan:`;

        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            model: "text-davinci-003",  // Model yang lebih didukung di Pollinations
            prompt: enhancementPrompt,
            temperature: 0.6,  // Nilai optimal untuk keseimbangan kreativitas
            max_tokens: 250,   // Sesuai dengan batasan Pollinations
            top_p: 1.0         // Parameter yang didukung
          })
        });

        const result = await response.json();
        let enhancedText = result.choices?.[0]?.text || result.text || 'Tidak ada hasil yang diterima';
        
        // Bersihkan output dan format
        enhancedText = enhancedText.trim()
          .replace(/^Prompt yang ditingkatkan:/, '')
          .replace(/^["']+|["']+$/g, '');

        output.innerHTML = `
          <div class="result-container">
            <div class="enhanced-prompt">
              <h4>Prompt Hasil Peningkatan:</h4>
              <p>${enhancedText.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="original-prompt">
              <h4>Prompt Asli:</h4>
              <p>${prompt}</p>
            </div>
          </div>
        `;
      } catch (error) {
        output.innerHTML = `<div class="error">Gagal meningkatkan prompt: ${error.message || 'Error jaringan'}</div>`;
        console.error('Error:', error);
      } finally {
        enhanceBtn.disabled = false;
      }
    });
  }
});
