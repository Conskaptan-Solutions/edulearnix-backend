// =================================================================
// 🔹 1. FIREBASE CONFIGURATION
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDgh_CNZalVYCEnrY6KgbjileAcyPRSrY0",
    authDomain: "resourcekaptan.firebaseapp.com",
    projectId: "resourcekaptan",
    storageBucket: "resourcekaptan.firebasestorage.app",
    messagingSenderId: "217599407416",
    appId: "1:217599407416:web:fc690e44c56723a0fc3dcd"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// =================================================================
// 🔹 2. DOM ELEMENT SELECTION
// =================================================================
const adminLoginBtn = document.getElementById('adminLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const loginSuccessModal = document.getElementById('loginSuccessModal');
const adminDashboard = document.getElementById('adminDashboard');
const uploadForm = document.getElementById('uploadForm');
const searchBar = document.getElementById('searchBar');
const categoriesNav = document.getElementById('categoriesNav');
const jobListingsContainer = document.getElementById('jobListingsContainer');
const editJobModal = document.getElementById('editJobModal');
const editJobForm = document.getElementById('editJobForm');
const closeEditJobModal = document.getElementById('closeEditJobModal');
const deleteJobModal = document.getElementById('deleteJobModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const jobDetailsModal = document.getElementById('jobDetailsModal');
const closeJobDetailsModal = document.getElementById('closeJobDetailsModal');
const allJobsModal = document.getElementById('allJobsModal');
const closeAllJobsModal = document.getElementById('closeAllJobsModal');
const allJobsModalTitle = document.getElementById('allJobsModalTitle');
const allJobsContainer = document.getElementById('allJobsContainer');



// =================================================================
// 🔹 3. STATE MANAGEMENT
// =================================================================
let state = {
    isAdmin: false,
    jobs: {},
    jobToDelete: null,
    activeCategory: 'All',
    currentSessionId: null,
    sessionRef: null,
};
let inactivityTimer;

const logoutDueToInactivity = () => {
    stopSessionTracking();
    auth.signOut();
    alert("You have been logged out due to inactivity.");
};

const startInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutDueToInactivity, 600000);
};

const resetInactivityTimer = () => {
    startInactivityTimer();
};

const MAX_SESSIONS = 1;

const startSessionTracking = (user) => {
    if (!user) return;
    const userSessionsRef = db.ref(`sessions/${user.uid}`);
    state.currentSessionId = db.ref().push().key;

    userSessionsRef.transaction((currentSessions) => {
        if (currentSessions === null) {
            currentSessions = {};
        }
        const sessionKeys = Object.keys(currentSessions);
        if (sessionKeys.length >= MAX_SESSIONS) {
            sessionKeys.sort((a, b) => currentSessions[a] - currentSessions[b]);
            const oldestSessionKey = sessionKeys[0];
            delete currentSessions[oldestSessionKey];
        }
        currentSessions[state.currentSessionId] = firebase.database.ServerValue.TIMESTAMP;
        return currentSessions;
    }).then(() => {
        listenForForcedLogout(user.uid);
    });
};

const listenForForcedLogout = (uid) => {
    if (state.sessionRef) state.sessionRef.off();
    state.sessionRef = db.ref(`sessions/${uid}/${state.currentSessionId}`);
    state.sessionRef.on('value', (snapshot) => {
        if (snapshot.val() === null) {
            state.sessionRef.off();
            auth.signOut().then(() => {
                alert("You have been logged out because the session limit was reached.");
            });
        }
    });
};

const stopSessionTracking = () => {
    const user = auth.currentUser;
    if (user && state.currentSessionId) {
        if (state.sessionRef) state.sessionRef.off();
        db.ref(`sessions/${user.uid}/${state.currentSessionId}`).remove();
        state.currentSessionId = null;
    }
};

// =================================================================
// 🔹 4. UI & MODAL LOGIC
// =================================================================
const updateUIAfterAuthChange = (user) => {
    state.isAdmin = !!user;
    if(adminLoginBtn) adminLoginBtn.classList.toggle('hidden', state.isAdmin);
    if(logoutBtn) logoutBtn.classList.toggle('hidden', !state.isAdmin);
    if(adminDashboard) adminDashboard.classList.toggle('hidden', !state.isAdmin);
    updateAndRenderJobs();
};

