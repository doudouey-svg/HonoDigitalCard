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
    const name = document.getElementById('name').textContent;
    const jobTitle = document.getElementById('jobTitle').textContent;
    const company = document.getElementById('companyName').textContent;
    const email = document.getElementById('email').textContent;
    const phone = document.getElementById('phone').textContent;
    const address = document.getElementById('address').textContent;
    const website = document.getElementById('website').textContent;

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
