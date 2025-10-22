// Get employee ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id') || '1'; // Default to ID 1 if no parameter

let currentEmployee = null;
let currentSlide = 0;
let carouselImages = [];
let autoSlideInterval = null;

// Load employee data
async function loadEmployeeData() {
    try {
        const response = await fetch('employees.json');
        const data = await response.json();
        
        // Find employee by ID
        currentEmployee = data.employees.find(emp => emp.id === employeeId);
        
        if (currentEmployee) {
            populateCard(currentEmployee);
        } else {
            showError('Employee not found');
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        showError('Failed to load employee data');
    }
}

// Populate card with employee data
function populateCard(employee) {
    // Update text content
    document.getElementById('name').textContent = employee.name;
    document.getElementById('jobTitle').textContent = employee.jobTitle;
    document.getElementById('companyName').textContent = employee.company;
    
    // Update contact information
    const emailElement = document.getElementById('email');
    emailElement.textContent = employee.email;
    emailElement.href = `mailto:${employee.email}`;
    
    const phoneElement = document.getElementById('phone');
    phoneElement.textContent = employee.phone;
    phoneElement.href = `tel:${employee.phone}`;
    
    document.getElementById('address').textContent = employee.address;
    
    // Update reservation button
    const reserveBtn = document.getElementById('reserveBtn');
    reserveBtn.href = employee.reservationUrl;
    
    // Update profile image
    const profileImg = document.getElementById('profileImg');
    profileImg.src = employee.profileImage;
    profileImg.alt = employee.name;
    
    // Initialize carousel with dish images
    carouselImages = employee.dishImages || [];
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
    const carouselBanner = document.querySelector('.carousel-banner');
    if (carouselBanner) {
        carouselBanner.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        carouselBanner.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
});

// vCard download function
function downloadVCard() {
    if (!currentEmployee) {
        alert('Employee data not loaded');
        return;
    }
    
    const { name, jobTitle, company, email, phone, address } = currentEmployee;

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