const toggleModal = (modalElement, show) => {
    if(modalElement) {
        modalElement.classList.toggle('hidden', !show);
        modalElement.classList.toggle('flex', show);
    }
};

const showSuccessPopup = () => {
    toggleModal(loginSuccessModal, true);
    setTimeout(() => toggleModal(loginSuccessModal, false), 2000);
};

// =================================================================
// 🔹 5. FIREBASE AUTHENTICATION & MODAL EVENTS
// =================================================================
auth.onAuthStateChanged(updateUIAfterAuthChange);

if(loginForm) loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(loginForm.email.value, loginForm.password.value)
        .then((userCredential) => {
            toggleModal(loginModal, false);
            loginForm.reset();
            showSuccessPopup();
            startInactivityTimer();
            startSessionTracking(userCredential.user);
            window.addEventListener('mousemove', resetInactivityTimer);
            window.addEventListener('keypress', resetInactivityTimer);
        }).catch(error => alert(error.message));
});

if(logoutBtn) logoutBtn.addEventListener('click', () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    stopSessionTracking();
    window.removeEventListener('mousemove', resetInactivityTimer);
    window.removeEventListener('keypress', resetInactivityTimer);
    auth.signOut();
});

if(adminLoginBtn) adminLoginBtn.addEventListener('click', () => toggleModal(loginModal, true));
if(closeLoginModal) closeLoginModal.addEventListener('click', () => toggleModal(loginModal, false));
if(closeEditJobModal) closeEditJobModal.addEventListener('click', () => toggleModal(editJobModal, false));
if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => toggleModal(deleteJobModal, false));
if(closeJobDetailsModal) closeJobDetailsModal.addEventListener('click', () => toggleModal(jobDetailsModal, false));
if(closeAllJobsModal) closeAllJobsModal.addEventListener('click', () => toggleModal(allJobsModal, false));

// =================================================================
// 🔹 6. JOB DATA (CRUD)
// =================================================================
if(uploadForm) uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newJobRef = db.ref('jobs').push();
    const jobData = {
        id: newJobRef.key,
        poster: uploadForm.jobPoster.value,
        jobTitle: uploadForm.jobTitle.value,
        location: uploadForm.jobLocation.value,
        experience: uploadForm.jobExperience.value,
        category: uploadForm.jobCategory.value,
        description: uploadForm.jobDescription.value,
        applyLink: uploadForm.applyLink.value,
        status: uploadForm.applicationStatus.value,
        likes: 0,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    newJobRef.set(jobData)
        .then(() => { alert('Job posted successfully!'); uploadForm.reset(); })
        .catch(error => alert('Error: ' + error.message));
});

if(editJobForm) editJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const jobId = document.getElementById('editJobId').value;
    const updatedData = {
        poster: document.getElementById('editJobPoster').value,
        jobTitle: document.getElementById('editJobTitle').value,
        location: document.getElementById('editJobLocation').value,
        experience: document.getElementById('editJobExperience').value,
        category: document.getElementById('editJobCategory').value,
        description: document.getElementById('editJobDescription').value,
        applyLink: document.getElementById('editApplyLink').value,
        status: document.getElementById('editApplicationStatus').value,
    };
    db.ref('jobs/' + jobId).update(updatedData)
        .then(() => { toggleModal(editJobModal, false); alert('Job updated successfully!'); })
        .catch(error => alert('Error: ' + error.message));
});

if(confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', () => {
    if (state.jobToDelete) {
        db.ref('jobs/' + state.jobToDelete).remove()
            .then(() => { toggleModal(deleteJobModal, false); alert('Job deleted successfully!'); state.jobToDelete = null; })
            .catch(error => alert('Error: ' + error.message));
    }
});

// =================================================================
// 🔹 7. JOB RENDERING & FILTERING LOGIC
// =================================================================
const linkify = (text) => {
    if (!text) return '';
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    let newText = text.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline">${url}</a>`);
    newText = newText.replace(emailRegex, email => `<a href="mailto:${email}" class="text-indigo-600 hover:underline">${email}</a>`);
    return newText;
};

const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? ' year ago' : ' years ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? ' month ago' : ' months ago');
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? ' day ago' : ' days ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? ' hour ago' : ' hours ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? ' minute ago' : ' minutes ago');
    return 'just now';
};

