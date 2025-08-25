document.addEventListener('DOMContentLoaded', () => {

    // --- Feature 1: Fade-in Animation on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    elementsToFadeIn.forEach((el) => observer.observe(el));

    // --- Feature 2: Day/Night Theme Switch ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove('light-theme');
            if (themeToggle) themeToggle.checked = false;
        }
    };
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            body.classList.toggle('light-theme', themeToggle.checked);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Feature 3: Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });

    // --- FEATURE 4: Automatically Fetch GitHub Projects ---
    const GITHUB_USERNAME = 'RaeXp917';
    const projectGrid = document.getElementById('project-grid');

    async function fetchGitHubProjects() {
        if (!projectGrid) return;

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            const repos = await response.json();

            const filteredRepos = repos.filter(repo => 
                !repo.fork && 
                repo.name !== `${GITHUB_USERNAME}.github.io` &&
                repo.name !== GITHUB_USERNAME
            );
            
            const projectsToShow = filteredRepos.slice(0, 4);

            projectsToShow.forEach(repo => {
                // Check if this is the Kotlin project to assign a special ID
                let cardId = '';
                // The repo for your "E-Efimerevon" project likely has 'pharmacy' in its name.
                // We use this to identify it. Adjust the keyword if your repo is named differently.
                if (repo.name.toLowerCase().includes('pharmacy')) {
                    cardId = ' id="project-e-efimerevon"';
                }

                const projectCardHTML = `
                    <div class="glow-card"${cardId}>
                        <div class="project-card">
                            <h3>${repo.name.replace(/-/g, ' ')}</h3>
                            <p>${repo.description || 'No description provided.'}</p>
                            <p class="technologies"><strong>Main Language:</strong> ${repo.language || 'N/A'}</p>
                            <a href="${repo.html_url}" class="project-link" target="_blank">View on GitHub</a>
                        </div>
                    </div>
                `;
                projectGrid.insertAdjacentHTML('beforeend', projectCardHTML);
            });

        } catch (error) {
            console.error("Failed to fetch GitHub projects:", error);
        }
    }

    // --- NEW FEATURE 5: Interactive Skill Links ---
    function setupSkillLinks() {
        const skillLinks = document.querySelectorAll('a.skill-tag');
        skillLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.dataset.targetId;
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Scroll to the project
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Add highlight class
                    targetElement.classList.add('highlight');

                    // Remove highlight after animation
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 1500); // 1.5 seconds
                }
            });
        });
    }

    // Run the fetch function, and *then* run the setup for skill links
    fetchGitHubProjects().then(() => {
        setupSkillLinks();
    });

});
