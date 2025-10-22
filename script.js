// Get employee ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id') || '1'; // Default to ID 1 if no parameter

let currentEmployee = null;
let companyConfig = null;
let currentSlide = 0;
let carouselImages = [];
let autoSlideInterval = null;

// Load both employee and company data
async function loadEmployeeData() {
    try {
        // Load company config first
        const configResponse = await fetch('config.json');
        companyConfig = await configResponse.json();
        
        // Load employee data
        const employeeResponse = await fetch('employees.json');
        const data = await employeeResponse.json();
        
        // Find employee by ID
        currentEmployee = data.employees.find(emp => emp.id === employeeId);
        
        if (currentEmployee) {
            populateCard(currentEmployee);
        } else {
            showError('Employee not found');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data');
    }
}

// Populate card with employee data
function populateCard(employee) {
    // Update text content
    document.getElementById('name').textContent = employee.name;
    document.getElementById('jobTitle').textContent = employee.jobTitle;
    document.getElementById('companyName').textContent = companyConfig.company.name;
    
    // Update contact information
    const emailElement = document.getElementById('email');
    emailElement.textContent = employee.email;
    emailElement.href = `mailto:${employee.email}`;
    
    const phoneElement = document.getElementById('phone');
    phoneElement.textContent = employee.phone;
    phoneElement.href = `tel:${employee.phone}`;
    
    document.getElementById('address').textContent = companyConfig.company.address;
    
    // Update reservation button
    const reserveBtn = document.getElementById('reserveBtn');
    reserveBtn.href = companyConfig.company.reservationUrl;
    
    // Update profile image
    const profileImg = document.getElementById('profileImg');
    profileImg.src = employee.profileImage;
    profileImg.alt = employee.name;
    
    // Update video banner
    const videoSource = document.getElementById('videoSource');
    const video = document.getElementById('bannerVideo');
    videoSource.src = companyConfig.company.videoUrl;
    video.load();
    
    // Initialize carousel with standardized company dish images
    carouselImages = companyConfig.company.dishImages || [];
    initializeCarousel();
    
    // Update page title
    document.title = `${employee.name} - Digital Namecard`;
}

// Show error message
function showError(message) {
    document.getElementById('name').textContent = message;
    document.getElementById('jobTitle').textContent = '';
    document.getElementById('companyName').textContent = '';
}

// Carousel Functions
function initializeCarousel() {
    const carouselSlide = document.getElementById('carouselSlide');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    // Clear existing content
    carouselSlide.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    // Add images to carousel
    carouselImages.forEach((imageSrc, index) => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Dish ${index + 1}`;
        carouselSlide.appendChild(img);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        carouselIndicators.appendChild(indicator);
    });
    
    // Start auto-slide
    startAutoSlide();
}

function changeSlide(direction) {
    const totalSlides = carouselImages.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    const carouselSlide = document.getElementById('carouselSlide');
    const indicators = document.querySelectorAll('.indicator');
    
    carouselSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 4000); // Change slide every 4 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Stop auto-slide when user hovers over carousel
document.addEventListener('DOMContentLoaded', function() {
    const carouselBanner = document.querySelector('.carousel-section .carousel-banner');
    if (carouselBanner) {
        carouselBanner.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        carouselBanner.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
});

// Video loading handling
const video = document.getElementById('bannerVideo');
const placeholder = document.getElementById('videoPlaceholder');

video.addEventListener('loadeddata', function() {
    placeholder.style.display = 'none';
    video.style.display = 'block';
});

video.addEventListener('error', function() {
    placeholder.style.display = 'flex';
    video.style.display = 'none';
});

// Initially hide video until it loads
video.style.display = 'none';

// vCard download function
function downloadVCard() {
    if (!currentEmployee || !companyConfig) {
        alert('Data not loaded');
        return;
    }
    
    const name = currentEmployee.name;
    const jobTitle = currentEmployee.jobTitle;
    const company = companyConfig.company.name;
    const email = currentEmployee.email;
    const phone = currentEmployee.phone;
    const address = companyConfig.company.address;

    // Create vCard content
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${jobTitle}
ORG:${company}
EMAIL:${email}
TEL:${phone}
ADR:;;${address}
END:VCARD`;

    // Create blob and download
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Load employee data when page loads
document.addEventListener('DOMContentLoaded', loadEmployeeData);