const createJobCard = (job) => {
    const card = document.createElement('div');
    card.className = 'job-card flex-shrink-0 w-80 bg-gray-800 rounded-lg shadow-md border border-gray-700 hover:shadow-xl flex flex-col transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-cardPopIn';
    card.dataset.id = job.id;
    const postDate = formatTimeAgo(job.timestamp);
    const adminButtons = state.isAdmin ? `<div class="absolute top-2 right-2 z-20 flex space-x-1"><button class="edit-job-btn text-blue-500 hover:text-blue-700 bg-gray-900 rounded-full p-1 text-xs shadow-md leading-none"><i class="fas fa-edit"></i></button><button class="delete-job-btn text-red-500 hover:text-red-700 bg-gray-900 rounded-full p-1 text-xs shadow-md leading-none"><i class="fas fa-trash"></i></button></div>` : '';
    const applyLinkHref = (job.applyLink || '').includes('@') ? `mailto:${job.applyLink}` : job.applyLink;

    card.innerHTML = `
        <div class="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
        <div class="p-3 flex-grow flex flex-col">
            <div class="relative">
                ${adminButtons}
                <div class="mb-2">
                    <div class="flex justify-between items-center mb-1">
                        <p class="text-xs font-semibold text-pink-400">${job.category}</p>
                        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${job.status === 'Open' ? 'bg-green-600 bg-opacity-20 text-green-400' : 'bg-red-600 bg-opacity-20 text-red-400'}">${job.status}</span>
                    </div>
                    <h3 class="text-base font-bold text-white leading-tight">${job.jobTitle || 'N/A'}</h3>
                    <div class="flex items-center text-sm text-gray-300 mt-1">
                        <i class="fas fa-building mr-1.5 text-gray-500"></i>
                        <span class="font-medium">${job.poster || 'N/A'}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
                        <div class="flex items-center"><i class="fas fa-map-marker-alt mr-1 text-gray-500"></i><span>${job.location || 'N/A'}</span></div>
                        <div class="flex items-center"><i class="fas fa-star mr-1 text-gray-500"></i><span>Exp: ${job.experience || 'N/A'}</span></div>
                        <div class="flex items-center"><i class="fas fa-clock mr-1 text-gray-500"></i><span>${postDate}</span></div>
                    </div>
                </div>
            </div>
            <div class="mt-auto pt-2 border-t border-gray-700">
                <button class="view-details-btn w-full bg-gray-900 text-gray-300 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors">View Details</button>
            </div>
        </div>
        <div class="border-t border-gray-700 p-2 bg-gray-900 rounded-b-lg">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <button class="like-btn text-red-400 hover:text-red-500 flex items-center space-x-1 text-sm"><i class="fas fa-heart text-base"></i><span class="font-semibold">${job.likes || 0}</span></button>
                    <button class="share-btn text-cyan-400 hover:text-cyan-500 flex items-center space-x-1 text-sm"><i class="fas fa-share-alt text-base"></i></button>
                </div>
                <a href="${applyLinkHref}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:opacity-90 shadow-sm transform hover:scale-105 transition-all">Apply Now</a>
            </div>
        </div>`;
    return card;
};

// Function to update a single job card's like count
const updateSingleJobCard = (jobId, newJobData) => {
    const cardElements = document.querySelectorAll(`.job-card[data-id="${jobId}"]`);
    cardElements.forEach(card => {
        const likeCountSpan = card.querySelector('.like-btn .font-semibold');
        if (likeCountSpan) {
            likeCountSpan.textContent = newJobData.likes || 0;
        }
    });
};

