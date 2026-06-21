document.addEventListener("DOMContentLoaded", function() {
    // Initialize carousel
    var carouselCounter = 0;
    var slides = document.getElementsByClassName("motion-hero-img");
    var slideTexts = document.getElementsByClassName("motion-hero-text");
    var indicators = document.getElementsByClassName("motion-carousel__indicator");
    var slideIndex = 1;
    var previousIndex = 0; // Track previous slide for animations
    
    // Set Click to right arrow
    var rightArrow = document.querySelector('.motion-carousel__arrow');
    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            plusSlides(1);
        });
    }

    // Set counter based on slide number
    carouselCounter = slides.length;
    
    // Create indicators dynamically if needed
    if (carouselCounter > 0) {
        var carouselIndicatorsHTML = '';
        for (let i = 1; i <= carouselCounter; i++) {
            carouselIndicatorsHTML += '<span class="motion-carousel__indicator" onclick="currentSlide(' + i + ')" ></span>';
        }
        
        var carouselIndicators = document.getElementById('home-carousel-indicators');
        if (carouselIndicators) {
            carouselIndicators.innerHTML = carouselIndicatorsHTML;
        }
    }
    
    // Ensure all text content is wrapped in a content div
    for (let i = 0; i < slideTexts.length; i++) {
        // Check if content wrapper exists
        if (!slideTexts[i].querySelector('.content')) {
            const textContent = slideTexts[i].innerHTML;
            slideTexts[i].innerHTML = `<div class="content">${textContent}</div>`;
        }
    }
    
    // Restart circle animation
    function restartCircleAnimation() {
        const shrinkingCircle = document.querySelector('.circle-container .shrinking-circle');
        const expandingCircle = document.querySelector('.circle-container .expanding-circle');
        
        if (shrinkingCircle && expandingCircle) {
            // Reset animations by cloning and replacing elements
            const shrinkingParent = shrinkingCircle.parentNode;
            const expandingParent = expandingCircle.parentNode;
            
            const newShrinking = shrinkingCircle.cloneNode(true);
            const newExpanding = expandingCircle.cloneNode(true);
            
            shrinkingParent.replaceChild(newShrinking, shrinkingCircle);
            expandingParent.replaceChild(newExpanding, expandingCircle);
        }
    }
    
    // Add styles for parent container
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        .circle-container {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        
        @media (max-width: 803.98px) {
            /* change 28 March 09:40 */
            .circle-container {
                right: 100px;
            }
            /* end change 28 March 09:40 */
            .circle-container .circle {
                position: absolute;
                border-radius: 50%;
                bottom: 0;
                right: 0;
                /* change 28 March 09:40 */
                transform: translate(50%, 50%);
                /* end change 28 March 09:40 */
            }
        }
        
        @media (min-width: 804px) {
            .circle-container .circle {
                position: absolute;
                border-radius: 50%;
                bottom: 0;
                right: 200px;
                transform: translate(50%, 50%);
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Initialize carousel
    showSlides(slideIndex);
    
    // Expose functions to global scope for HTML onclick handlers
    window.plusSlides = function(n) {
        previousIndex = slideIndex; // Store current index before changing
        showSlides(slideIndex += n);
    };
    
    window.currentSlide = function(n) {
        previousIndex = slideIndex; // Store current index before changing
        showSlides(slideIndex = n);
    };
    
    function showSlides(n) {
        // Handle index boundaries
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        
        // Get circles
        const newCircles = slides[slideIndex - 1].querySelectorAll('.circle');
        // Reset circle animation
        if (newCircles.length) {
            newCircles.forEach(circle => {
                // Reset animation by removing and adding class
                const className = circle.classList.contains('shrinking-circle') ? 'shrinking-circle' : 'expanding-circle';
                circle.classList.remove(className);
                
                // Force browser reflow to ensure animation restarts
                void circle.offsetWidth;
                
                // Re-add the class to restart animation
                circle.classList.add(className);
            })
        }
        
        // Display both slides during transition
        for (let i = 0; i < slides.length; i++) {
            // Hide all slides except current and previous
            if (i === (slideIndex - 1) || i === (previousIndex - 1)) {
                slides[i].style.display = "block";
            } else {
                slides[i].style.display = "none";
            }
            
            // Remove active indicator
            if (i < indicators.length) {
                indicators[i].className = indicators[i].className.replace(" active", "");
            }
            
            // Remove animation classes from texts that aren't current or previous
            if (i !== (slideIndex - 1) && i !== (previousIndex - 1)) {
                slideTexts[i].classList.remove("active", "prev");
            }
        }
        
        // Start the animations
        if (previousIndex > 0 && previousIndex <= slides.length && previousIndex !== slideIndex) {
            // Keep previous slide visible for its text to fade out
            slides[previousIndex - 1].style.display = "block";
            
            // Start fade out animation on previous text
            slideTexts[previousIndex - 1].classList.remove("active");
            slideTexts[previousIndex - 1].classList.add("prev");
            
            // After fade out completes, hide the previous slide
            setTimeout(function() {
                slides[previousIndex - 1].style.display = "none";
            }, 800); // Match this to the fade-out duration in CSS
        }
        
        // Activate current slide's text
        setTimeout(function() {
            // Remove prev class if it exists
            slideTexts[slideIndex - 1].classList.remove("prev");
            // Add active class to start slide-in
            slideTexts[slideIndex - 1].classList.add("active");
        }, 50);
        
        // Set active indicator
        if ((slideIndex - 1) < indicators.length) {
            indicators[slideIndex - 1].className += " active";
        }
        
        // Restart circle animations
        restartCircleAnimation();
    }
    
    // Handle responsive behavior
    window.addEventListener('resize', function() {
        // Adjust text positioning if needed based on screen size
        const isMobile = window.innerWidth < 768;
        const slideTextElements = document.querySelectorAll('.motion-hero-text');
        
        slideTextElements.forEach(textElement => {
            if (isMobile) {
                textElement.classList.add('mobile-text');
            } else {
                textElement.classList.remove('mobile-text');
            }
        });
    });
    
    // Initial check for mobile
    const initialIsMobile = window.innerWidth < 768;
    const initialSlideTextElements = document.querySelectorAll('.motion-hero-text');
    
    initialSlideTextElements.forEach(textElement => {
        if (initialIsMobile) {
            textElement.classList.add('mobile-text');
        }
    });
});