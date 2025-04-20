/**
 * Global Tooltip Management
 * 
 * This script implements a global tooltip approach that eliminates tooltip
 * overlapping issues by ensuring only one tooltip is visible at a time.
 * It properly positions tooltips based on viewport constraints and handles
 * mobile-specific behavior.
 */

// Initialize the tooltip functionality when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeTooltips);

// Make initializeTooltips available globally so it can be called after dynamic content updates
window.initializeTooltips = initializeTooltips;

function initializeTooltips() {
    console.log('Initializing tooltips...');
    
    // Create global tooltip container if it doesn't exist
    let globalTooltip = document.querySelector('.global-tooltip');
    
    if (!globalTooltip) {
        globalTooltip = document.createElement('div');
        globalTooltip.className = 'global-tooltip';
        document.body.appendChild(globalTooltip);
        console.log('Created global tooltip container');
    }
    
    // Get all scientific terms
    const scientificTerms = document.querySelectorAll('.scientific-term');
    console.log(`Found ${scientificTerms.length} scientific terms`);
    
    // Track current active term
    let currentTerm = null;
    let isMobile = window.innerWidth < 768;
    let touchStartTime = 0;
    
    // Function to position the tooltip
    function positionTooltip(term, tooltip) {
        const termRect = term.getBoundingClientRect();
        const tooltipWidth = 280; // Same as in CSS
        
        // Default position above the term
        let top = termRect.top - 10; // 10px gap
        let left = termRect.left + (termRect.width / 2);
        
        // On mobile, center in screen
        if (isMobile) {
            tooltip.classList.add('mobile-centered');
            return; // Early return since we're using CSS to center
        } else {
            tooltip.classList.remove('mobile-centered');
        }
        
        // Check if tooltip would go off the top of screen
        if (top < 70) { // Too close to top (accounting for header space)
            // Position below instead
            top = termRect.bottom + 10;
            tooltip.classList.add('position-below');
        } else {
            tooltip.classList.remove('position-below');
        }
        
        // Horizontal positioning
        if (left < tooltipWidth / 2) {
            // Too close to left edge
            left = Math.max(10, termRect.left);
            tooltip.classList.add('align-left');
        } else if (left + (tooltipWidth / 2) > window.innerWidth) {
            // Too close to right edge
            left = Math.min(window.innerWidth - 10 - tooltipWidth, termRect.right - tooltipWidth);
            tooltip.classList.add('align-right');
        } else {
            // Center aligned
            left = left - (tooltipWidth / 2);
            tooltip.classList.remove('align-left');
            tooltip.classList.remove('align-right');
        }
        
        // Set the position
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }
    
    // Process all scientific term elements
    scientificTerms.forEach(term => {
        // Store the tooltip content
        const tooltipElement = term.querySelector('.tooltip-text');
        if (tooltipElement) {
            term.dataset.tooltip = tooltipElement.innerHTML;
            
            // Remove the original tooltip element
            tooltipElement.remove();
            console.log('Processed tooltip for term:', term.textContent.trim());
        } else {
            console.log('No tooltip text found for term:', term.textContent.trim());
        }
        
        // Remove any existing event listeners to prevent duplicates
        term.removeEventListener('mouseenter', showTooltip);
        term.removeEventListener('mouseleave', hideTooltip);
        term.removeEventListener('touchstart', handleTouchStart);
        term.removeEventListener('touchend', handleTouchEnd);
        
        // Desktop interactions
        // Mouse enter - show tooltip
        term.addEventListener('mouseenter', showTooltip);
        
        // Mouse leave - hide tooltip
        term.addEventListener('mouseleave', hideTooltip);
        
        // Mobile interactions
        // Touch start
        term.addEventListener('touchstart', handleTouchStart, { passive: true });
        
        // Touch end - show tooltip on tap
        term.addEventListener('touchend', handleTouchEnd);
    });
    
    // Event handler for showing tooltip
    function showTooltip() {
        if (isMobile) return; // Skip on mobile
        
        // Set content
        globalTooltip.innerHTML = this.dataset.tooltip || "No tooltip content available";
        
        // Position tooltip
        positionTooltip(this, globalTooltip);
        
        // Show tooltip
        globalTooltip.style.display = 'block';
        setTimeout(() => {
            globalTooltip.classList.add('visible');
        }, 10);
        
        currentTerm = this;
        console.log('Showing tooltip for:', this.textContent.trim());
    }
    
    // Event handler for hiding tooltip
    function hideTooltip() {
        if (isMobile) return; // Skip on mobile
        
        if (currentTerm === this) {
            globalTooltip.classList.remove('visible');
            setTimeout(() => {
                globalTooltip.style.display = 'none';
            }, 200);
            currentTerm = null;
            console.log('Hiding tooltip');
        }
    }
    
    // Touch start event handler
    function handleTouchStart(e) {
        touchStartTime = Date.now();
    }
    
    // Touch end event handler
    function handleTouchEnd(e) {
        // Only show tooltip if it was a quick tap (not a scroll)
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 300) {
            e.preventDefault();
            
            // Hide any existing tooltip
            globalTooltip.classList.remove('visible');
            globalTooltip.style.display = 'none';
            
            // If tapping the same term, just toggle off
            if (currentTerm === this) {
                currentTerm = null;
                return;
            }
            
            // Set content
            globalTooltip.innerHTML = this.dataset.tooltip || "No tooltip content available";
            
            // Position tooltip (centered on mobile)
            positionTooltip(this, globalTooltip);
            
            // Show tooltip
            globalTooltip.style.display = 'block';
            setTimeout(() => {
                globalTooltip.classList.add('visible');
            }, 10);
            
            currentTerm = this;
            console.log('Showing tooltip on tap for:', this.textContent.trim());
        }
    }
    
    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.scientific-term') && !e.target.closest('.global-tooltip')) {
            globalTooltip.classList.remove('visible');
            setTimeout(() => {
                globalTooltip.style.display = 'none';
            }, 200);
            currentTerm = null;
        }
    });
    
    // Handle window resize and update mobile state
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
        if (currentTerm) {
            positionTooltip(currentTerm, globalTooltip);
        }
    });
    
    // Handle scroll events - reposition tooltip
    window.addEventListener('scroll', function() {
        if (currentTerm && !isMobile) {
            positionTooltip(currentTerm, globalTooltip);
        }
    }, { passive: true });
    
    // Handle click on mobile tooltip close button
    globalTooltip.addEventListener('click', function(e) {
        if (isMobile && e.target === this.querySelector('::before')) {
            globalTooltip.classList.remove('visible');
            setTimeout(() => {
                globalTooltip.style.display = 'none';
            }, 200);
            currentTerm = null;
        }
    });
}