const updateAndRenderJobs = () => {
    if (!jobListingsContainer) return;

    const scrollPositions = {};
    document.querySelectorAll('.horizontal-scroll').forEach(container => {
        const categoryName = container.parentElement.dataset.category;
        if (categoryName) {
            scrollPositions[categoryName] = container.scrollLeft;
        }
    });

    jobListingsContainer.innerHTML = '';

    let jobsToRender = Object.values(state.jobs);
    const searchTerm = searchBar ? searchBar.value.toLowerCase() : '';

    if (searchTerm) {
        jobsToRender = jobsToRender.filter(job =>
            (job.jobTitle || '').toLowerCase().includes(searchTerm) ||
            (job.poster || '').toLowerCase().includes(searchTerm) ||
            (job.description || '').toLowerCase().includes(searchTerm)
        );
    }

    jobsToRender.sort((a, b) => b.timestamp - a.timestamp);

    const jobsByCategory = jobsToRender.reduce((acc, job) => {
        if (!acc[job.category]) acc[job.category] = [];
        acc[job.category].push(job);
        return acc;
    }, {});

    const categoryOrder = ['IT Job', 'Non IT Job', 'Walk In drive', 'Govt Job', 'Internship', 'Part Time Job', 'Remote Job', 'Others'];

    if (state.activeCategory === 'All') {
        categoryOrder.forEach(category => {
            const jobsInThisCategory = jobsByCategory[category] || [];
            if (jobsInThisCategory.length > 0) {
                const section = document.createElement('section');
                section.className = 'my-8';
                section.dataset.category = category;

                const header = document.createElement('div');
                header.className = 'flex justify-between items-center mb-4 px-4';
                header.innerHTML = `
                    <h2 class="text-xl md:text-2xl font-bold text-gray-200">${category} <span class="text-gray-400 font-normal">(${jobsInThisCategory.length} jobs)</span></h2>
                    <button class="view-all-btn text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors" data-category="${category}">
                        View All <i class="fas fa-chevron-right ml-1"></i>
                    </button>
                `;

                const scrollContainer = document.createElement('div');
                scrollContainer.className = 'horizontal-scroll flex gap-4 overflow-x-auto pb-4 -mx-4 px-4';

                jobsInThisCategory.slice(0, 4).forEach(job => scrollContainer.appendChild(createJobCard(job)));

                section.appendChild(header);
                section.appendChild(scrollContainer);
                jobListingsContainer.appendChild(section);
            }
        });
    } else {
        const category = state.activeCategory;
        const jobsInThisCategory = jobsByCategory[category] || [];
        if (jobsInThisCategory.length > 0) {
            const heading = document.createElement('h2');
            heading.className = 'text-2xl md:text-3xl font-bold text-gray-200 mb-6 px-4';
            heading.innerHTML = `${category} <span class="text-gray-400 font-normal">(${jobsInThisCategory.length} jobs)</span>`;
            jobListingsContainer.appendChild(heading);

            const container = document.createElement('div');
            container.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4';
            jobsInThisCategory.forEach(job => container.appendChild(createJobCard(job)));
            jobListingsContainer.appendChild(container);
        } else {
            jobListingsContainer.innerHTML = '<p class="text-center text-gray-500 py-10">Loading Jobs...</p>';
        }
    }


    if (Object.keys(jobsByCategory).length === 0) {
        jobListingsContainer.innerHTML = '<p class="text-center text-gray-500 py-10">Loading Jobs...</p>';
    }

    document.querySelectorAll('.horizontal-scroll').forEach(container => {
        const categoryName = container.parentElement.dataset.category;
        if (scrollPositions[categoryName]) {
            container.scrollLeft = scrollPositions[categoryName];
        }
    });
};


if(searchBar) searchBar.addEventListener('input', updateAndRenderJobs);

if(categoriesNav) categoriesNav.addEventListener('click', (e) => {
    const categoryBtn = e.target.closest('.category-btn');
    if (categoryBtn) {
        e.preventDefault();
        const newCategory = categoryBtn.dataset.category;
        
        if (newCategory !== state.activeCategory) {
            state.activeCategory = newCategory;
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
            
            history.pushState({ category: newCategory }, '', `?category=${newCategory.replace(/\s+/g, '-')}`);
            console.log('New history state pushed:', { category: newCategory });
            
            updateAndRenderJobs();
        } else {
            console.log('Category has not changed. Not pushing a new history state.');
        }
    }
});


