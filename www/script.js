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

    // Define altitude ranges for each section
    const altitudeRanges = [
        { element: document.getElementById('ground-level'), name: 'Ground Level', minAlt: 0, maxAlt: 100 },
        { element: document.getElementById('buildings'), name: 'Skyscrapers', minAlt: 100, maxAlt: 1000 },
        { element: document.getElementById('mountains'), name: 'Mountain Peaks', minAlt: 1000, maxAlt: 10000 },
        { element: document.getElementById('aircraft'), name: 'Commercial Aviation', minAlt: 10000, maxAlt: 15000 },
        { element: document.getElementById('stratosphere'), name: 'Stratosphere', minAlt: 15000, maxAlt: 50000 },
        { element: document.getElementById('space'), name: 'Edge of Space', minAlt: 50000, maxAlt: 100000 }
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
        
        // Calculate current altitude (0 to 100,000m) - this continues throughout entire scroll
        const currentAltitude = Math.round(scrollPercentage * 100000);
        altitudeValue.textContent = currentAltitude.toLocaleString();
        
        // Update progress bar
        progressFill.style.width = (scrollPercentage * 100) + '%';
        
        // Determine current section and update display
        let currentSection = altitudeRanges[0];
        for (let range of altitudeRanges) {
            if (currentAltitude >= range.minAlt && currentAltitude <= range.maxAlt) {
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