document.addEventListener('DOMContentLoaded', () => {

    // --- Feature 1: Fade-in Animation on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    elementsToFadeIn.forEach((el) => observer.observe(el));

    // --- Feature 2: Day/Night Theme Switch ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const applyTheme = (theme) => {
        body.classList.toggle('light-theme', theme === 'light');
        if(themeToggle) themeToggle.checked = theme === 'light';
    };
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Feature 3: Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) preloader.classList.add('hidden');
    });

    // --- Feature 4: Language Switcher ---
    const langEnBtn = document.getElementById('lang-en-btn');
    const langGrBtn = document.getElementById('lang-gr-btn');
    
    const setLanguage = async (lang) => {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();
        
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[key]) {
                elem.innerHTML = translations[key];
            }
        });

        document.documentElement.lang = lang; 
        localStorage.setItem('language', lang); 

        // Update active button state
        langEnBtn.classList.toggle('active', lang === 'en');
        langGrBtn.classList.toggle('active', lang === 'gr');
    };
    
    if (langEnBtn && langGrBtn) {
        langEnBtn.addEventListener('click', () => setLanguage('en'));
        langGrBtn.addEventListener('click', () => setLanguage('gr'));
    }
    
    const savedLang = localStorage.getItem('language') || (navigator.language.startsWith('el') ? 'gr' : 'en');
    setLanguage(savedLang);


    // --- Feature 5: Automatically Fetch GitHub Projects ---
    const GITHUB_USERNAME = 'RaeXp917';
    const projectGrid = document.getElementById('github-project-grid');

    async function fetchGitHubProjects() {
        if (!projectGrid) return;

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            const repos = await response.json();
            
            // BUG FIX: Simplified filter to ensure other projects appear
            const filteredRepos = repos.filter(repo => 
                !repo.fork &&
                repo.name !== `${GITHUB_USERNAME}.github.io` &&
                repo.name !== GITHUB_USERNAME &&
                repo.name !== 'On-Duty-Pharmacies-App' 
            );
            
            // Limit to the latest projects
            const projectsToShow = filteredRepos.slice(0, 4);

            projectGrid.innerHTML = ''; // Clear previous content

            projectsToShow.forEach(repo => {
                const projectCardHTML = `
                    <div class="glow-card fade-in">
                        <div class="project-card">
                            <h3>${repo.name.replace(/-/g, ' ')}</h3>
                            <p>${repo.description || 'No description provided.'}</p>
                            <p class="technologies"><strong>Main Language:</strong> ${repo.language || 'N/A'}</p>
                            <a href="${repo.html_url}" class="project-link" target="_blank" data-key="viewOnGithub">View on GitHub</a>
                        </div>
                    </div>`;
                projectGrid.insertAdjacentHTML('beforeend', projectCardHTML);
            });

            // Re-observe new elements for fade-in effect
            const newCards = projectGrid.querySelectorAll('.fade-in');
            newCards.forEach(card => observer.observe(card));

        } catch (error) {
            console.error("Failed to fetch GitHub projects:", error);
            projectGrid.innerHTML += `<p>Could not load projects from GitHub.</p>`;
        }
    }

    fetchGitHubProjects();
});
