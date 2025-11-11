// Downloads Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add download tracking
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const fileName = this.getAttribute('href').split('/').pop();
            console.log('Download initiated:', fileName);
            
            // You can add analytics tracking here
            // trackDownload(fileName);
        });
    });
    
    // Add file type icons based on extension
    function setFileIcons() {
        const downloadItems = document.querySelectorAll('.download-item');
        
        downloadItems.forEach(item => {
            const link = item.querySelector('.download-btn');
            const href = link.getAttribute('href');
            const icon = item.querySelector('.download-icon i');
            
            if (href) {
                const extension = href.split('.').pop().toLowerCase();
                
                // Remove existing classes and set appropriate icon
                icon.className = 'fas';
                
                switch(extension) {
                    case 'pdf':
                        icon.classList.add('fa-file-pdf');
                        break;
                    case 'doc':
                    case 'docx':
                        icon.classList.add('fa-file-word');
                        break;
                    case 'xls':
                    case 'xlsx':
                        icon.classList.add('fa-file-excel');
                        break;
                    case 'zip':
                    case 'rar':
                        icon.classList.add('fa-file-archive');
                        break;
                    default:
                        icon.classList.add('fa-file');
                }
            }
        });
    }
    
    setFileIcons();
});