if(jobListingsContainer) {
    jobListingsContainer.addEventListener('click', (e) => {
        const viewAllBtn = e.target.closest('.view-all-btn');
        if (viewAllBtn) {
            e.preventDefault();
            const category = viewAllBtn.dataset.category;
            const desktopCategoryButton = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (desktopCategoryButton) {
                desktopCategoryButton.click();
            }
        }
    });

    jobListingsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const card = e.target.closest('.job-card');
        const jobId = card ? card.dataset.id : null;
        const job = jobId ? state.jobs[jobId] : null;

        if (!job) return;

        if (button.classList.contains('view-details-btn')) {
            document.getElementById('modalJobCategory').textContent = job.category;
            document.getElementById('modalJobTitle').textContent = job.jobTitle;
            document.getElementById('modalJobPoster').textContent = job.poster;
            document.getElementById('modalJobLocation').textContent = job.location;
            document.getElementById('modalJobExperience').textContent = `Exp: ${job.experience}`;
            document.getElementById('modalJobDescription').innerHTML = linkify(job.description);
            const statusEl = document.getElementById('modalJobStatus');
            statusEl.textContent = job.status;
            statusEl.className = `text-sm font-semibold px-3 py-1 rounded-full ${job.status === 'Open' ? 'bg-green-600 bg-opacity-20 text-green-400' : 'bg-red-600 bg-opacity-20 text-red-400'}`;
            const applyLinkEl = document.getElementById('modalApplyLink');
            applyLinkEl.href = (job.applyLink || '').includes('@') ? `mailto:${job.applyLink}` : job.applyLink;
            toggleModal(jobDetailsModal, true);
        } else if (button.classList.contains('like-btn')) {
            if (state.isAdmin) {
                db.ref('jobs/' + jobId + '/likes').transaction(currentLikes => (currentLikes || 0) + 1);
            } else {
                const likedJobs = JSON.parse(localStorage.getItem('likedJobs')) || [];
                if (!likedJobs.includes(jobId)) {
                    db.ref('jobs/' + jobId + '/likes').transaction(currentLikes => (currentLikes || 0) + 1);
                    likedJobs.push(jobId);
                    localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
                    button.classList.add('text-red-600', 'pointer-events-none');
                }
            }
        } else if (button.classList.contains('share-btn')) {
            if (navigator.share) {
                const shareLink = job.applyLink || window.location.href;
                navigator.share({
                    title: `${job.poster} is hiring!`,
                    text: `Check out this job posting from ${job.poster} on Job Kaptan: ${job.jobTitle} - ${job.location}`,
                    url: shareLink
                });
            }
        } else if (button.classList.contains('edit-job-btn')) {
            document.getElementById('editJobId').value = job.id;
            document.getElementById('editJobPoster').value = job.poster;
            document.getElementById('editJobTitle').value = job.jobTitle || '';
            document.getElementById('editJobLocation').value = job.location || '';
            document.getElementById('editJobExperience').value = job.experience || 'Fresher';
            document.getElementById('editJobCategory').value = job.category;
            document.getElementById('editJobDescription').value = job.description;
            document.getElementById('editApplyLink').value = job.applyLink;
            document.getElementById('editApplicationStatus').value = job.status;
            toggleModal(editJobModal, true);
        } else if (button.classList.contains('delete-job-btn')) {
            state.jobToDelete = jobId;
            toggleModal(deleteJobModal, true);
        }
    });
}


if(allJobsModal) allJobsModal.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const card = e.target.closest('.job-card');
    const jobId = card ? card.dataset.id : null;
    const job = jobId ? state.jobs[jobId] : null;
    
    if (button.classList.contains('view-details-btn')) {
        document.getElementById('modalJobCategory').textContent = job.category;
        document.getElementById('modalJobTitle').textContent = job.jobTitle;
        document.getElementById('modalJobPoster').textContent = job.poster;
        document.getElementById('modalJobLocation').textContent = job.location;
        document.getElementById('modalJobExperience').textContent = `Exp: ${job.experience}`;
        document.getElementById('modalJobDescription').innerHTML = linkify(job.description);
        const statusEl = document.getElementById('modalJobStatus');
        statusEl.textContent = job.status;
        statusEl.className = `text-sm font-semibold px-3 py-1 rounded-full ${job.status === 'Open' ? 'bg-green-600 bg-opacity-20 text-green-400' : 'bg-red-600 bg-opacity-20 text-red-400'}`;
        const applyLinkEl = document.getElementById('modalApplyLink');
        applyLinkEl.href = (job.applyLink || '').includes('@') ? `mailto:${job.applyLink}` : job.applyLink;
        toggleModal(jobDetailsModal, true);
    } else if (button.classList.contains('like-btn')) {
        if (state.isAdmin) {
            db.ref('jobs/' + jobId + '/likes').transaction(currentLikes => (currentLikes || 0) + 1);
        } else {
            const likedJobs = JSON.parse(localStorage.getItem('likedJobs')) || [];
            if (!likedJobs.includes(jobId)) {
                db.ref('jobs/' + jobId + '/likes').transaction(currentLikes => (currentLikes || 0) + 1);
                likedJobs.push(jobId);
                localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
                button.classList.add('text-red-600', 'pointer-events-none');
            }
        }
    } else if (button.classList.contains('share-btn')) {
        if (navigator.share) {
             const shareLink = job.applyLink || window.location.href;
             navigator.share({
                 title: `${job.poster} is hiring!`,
                 text: `Check out this job posting from ${job.poster} on Job Kaptan: ${job.jobTitle} - ${job.location}`,
                 url: shareLink
             });
        }
    } else if (button.classList.contains('edit-job-btn')) {
        document.getElementById('editJobId').value = job.id;
        document.getElementById('editJobPoster').value = job.poster;
        document.getElementById('editJobTitle').value = job.jobTitle || '';
        document.getElementById('editJobLocation').value = job.location || '';
        document.getElementById('editJobExperience').value = job.experience || 'Fresher';
        document.getElementById('editJobCategory').value = job.category;
        document.getElementById('editJobDescription').value = job.description;
        document.getElementById('editApplyLink').value = job.applyLink;
        document.getElementById('editApplicationStatus').value = job.status;
        toggleModal(editJobModal, true);
    } else if (button.classList.contains('delete-job-btn')) {
        state.jobToDelete = jobId;
        toggleModal(deleteJobModal, true);
    }
});


