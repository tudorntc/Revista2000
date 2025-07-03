document.addEventListener('DOMContentLoaded', function() {
    const elevator = document.querySelector('.elevator-image');
    const elevatorContainer = document.querySelector('.elevator');
    const scrollableDiv = document.querySelector('.scrollable-div');
    const topFloor = document.querySelector('.top-floor');
    const bottomFloor = document.querySelector('.bottom-floor');
    const altitudeValue = document.querySelector('.altitude-value');
    const currentSectionDisplay = document.querySelector('.current-section');
    const progressFill = document.querySelector('.progress-fill');
    const contentSections = document.querySelectorAll('.content-section');

    // Define year ranges for each section
    const yearRanges = [
        { element: document.getElementById('turn-of-century'), name: '1900-1910', minYear: 1900, maxYear: 1910 },
        { element: document.getElementById('early-teens'), name: '1910-1920', minYear: 1910, maxYear: 1920 },
        { element: document.getElementById('roaring-twenties'), name: '1920-1930', minYear: 1920, maxYear: 1930 },
        { element: document.getElementById('depression-era'), name: '1930-1940', minYear: 1930, maxYear: 1940 },
        { element: document.getElementById('war-innovation'), name: '1940-1950', minYear: 1940, maxYear: 1950 },
        { element: document.getElementById('fifties-boom'), name: '1950-1960', minYear: 1950, maxYear: 1960 },
        { element: document.getElementById('space-age'), name: '1960-1970', minYear: 1960, maxYear: 1970 },
        { element: document.getElementById('personal-computing'), name: '1970-1980', minYear: 1970, maxYear: 1980 },
        { element: document.getElementById('pc-revolution'), name: '1980-1990', minYear: 1980, maxYear: 1990 },
        { element: document.getElementById('world-wide-web'), name: '1990-2000', minYear: 1990, maxYear: 2000 },
        { element: document.getElementById('social-media-birth'), name: '2000-2010', minYear: 2000, maxYear: 2010 },
        { element: document.getElementById('mobile-first'), name: '2010-2020', minYear: 2010, maxYear: 2020 },
        { element: document.getElementById('ai-revolution'), name: '2020-2025', minYear: 2020, maxYear: 2025 },
        { element: document.getElementById('future-glimpse'), name: 'The Future', minYear: 2025, maxYear: 2030 }
    ];

    // Set initial position - below top floor
    const topFloorHeight = topFloor.offsetHeight;
    const bottomFloorHeight = bottomFloor.offsetHeight;
    const elevatorHeight = elevator.offsetHeight;
    const containerHeight = elevatorContainer.offsetHeight;

    // Calculate the travel range
    const minPosition = topFloorHeight; // Start below top floor
    const maxPosition = containerHeight - bottomFloorHeight - elevatorHeight; // End above bottom floor
    const travelDistance = maxPosition - minPosition;

    // Function to update elevator position based on scroll
    function updateElevatorPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = scrollableDiv.offsetHeight - window.innerHeight;
        
        // Calculate scroll percentage (0 to 1)
        const scrollPercentage = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
        
        // Define the elevator movement phases
        const elevatorMovementRange = 0.3; // Elevator moves only for first 30% of scroll
        const centerPosition = containerHeight / 2 - elevatorHeight / 2; // Center of screen
        
        let elevatorPosition;
        
        if (scrollPercentage <= elevatorMovementRange) {
            // Phase 1: Elevator moves from start position to center
            const movementProgress = scrollPercentage / elevatorMovementRange;
            elevatorPosition = minPosition + (movementProgress * (centerPosition - minPosition));
        } else {
            // Phase 2: Elevator stays fixed at center while content continues scrolling
            elevatorPosition = centerPosition;
        }
        
        // Update elevator position
        elevator.style.top = elevatorPosition + 'px';
        elevator.style.transform = 'translateX(-50%)';
        
        // Calculate current year (1900 to 2025)
        const currentYear = Math.round(1900 + (scrollPercentage * 125)); // 125 years total (1900-2025)
        altitudeValue.textContent = currentYear;
        
        // Update progress bar
        progressFill.style.width = (scrollPercentage * 100) + '%';
        
        // Determine current section and update display
        let currentSection = yearRanges[0];
        for (let range of yearRanges) {
            if (currentYear >= range.minYear && currentYear <= range.maxYear) {
                currentSection = range;
                break;
            }
        }
        
        currentSectionDisplay.textContent = currentSection.name;
        
        // Show/hide content sections based on visibility
        contentSections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Listen for scroll events with throttling for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateElevatorPosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });

    // Set initial position
    updateElevatorPosition();
});