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
            const filteredRepos = repos.filter(repo => !repo.fork && repo.name !== `${GITHUB_USERNAME}.github.io` && repo.name !== GITHUB_USERNAME && repo.name !== 'On-Duty-Pharmacies-App' && repo.name !== 'Context-Nexus-Website');
            const projectsToShow = filteredRepos.slice(0, 4);
            projectGrid.innerHTML = ''; 
            projectsToShow.forEach(repo => {
                const repoLang = repo.language ? repo.language.toLowerCase().replace(/[\s+#]/g, '-') : '';
                
                // --- MODIFIED PART ---
                // The entire card is now wrapped in an anchor tag. The old text link is removed.
                const projectCardHTML = `
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card-link">
                    <div class="glow-card fade-in" data-technologies="${repoLang} github">
                        <div class="project-card">
                            <h3>${repo.name.replace(/-/g, ' ')}</h3>
                            <p>${repo.description || 'No description provided.'}</p>
                            <p class="technologies"><strong>Main Language:</strong> ${repo.language || 'N/A'}</p>
                        </div>
                    </div>
                </a>`;
                // --- END OF MODIFICATION ---
                
                projectGrid.insertAdjacentHTML('beforeend', projectCardHTML);
            });
            const newCards = projectGrid.querySelectorAll('.fade-in');
            newCards.forEach(card => observer.observe(card));
            initializeSkillLinking();
        } catch (error) {
            console.error("Failed to fetch GitHub projects:", error);
            projectGrid.innerHTML += `<p>Could not load projects from GitHub.</p>`;
        }
    }
    fetchGitHubProjects();

    // --- Feature 6: Skill Tag to Project Scrolling ---
    function initializeSkillLinking() {
        document.querySelectorAll('[data-skill]').forEach(tag => tag.replaceWith(tag.cloneNode(true)));
        document.querySelectorAll('[data-skill]').forEach(tag => {
            tag.addEventListener('click', () => {
                const skill = tag.dataset.skill;
                const projectToScrollTo = document.querySelector(`[data-technologies*="${skill}"]`);
                if (projectToScrollTo) {
                    projectToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    projectToScrollTo.classList.add('highlight');
                    setTimeout(() => projectToScrollTo.classList.remove('highlight'), 2000);
                } else {
                    console.warn(`No project found for skill: ${skill}`);
                }
            });
        });
    }
    initializeSkillLinking();

    // --- Feature 7: Mobile Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');
    if (hamburgerBtn && mobileNavPanel) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileNavPanel.classList.toggle('open');
        });
        mobileNavPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNavPanel.classList.remove('open');
            });
        });
    }

    // --- UPDATED Feature 8: Active Nav Link Highlighting (for ALL menus) ---
    const sections = document.querySelectorAll('main section[id]');
    // Selects links from both the mobile nav and the new side nav
    const allNavLinks = document.querySelectorAll('.mobile-nav a, #side-nav a');

    const navHighlighter = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Simply toggle the .nav-active class
                allNavLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(section => navHighlighter.observe(section));
})
