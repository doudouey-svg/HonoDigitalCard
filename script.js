// Get employee ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id') || '1'; // Default to ID 1 if no parameter

let currentEmployee = null;

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
    
    const websiteElement = document.getElementById('website');
    websiteElement.textContent = employee.website;
    websiteElement.href = employee.website;
    
    // Update profile image
    const profileImg = document.getElementById('profileImg');
    profileImg.src = employee.profileImage;
    profileImg.alt = employee.name;
    
    // Update video
    const videoSource = document.getElementById('videoSource');
    const video = document.getElementById('bannerVideo');
    videoSource.src = employee.videoUrl;
    video.load();
    
    // Update page title
    document.title = `${employee.name} - Digital Namecard`;
}

// Show error message
function showError(message) {
    document.getElementById('name').textContent = message;
    document.getElementById('jobTitle').textContent = '';
    document.getElementById('companyName').textContent = '';
}

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
    if (!currentEmployee) {
        alert('Employee data not loaded');
        return;
    }
    
    const { name, jobTitle, company, email, phone, address, website } = currentEmployee;

    // Create vCard content
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${jobTitle}
ORG:${company}
EMAIL:${email}
TEL:${phone}
ADR:;;${address}
URL:${website}
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
