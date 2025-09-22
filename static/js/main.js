// Main JavaScript file for the portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }, observerOptions);
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Add fade-in animation to elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
});

// HTMX event listeners
document.addEventListener('htmx:beforeRequest', function(evt) {
    // Add loading state
    evt.target.classList.add('htmx-request');
});

document.addEventListener('htmx:afterRequest', function(evt) {
    // Remove loading state
    evt.target.classList.remove('htmx-request');
    
    // Re-initialize Lucide icons for new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Handle HTMX responses for skills
document.addEventListener('htmx:afterSwap', function(evt) {
    if (evt.target.id === 'skills-container') {
        // Re-render skills with updated data
        const skills = JSON.parse(evt.detail.xhr.responseText);
        let html = '';
        
        skills.forEach(skill => {
            html += `
                <div class="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <span class="text-2xl mr-3">${skill.icon}</span>
                        <h3 class="text-xl font-semibold">${skill.name}</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full skill-bar transition-all duration-1000" 
                             style="width: ${skill.level}%"></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">${skill.level}%</p>
                </div>
            `;
        });
        
        evt.target.innerHTML = html;
        
        // Animate the skill bars
        setTimeout(() => {
            const skillBars = evt.target.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 100);
    }
    
    if (evt.target.id === 'projects-container') {
        // Re-render projects with updated data
        const projects = JSON.parse(evt.detail.xhr.responseText);
        let html = '';
        
        projects.forEach(project => {
            const techTags = project.tech.map(tech => 
                `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${tech}</span>`
            ).join('');
            
            html += `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow project-card">
                    <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span class="text-white text-4xl">${project.name[0]}</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">${project.name}</h3>
                        <p class="text-gray-600 mb-4">${project.description}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${techTags}
                        </div>
                        
                        <div class="flex space-x-4">
                            <a href="${project.github}" 
                               class="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                <i data-lucide="github" class="w-4 h-4 mr-1"></i>
                                GitHub
                            </a>
                            <a href="/project/${project.id}" 
                               class="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                <i data-lucide="external-link" class="w-4 h-4 mr-1"></i>
                                Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        evt.target.innerHTML = html;
    }
});

// Form validation and submission feedback
document.addEventListener('htmx:responseError', function(evt) {
    const target = document.getElementById('contact-result');
    if (target) {
        target.innerHTML = `
            <div class="alert alert-error">
                <p>Erro ao enviar mensagem. Tente novamente.</p>
            </div>
        `;
    }
});

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-sm`;
    notification.innerHTML = `<p>${message}</p>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Export functions for global use
window.portfolioUtils = {
    showNotification
};