// =================================================================
// 🔹 9. INITIALIZATION & HISTORY MANAGEMENT
// =================================================================
const fetchJobsAndInitialize = () => {
    const jobsRef = db.ref('jobs');
    
    // Listen for real-time changes to individual jobs to keep the UI updated without full re-renders
    jobsRef.on('child_changed', (snapshot) => {
        const jobId = snapshot.key;
        const newJobData = snapshot.val();
        state.jobs[jobId] = newJobData;
        updateSingleJobCard(jobId, newJobData);
    });
};


// --- BROWSER HISTORY MANAGEMENT ---
window.addEventListener('popstate', (event) => {
    const category = event.state ? event.state.category : 'All';
    const categoryButton = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (categoryButton) {
        categoryButton.click();
    } else {
        const allJobsButton = document.querySelector('.category-btn[data-category="All"]');
        if (allJobsButton) {
            allJobsButton.click();
        }
    }
});

// Main initialization function to run when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const jobsRef = db.ref('jobs');
    
    jobsRef.once('value', snapshot => {
        state.jobs = snapshot.val() || {};
        
        const urlParams = new URLSearchParams(window.location.search);
        const initialCategory = urlParams.get('category') || 'All';
        const initialButton = document.querySelector(`.category-btn[data-category="${initialCategory}"]`);
        
        if (initialButton) {
            state.activeCategory = initialCategory;
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            initialButton.classList.add('active');
            
            history.replaceState({ category: initialCategory }, '', `?category=${initialCategory.replace(/\s+/g, '-')}`);
            
            updateAndRenderJobs();
        }
        
        fetchJobsAndInitialize();
    }, error => {
        console.error("Firebase Read Error:", error);
    });
});

//Code for controll Mobile menu button
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('mobile-menu-open-btn');
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const menuContent = document.getElementById('mobile-menu-content');
    const mobileCategoryLinks = document.querySelectorAll('.mobile-category-btn');
    const mobileAdminLoginBtn = document.getElementById('mobileAdminLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('open');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    };

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    mobileCategoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            const desktopBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (desktopBtn) {
                desktopBtn.click();
            }
            closeMenu();
        });
    });

    if (mobileAdminLoginBtn) {
        mobileAdminLoginBtn.addEventListener('click', () => {
            const desktopLoginBtn = document.getElementById('adminLoginBtn');
            if (desktopLoginBtn) desktopLoginBtn.click();
            closeMenu();
        });
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => {
            const desktopLogoutBtn = document.getElementById('logoutBtn');
            if (desktopLogoutBtn) desktopLogoutBtn.click();
            closeMenu();
        });
    }
    
    const authObserver = new MutationObserver(() => {
        const logoutBtnIsHidden = document.getElementById('logoutBtn').classList.contains('hidden');
        if (mobileAdminLoginBtn) mobileAdminLoginBtn.classList.toggle('hidden', !logoutBtnIsHidden);
        if (mobileLogoutBtn) mobileLogoutBtn.classList.toggle('hidden', logoutBtnIsHidden);
    });

    const logoutBtnElement = document.getElementById('logoutBtn');
    if (logoutBtnElement) {
        authObserver.observe(logoutBtnElement, { attributes: true, attributeFilter: ['class'] });
    }
});