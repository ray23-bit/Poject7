
    // Dark Mode Script
    document.addEventListener('DOMContentLoaded', function() {

        // Warn user if Turbo model is selected
        const modelSelect = document.getElementById('model');
        modelSelect.addEventListener('change', function() {
            if (modelSelect.value === 'turbo') {
                showNotification('Turbo model is faster but may produce less detailed images for complex styles.', 'warning');
            }
        });

        // Theme Switch Functionality
        const toggleSwitch = document.querySelector('#theme-checkbox');
        const currentTheme = localStorage.getItem('theme');
        const sunIcon = document.querySelector('.fa-sun');
        const moonIcon = document.querySelector('.fa-moon');

        // Set initial theme
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            if (currentTheme === 'dark') {
                toggleSwitch.checked = true;
                updateIcons(true);
            }
        }

        // Switch theme function
        function switchTheme(e) {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateIcons(true);
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateIcons(false);
            }
        }

        // Update icons based on theme
        function updateIcons(isDark) {
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            } else {
                sunIcon.style.display = 'inline-block';
                moonIcon.style.display = 'none';
            }
        }

        // Event listener for switch
        toggleSwitch.addEventListener('change', switchTheme, false);

        // Toggle advanced settings
        const toggleAdvanced = document.querySelector('.toggle-advanced');
        const advancedSettings = document.querySelector('.advanced-settings');
        
        toggleAdvanced.addEventListener('click', function() {
            if (advancedSettings.style.display === 'none') {
                advancedSettings.style.display = 'block';
                toggleAdvanced.innerHTML = '<i class="fas fa-cogs"></i> Hide Advanced Settings';
            } else {
                advancedSettings.style.display = 'none';
                toggleAdvanced.innerHTML = '<i class="fas fa-cogs"></i> Advanced Settings';
            }
        });
        
        // Art style selection
        const artStyleOptions = document.querySelectorAll('.art-style-option');
        artStyleOptions.forEach(option => {
            option.addEventListener('click', function() {
                artStyleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Generate image
        const generateBtn = document.getElementById('generate-btn');
        const regenerateBtn = document.getElementById('regenerate-btn');
        const resetBtn = document.getElementById('reset-btn');
        const promptInput = document.getElementById('prompt');
        const aspectRatio = document.getElementById('aspect-ratio');
        const model = document.getElementById('model');
        const seed = document.getElementById('seed');
        const enhance = document.getElementById('enhance');
        const negativePrompt = document.getElementById('negative-prompt');
        const placeholder = document.getElementById('placeholder');
        const loading = document.getElementById('loading');
        const imagePreview = document.getElementById('image-preview');
        const downloadBtn = document.getElementById('download-btn');
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const clearPromptBtn = document.getElementById('clearPrompt');
        
        // Clear prompt button
        clearPromptBtn.addEventListener('click', function() {
            promptInput.value = '';
            showNotification('Prompt cleared', 'success');
        });
        
        // Translate functionality
        const translateBtn = document.getElementById('translateBtn');
        const languageSelect = document.getElementById('language-select');
        
        translateBtn.addEventListener('click', async function() {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                showNotification('Please enter a prompt to translate', 'error');
                return;
            }
            
            const targetLang = languageSelect.value;
            try {
                translateBtn.disabled = true;
                translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
                
                // Using Google Translate API
                const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(prompt)}`;
                const response = await fetch(translateUrl);
                const data = await response.json();
                
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    promptInput.value = data[0][0][0];
                    showNotification('Prompt translated successfully', 'success');
                } else {
                    showNotification('Translation failed', 'error');
                }
            } catch (error) {
                console.error('Translation error:', error);
                showNotification('Error during translation', 'error');
            } finally {
                translateBtn.disabled = false;
                translateBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
            }
        });
        
        // Store last used prompt for regeneration
        let lastPrompt = '';
        
        // Enhanced Generate image function
        
// Preset untuk gaya seni
const stylePresets = {
    realistic: "photo-realistic, skin texture, true lighting, depth of field, high resolution, natural tones",
    fantasy: "ethereal, epic fantasy, glowing runes, mystical landscapes, high detail, enchanted atmosphere",
    anime: "clean lines, cel shading, anime eyes, dynamic pose, colorful background, high detail",
    painting: "oil on canvas, painterly brush strokes, impasto technique, expressive texture, museum style",
    cyberpunk: "futuristic cityscape, neon lights, glowing eyes, chrome finish, tech aesthetics, rain ambiance",
    watercolor: "soft gradient, pigment spread, canvas texture, light wash, hand-painted feel",
    photography: "DSLR photo, bokeh, high dynamic range, true-to-life, cinematic composition",
    surrealism: "dream logic, paradox elements, floating objects, hyper realism, dali inspired",
    fractal: "recursive geometry, luminous fractals, complex patterns, glowing symmetry, kaleidoscopic effect",
    macabre: "dark fantasy, gothic horror, decayed beauty, intricate bones, shadow play, expressive gloom"
};

// Preset untuk model AI
const modelBoosts = {
    turbo: "optimized for fast rendering, simplified details, low latency, vivid textures",
    premium: "hyper detailed, 16k resolution, cinematic lighting, fine textures, ray tracing"
};

// Negative prompt default
const defaultNegatives = [
    "blurry", "lowres", "bad anatomy", "text", "signature", "watermark",
    "missing fingers", "deformed", "jpeg artifacts", "error"
];


async function generateImage() {
            let prompt = promptInput.value.trim();
            if (!prompt) {
                showNotification('Please enter a prompt to generate an image', 'error');
                return;
            }

            // Store the prompt for regeneration
            lastPrompt = prompt;
            
            // Show loading, hide placeholder
            placeholder.style.display = 'none';
            loading.style.display = 'flex';
            imagePreview.style.display = 'none';
            downloadBtn.style.display = 'none';
            regenerateBtn.style.display = 'none';
            
            // Get selected art style
            let artStyle = 'realistic';
            const selectedStyle = document.querySelector('.art-style-option.selected');
            if (selectedStyle) {
                artStyle = selectedStyle.dataset.style;
            }
            
            // Get aspect ratio dimensions with updated sizes
            let width, height;
            switch (aspectRatio.value) {
                case 'portrait':
                    width = 1024;
                    height = 1792;
                    break;
                case 'square':
                    width = 1024;
                    height = 1024;
                    break;
                case 'landscape':
                    width = 1792;
                    height = 1024;
                    break;
                case 'custom':
                    width = 1024; // default custom size
                    height = 1024;
                    break;
                default:
                    width = 1024;
                    height = 1024;
            }
                
            
            // Enhanced quality keywords
            const baseQualityKeywords = "8k, ultra HD, intricate details, professional photography, sharp focus, 64 megapixels, HDR, masterpiece, highly detailed, artstation trending, ultra sharp, 8k post-processing, studio quality, cinematic lighting, global illumination, ray tracing, volumetric lighting";
            
            // Enhanced style-specific prompts
            
const styleKeywordsInput = document.getElementById('style-keywords');
const stepsInput = document.getElementById('steps');
const cfgScaleInput = document.getElementById('cfg-scale');
const enhancerToggle = document.getElementById('quality-enhancer');

let fullPrompt = prompt;

if (enhancerToggle.checked) {
    fullPrompt += ', ' + baseQualityKeywords;
}

if (model.value === 'turbo') {
    fullPrompt += ', optimized for fast rendering, 8k ultra HD, high resolution, sharp details, cinematic lighting, well textured, clean image, noise-free, realistic depth, enhanced quality';
} else if (model.value === 'premium') {
    fullPrompt += ', hyper detailed, 16k rendering...';
}

if (styleKeywordsInput.value.trim()) {
    fullPrompt += ', ' + styleKeywordsInput.value.trim();
}


            // Add extra keywords if Turbo model is selected
            if (model.value === 'turbo') {
                fullPrompt += ', optimized for fast rendering, simplified details, low latency enhancement, vivid but less complex textures';
            }

            if (model.value === 'premium') {
                fullPrompt += ', hyper detailed, 16k rendering, sharpest edges, studio-grade lighting, ultra fine textures, ultra realism, cinematic color grading';
            }
            switch (artStyle) {
                case 'realistic':
                    fullPrompt += ', ultra realistic, photorealistic, cinematic lighting, skin pores, fabric texture, detailed reflections';
                    break;
                case 'fantasy':
                    fullPrompt += ', fantasy art, dreamlike, magical, ethereal, otherworldly, intricate designs, detailed costumes';
                    break;
                case 'anime':
                    fullPrompt += ', anime style, studio ghibli, makoto shinkai, vibrant colors, crisp lineart, detailed backgrounds';
                    break;
                case 'painting':
                    fullPrompt += ', oil painting, brush strokes, artistic, impasto technique, visible texture, canvas grain';
                    break;
                case 'cyberpunk':
                    fullPrompt += ', cyberpunk style, neon lights, futuristic, rainy cityscape, reflective surfaces, detailed holograms';
                    break;
                case 'watercolor':
                    fullPrompt += ', watercolor painting, soft edges, artistic, delicate washes, paper texture, pigment dispersion';
                    break;
                case 'photography':
                    fullPrompt += ', professional photography, DSLR, high quality, bokeh, shallow depth of field, film grain, high dynamic range';
                    break;
                case 'surrealism':
                    fullPrompt += ', surrealism art, dreamlike, bizarre, Salvador Dali style, metaphysical, hyper-detailed';
                    break;
                case 'macabre':
                    fullPrompt += ', macabre art, gothic horror, dark surrealism, decaying beauty, anatomical accuracy, dramatic shadows, haunted expressionism, baroque gore, chiaroscuro, twisted elegance';
                    break;
                case 'fractal':
                    fullPrompt += ', fractal art, highly intricate, infinite recursive patterns, glowing edges, complex symmetry, sacred geometry, cosmic forms, surreal light, deep mathematical aesthetics';
                    break;
            }
            
            // Enhanced negative prompt with default values
            let fullNegativePrompt = negativePrompt.value.trim() || "blurry, lowres, bad anatomy, bad hands, text, error, missing fingers, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, deformed";
            
            try {
                // Enhanced API parameters with quality boost
                
                const encodedPrompt = encodeURIComponent(fullPrompt);
                const randomSeed = seed.value > 0 ? seed.value : Math.floor(Math.random() * 999999) + 1;
                const stepsVal = parseInt(stepsInput.value) || 50;
const cfgVal = parseFloat(cfgScaleInput.value) || 12;
const qualityParams = `width=${width}&height=${height}&nologo=true&seed=${randomSeed}&steps=${stepsVal}&cfg_scale=${cfgVal}&upscale=true`;

                let apiUrl;
                if (model.value === 'default') {
                    apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${qualityParams}`;
                } else {
                    apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model.value}&${qualityParams}`;
                }

                if (fullNegativePrompt) {
                    apiUrl += `&negative_prompt=${encodeURIComponent(fullNegativePrompt)}`;
                }

                apiUrl += `&timestamp=${Date.now()}`;
    
                
                // Load image
                imagePreview.src = apiUrl;
                
                // When image loads
                imagePreview.onload = function() {
                    loading.style.display = 'none';
                    imagePreview.style.display = 'block';
                    downloadBtn.style.display = 'inline-flex';
                    regenerateBtn.style.display = 'inline-flex';
                    
                    // Verify image size
                    fetch(imagePreview.src)
                        .then(response => response.blob())
                        .then(blob => {
                            const sizeInKB = Math.round(blob.size / 1024);
                            showNotification(`Image generated successfully! (${sizeInKB}KB)`, 'success');
                        });
                };
                
                // Handle errors
                imagePreview.onerror = function() {
                    loading.style.display = 'none';
                    placeholder.style.display = 'flex';
                    showNotification('Error generating image. Please try again with different settings.', 'error');
                };
            } catch (error) {
                console.error('Error:', error);
                loading.style.display = 'none';
                placeholder.style.display = 'flex';
                showNotification('An error occurred. Please try again.', 'error');
            }
        }
        
        // Generate button click
        generateBtn.addEventListener('click', generateImage);
        
        // Regenerate button click
        regenerateBtn.addEventListener('click', function() {
            if (!lastPrompt) {
                showNotification('No previous prompt to regenerate from', 'error');
                return;
            }
            
            // Set the seed to 0 to get a different image
            seed.value = 0;
            generateImage();
        });
        
        // Reset button click
        resetBtn.addEventListener('click', function() {
            promptInput.value = '';
            negativePrompt.value = '';
            seed.value = 0;
            aspectRatio.value = 'square';
            model.value = 'premium';
            enhance.value = 'super';
            
            // Reset art style to realistic
            artStyleOptions.forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.art-style-option[data-style="realistic"]').classList.add('selected');
            
            // Reset preview
            placeholder.style.display = 'flex';
            loading.style.display = 'none';
            imagePreview.style.display = 'none';
            downloadBtn.style.display = 'none';
            regenerateBtn.style.display = 'none';
            
            showNotification('Form has been reset', 'success');
        });
        
        // Download image
        downloadBtn.addEventListener('click', async function() {
            if (!imagePreview.src || imagePreview.src.includes('data:')) {
                showNotification('No image available to download', 'error');
                return;
            }
            
            try {
                // Fetch the image as a blob
                const response = await fetch(imagePreview.src);
                const blob = await response.blob();
                
                // Create a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Set the filename
                const prompt = promptInput.value.trim().substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
                a.download = `rizqi-o-ai-${prompt || 'image'}-${Date.now()}.jpg`;
                
                // Trigger download
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                showNotification('Image downloaded successfully!', 'success');
            } catch (error) {
                console.error('Download error:', error);
                showNotification('Failed to download image', 'error');
            }
        });
        
        // Notification system
        function showNotification(message, type) {
            notification.className = `notification ${type}`;
            notificationMessage.textContent = message;
            
            if (type === 'success') {
                notification.querySelector('i').className = 'fas fa-check-circle';
            } else if (type === 'error') {
                notification.querySelector('i').className = 'fas fa-exclamation-circle';
            } else {
                notification.querySelector('i').className = 'fas fa-info-circle';
            }
            
            notification.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Enhanced PWA Installation
        const installButton = document.getElementById('installButton');
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show the install button
            installButton.style.display = 'inline-flex';
            
            installButton.addEventListener('click', () => {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted install prompt');
                        showNotification('App installed successfully!', 'success');
                    } else {
                        console.log('User dismissed install prompt');
                    }
                    installButton.style.display = 'none';
                    deferredPrompt = null;
                });
            });
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            installButton.style.display = 'none';
            deferredPrompt = null;
        });

        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            installButton.style.display = 'none';
        }
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
