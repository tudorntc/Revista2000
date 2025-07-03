// Greeting animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const greetings = [
        'Hello',
        'Hola', 
        'Bonjour',
        'Hallo',
        'Ciao',
        'こんにちは',
        '안녕하세요',
        '你好',
        'Olá',
        'Привет',
        'Hello'
    ];

    let index = 0;
    const greetingElement = document.getElementById('greeting');
    const greetingOverlay = document.getElementById('greeting-overlay');
    const greetingContainer = document.getElementById('greeting-container');

    function changeGreeting() {
        greetingElement.textContent = greetings[index];
        
        // First greeting ("Hello") stays for 500ms, others for 200ms
        const delay = index === 0 ? 500 : 200;
        
        index = (index + 1) % greetings.length;
        
        // Check if we completed one full cycle (back to index 0)
        if (index === 0) {
            // Wait 500ms before applying transform
            setTimeout(() => {
                greetingContainer.style.transform = 'translateY(-100%)';
                // Hide the overlay completely after animation finishes
                setTimeout(() => {
                    greetingOverlay.style.display = 'none';
                }, 1500); // Match the transition duration
            }, 300);
            return; // Stop the cycle
        }
        
        setTimeout(changeGreeting, delay);
    }

    // Start the greeting animation
    changeGreeting();
});