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

    // --- NEW FEATURE 4: Automatically Fetch GitHub Projects ---
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

            // Filter out the portfolio repo itself and the profile README
            const filteredRepos = repos.filter(repo => 
                !repo.fork && 
                repo.name !== `${GITHUB_USERNAME}.github.io` &&
                repo.name !== GITHUB_USERNAME
            );
            
            // Limit to the latest projects (e.g., 3, to make a total of 4 with the featured one)
            const projectsToShow = filteredRepos.slice(0, 3);

            projectsToShow.forEach(repo => {
                const projectCardHTML = `
                    <div class="glow-card">
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
            projectGrid.innerHTML += `<p>Could not load projects from GitHub.</p>`;
        }
    }

    fetchGitHubProjects();
});
