// Global data storage
let portfolioData = null;

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', currentTheme === 'dark');

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
});

// Load portfolio data
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        
        // Populate all sections
        populateHero();
        populateAreas();
        populateProjects();
        populateContactLinks();
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Auto-run first terminal demo
        setTimeout(() => {
            if (portfolioData.projects.length > 0) {
                runTerminalDemo(portfolioData.projects[0].id);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Populate hero section
function populateHero() {
    document.getElementById('hero-name').textContent = portfolioData.name;
    document.getElementById('hero-title').textContent = portfolioData.title;
    document.getElementById('hero-subtitle').textContent = portfolioData.subtitle;
    document.getElementById('hero-bio').textContent = portfolioData.bio;
    
    // Hero links
    const linksContainer = document.getElementById('hero-links');
    linksContainer.innerHTML = `
        <a href="#contato" class="text-sm inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
            <i data-lucide="link" class="w-4 h-4"></i> Contato
        </a>
        <a href="${portfolioData.github}" target="_blank" rel="noreferrer" class="text-sm inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
            <i data-lucide="github" class="w-4 h-4"></i> GitHub
        </a>
        <a href="${portfolioData.linkedin}" target="_blank" rel="noreferrer" class="text-sm inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline">
            <i data-lucide="linkedin" class="w-4 h-4"></i> LinkedIn
        </a>
    `;
    
    // Skills tags
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = portfolioData.skills.map(skill => 
        `<span class="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            ${skill.icon} ${skill.name}
        </span>`
    ).join('');
}

// Populate areas section
function populateAreas() {
    const areasContainer = document.getElementById('areas-container');
    areasContainer.innerHTML = portfolioData.areas.map(area => 
        `<div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-3">
                <div class="text-2xl">${area.icon}</div>
                <div>
                    <div class="font-semibold text-sm text-gray-900 dark:text-white">${area.title}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">${area.description}</div>
                </div>
            </div>
        </div>`
    ).join('');
}

// Populate projects section
function populateProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = portfolioData.projects.map(project => 
        `<div class="project-card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow" data-project-id="${project.id}">
            <!-- Project Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${project.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${project.short}</p>
                    <div class="flex flex-wrap gap-2">
                        ${project.tags.map(tag => 
                            `<span class="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="flex items-center gap-2 ml-4">
                    ${project.repo ? `
                        <a href="${project.repo}" target="_blank" rel="noreferrer" 
                           class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <i data-lucide="github" class="w-4 h-4"></i> Repo
                        </a>
                    ` : ''}
                    ${project.link ? `
                        <a href="${project.link}" target="_blank" rel="noreferrer"
                           class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <i data-lucide="external-link" class="w-4 h-4"></i> Demo
                        </a>
                    ` : ''}
                </div>
            </div>
            
            <!-- Terminal Demo -->
            <div class="terminal-container bg-gray-900 text-green-400 rounded-lg overflow-hidden shadow-xl">
                <div class="flex items-center justify-between px-4 py-2 bg-gray-800">
                    <div class="flex items-center gap-2">
                        <i data-lucide="terminal" class="w-5 h-5"></i>
                        <span class="text-sm font-medium text-gray-300">demo/${project.id}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="runTerminalDemo('${project.id}')" 
                                class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            <i data-lucide="play" class="w-3 h-3"></i> Reproduzir
                        </button>
                        <button onclick="copyTerminalContent('${project.id}')"
                                class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                            <i data-lucide="copy" class="w-3 h-3"></i> Copiar
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <pre id="terminal-${project.id}" class="text-sm leading-6 min-h-32 font-mono whitespace-pre-wrap"></pre>
                </div>
            </div>
        </div>`
    ).join('');
}

// Populate contact links
function populateContactLinks() {
    const contactLinksContainer = document.getElementById('contact-links');
    contactLinksContainer.innerHTML = `
        <a href="mailto:${portfolioData.email}" class="hover:text-blue-600 underline">${portfolioData.email}</a>
        <span>·</span>
        <a href="${portfolioData.whatsapp}" target="_blank" rel="noreferrer" class="hover:text-blue-600 underline">WhatsApp</a>
    `;
}

// Terminal demo functionality
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTerminalDemo(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project || !project.terminal_demo) return;
    
    const terminal = document.getElementById(`terminal-${projectId}`);
    const button = document.querySelector(`button[onclick="runTerminalDemo('${projectId}')"]`);
    const demo = project.terminal_demo;
    
    // Desabilitar botão durante execução
    button.disabled = true;
    button.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Executando';
    
    terminal.innerHTML = '';
    
    try {
        for (let i = 0; i < demo.commands.length; i++) {
            const command = demo.commands[i];
            const output = demo.outputs[i];
            
            // Type command
            const commandLine = `${demo.prompt} ${command}`;
            let currentText = '';
            
            for (const char of commandLine) {
                currentText += char;
                terminal.innerHTML = currentText + '<span class="animate-pulse">_</span>';
                await sleep(80);
            }
            
            terminal.innerHTML = currentText + '\n';
            await sleep(800);
            
            // Show output
            if (output) {
                terminal.innerHTML += output + '\n';
                await sleep(1500);
            }
        }
    } finally {
        // Reabilitar botão
        button.disabled = false;
        button.innerHTML = '<i data-lucide="play" class="w-3 h-3"></i> Reproduzir';
        lucide.createIcons();
    }
}

function copyTerminalContent(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project || !project.terminal_demo) return;
    
    const demo = project.terminal_demo;
    let content = '';
    
    for (let i = 0; i < demo.commands.length; i++) {
        content += `${demo.prompt} ${demo.commands[i]}\n`;
        if (demo.outputs[i]) {
            content += demo.outputs[i] + '\n';
        }
    }
    
    navigator.clipboard.writeText(content);
}

// Project filtering
document.getElementById('project-filter').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const projects = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');
    let visibleCount = 0;
    
    projects.forEach(project => {
        const title = project.querySelector('h3').textContent.toLowerCase();
        const description = project.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(project.querySelectorAll('.px-2')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const matches = title.includes(query) || description.includes(query) || tags.includes(query);
        
        if (matches) {
            project.style.display = 'block';
            visibleCount++;
        } else {
            project.style.display = 'none';
        }
    });
    
    if (visibleCount === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create mailto link
    const subject = encodeURIComponent(`Contato do portfólio - ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
    const mailtoLink = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    document.getElementById('contact-result').innerHTML = `
        <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p class="font-medium">✅ Email aberto no seu cliente de email!</p>
            <p class="text-sm">Ou entre em contato diretamente via WhatsApp.</p>
        </div>
    `;
    
    // Reset form
    e.target.reset();
});

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadPortfolioData);
