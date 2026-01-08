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

// Initialize Firebase
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
const adminDashboard = document.getElementById('adminDashboard');
const contentContainer = document.getElementById('content-container');
const uploadForm = document.getElementById('uploadForm');
const searchBar = document.getElementById('searchBar');
const categoriesNav = document.getElementById('categoriesNav');
const loginSuccessModal = document.getElementById('loginSuccessModal');

// Modals
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('editForm');
const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = document.getElementById('closeMobileMenu');


// =================================================================
// 🔹 3. STATE MANAGEMENT
// =================================================================
let state = {
    isAdmin: false,
    files: {}, // Store all files fetched from Firebase
    fileToEdit: null,
    fileToDelete: null,
};
let currentSessionId = null;
let sessionRef = null;

// =================================================================
// 🔹 4. UI & MODAL LOGIC
// =================================================================
const updateUIAfterAuthChange = (user) => {
    const isLoggedIn = !!user;
    state.isAdmin = isLoggedIn;
    
    adminLoginBtn.classList.toggle('hidden', isLoggedIn);
    logoutBtn.classList.toggle('hidden', !isLoggedIn);
    adminDashboard.classList.toggle('hidden', !isLoggedIn);

    // Re-render content to show/hide admin buttons on cards
    if (Object.keys(state.files).length > 0) {
        renderContent(Object.values(state.files));
    }
};

const toggleModal = (modalElement, show) => {
    modalElement.classList.toggle('hidden', !show);
    modalElement.classList.toggle('flex', show);
};

// =================================================================
// 🔹 5. FIREBASE AUTHENTICATION
// =================================================================
auth.onAuthStateChanged(user => {
    updateUIAfterAuthChange(user);
    // Initial data fetch is now triggered only once when the script loads,
    // not every time the auth state changes.
});

const showSuccessPopup = () => {
    const modalContent = loginSuccessModal.querySelector('.modal-pop-in-out');
    loginSuccessModal.classList.remove('hidden');
    modalContent.style.animationName = 'pop-in-out';
    setTimeout(() => {
        loginSuccessModal.classList.add('hidden');
        modalContent.style.animationName = 'none';
    }, 2000); 
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            stopSessionTracking(); 
            startSessionTracking(userCredential.user);
            toggleModal(loginModal, false);
            loginForm.reset();
            showSuccessPopup();
        })
        .catch(error => {
            alert(error.message);
        });
});

logoutBtn.addEventListener('click', () => {
    stopSessionTracking();
    auth.signOut();
});

// =================================================================
// 🔹 6. FIREBASE REALTIME DATABASE (CRUD FORMS)
// =================================================================
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = uploadForm.fileTitle.value;
    const link = uploadForm.googleDriveLink.value;
    const category = uploadForm.mainCategory.value;
    const newFileRef = db.ref('files').push();
    newFileRef.set({
        id: newFileRef.key,
        title: title,
        link: link,
        category: category,
        likes: 0,
        timestamp: Date.now()
    }).then(() => {
        uploadForm.reset();
        alert('File uploaded successfully!');
    }).catch(error => {
        alert('Failed to upload file.');
    });
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileId = editForm.editFileId.value;
    const updatedData = {
        title: editForm.editFileTitle.value,
        link: editForm.editGoogleDriveLink.value,
        category: editForm.editMainCategory.value
    };
    db.ref('files/' + fileId).update(updatedData)
    .then(() => {
        toggleModal(editModal, false);
        alert('File updated successfully!');
    })
    .catch(error => {
        alert('Failed to update file.');
    });
});

confirmDelete.addEventListener('click', () => {
    if (state.fileToDelete) {
        db.ref('files/' + state.fileToDelete).remove()
        .then(() => {
            toggleModal(deleteModal, false);
            state.fileToDelete = null;
            alert('File deleted successfully!');
        })
        .catch(error => {
            alert('Failed to delete file.');
        });
    }
});

// =================================================================
// 🔹 7. DYNAMIC CONTENT RENDERING & DATA FETCHING (FINAL VERSION)
// =================================================================

/**
 * Takes a YouTube link and returns its high-quality thumbnail URL.
 * @param {string} originalLink The original URL from YouTube.
 * @returns {string} The formatted thumbnail URL, or an empty string.
 */
const getYouTubeThumbnailUrl = (originalLink) => {
    if (typeof originalLink !== 'string') return "";
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = originalLink.match(regex);
    if (match && match[1]) {
        const videoId = match[1];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "";
};

/**
 * Creates the HTML for a single file card with all the latest design requirements.
 * @param {Object} file The file object containing its details.
 * @returns {HTMLElement} The complete card element.
 */
const createFileCard = (file) => {
    const card = document.createElement('div');
    card.className = 'file-card flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-xl flex flex-col transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden';
    card.setAttribute('data-id', file.id);

    const adminButtons = state.isAdmin ? `
        <div class="absolute top-2 right-2 z-20 flex space-x-1">
            <button class="edit-btn text-blue-500 hover:text-blue-700 bg-white rounded-full p-2 text-xs shadow-md leading-none"><i class="fas fa-edit"></i></button>
            <button class="delete-btn text-red-500 hover:text-red-700 bg-white rounded-full p-2 text-xs shadow-md leading-none"><i class="fas fa-trash"></i></button>
        </div>
    ` : '';
    
    const originalLink = file.link || '';
    const isYouTubeLink = originalLink.includes("youtube.com") || originalLink.includes("youtu.be");

    let previewSectionHTML = '';
    if (isYouTubeLink) {
        const thumbnailUrl = getYouTubeThumbnailUrl(originalLink);
        previewSectionHTML = `
            <div class="relative">
                <a href="${originalLink}" target="_blank" rel="noopener noreferrer" class="relative group h-28 block">
                    <img src="${thumbnailUrl}" alt="${file.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i class="fas fa-play text-white text-4xl"></i>
                    </div>
                </a>
                ${adminButtons}
            </div>
        `;
    }

    let middleButtonHTML = '';
    if (isYouTubeLink) {
        middleButtonHTML = `<a href="${originalLink}" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition-opacity" title="Watch Video"><i class="fas fa-play-circle text-2xl"></i></a>`;
    } else {
        middleButtonHTML = `<a href="${originalLink}" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition-opacity" title="Download File"><i class="fas fa-download text-xl"></i></a>`;
    }

    const uploadDate = new Date(file.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    card.innerHTML = `
        <div class="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        ${previewSectionHTML}
        <div class="p-4 flex-grow flex flex-col ${isYouTubeLink ? '' : 'relative'}">
             ${isYouTubeLink ? '' : adminButtons} 
            <h3 class="font-bold text-md text-gray-800 mb-2 flex-grow" title="${file.title}">${file.title}</h3>
            <p class="text-xs text-gray-400 mt-auto"><i class="fas fa-calendar-alt mr-1.5"></i>Uploaded: ${uploadDate}</p>
        </div>
        <div class="p-3 bg-gradient-to-r from-sky-500 to-indigo-600">
            <div class="flex justify-between items-center text-white">
                <button class="like-btn flex items-center space-x-1.5 text-sm font-medium hover:opacity-80 transition-opacity w-1/3 justify-start">
                    <i class="fas fa-heart text-base"></i> 
                    <span class="font-semibold text-xs">${file.likes || 0}</span>
                </button>
                <div class="w-1/3 flex justify-center">${middleButtonHTML}</div>
                <button class="share-btn flex items-center space-x-1.5 text-sm font-medium hover:opacity-80 transition-opacity w-1/3 justify-end" title="Share">
                    <i class="fas fa-share-alt text-lg"></i>
                </button>
            </div>
        </div>
    `;
    return card;
};

const renderContent = (filesArray) => {
    const newContent = document.createElement('div');
    const sortedFiles = filesArray.sort((a, b) => b.timestamp - a.timestamp);
    const categoryOrder = ['Software Notes', 'Interview Notes', 'Tools & Technology', 'Trending Technology', 'Video Resources', 'Software Project', 'Hardware Project'];
    const jobsByCategory = sortedFiles.reduce((acc, file) => {
        if (!acc[file.category]) { acc[file.category] = []; }
        acc[file.category].push(file);
        return acc;
    }, {});

    categoryOrder.forEach(category => {
        if (jobsByCategory[category] && jobsByCategory[category].length > 0) {
            const section = document.createElement('section');
            section.className = 'my-10';
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'text-center mb-8';
            categoryHeader.innerHTML = `<div class="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"><h2 class="text-xl md:text-2xl font-bold text-white text-center">${category}</h2></div>`;
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'horizontal-scroll flex space-x-4 overflow-x-auto pb-4';
            jobsByCategory[category].forEach(file => {
                scrollContainer.appendChild(createFileCard(file));
            });
            section.appendChild(categoryHeader);
            section.appendChild(scrollContainer);
            newContent.appendChild(section);
        }
    });
    contentContainer.innerHTML = newContent.innerHTML;
};

const preloadImagesAndRender = async (filesArray) => {
    try {
        const youtubeFiles = filesArray.filter(file => (file.link || '').includes("youtube.com") || (file.link || '').includes("youtu.be"));
        if (youtubeFiles.length > 0) {
            const imagePromises = youtubeFiles.map(file => {
                return new Promise((resolve) => {
                    const thumbnailUrl = getYouTubeThumbnailUrl(file.link);
                    if (!thumbnailUrl) { resolve(); return; }
                    const img = new Image();
                    img.src = thumbnailUrl;
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            });
            await Promise.all(imagePromises);
        }
        renderContent(filesArray);
    } catch (error) {
        console.error("Error during preloading:", error);
        renderContent(filesArray); // Render content anyway, even if preloading fails
    }
};

const fetchFiles = () => {
    const filesRef = db.ref('files');

    // Initial Load with Error Handling
    filesRef.once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                contentContainer.innerHTML = '<p class="text-center text-gray-500 my-10">No resources have been uploaded yet.</p>';
                return;
            }
            const filesData = snapshot.val();
            state.files = filesData || {};
            preloadImagesAndRender(Object.values(state.files));
        })
        .catch(error => {
            console.error("Firebase Read Failed:", error);
            contentContainer.innerHTML = `<p class="text-center text-red-500 font-semibold my-10">Error: Could not load resources. This is often a Firebase security rules issue.</p>`;
        });

    // Real-time Listeners for updates
    filesRef.on('child_added', (snapshot) => {
        const fileData = snapshot.val();
        if (fileData && !state.files[fileData.id]) {
            state.files[fileData.id] = fileData;
            preloadImagesAndRender(Object.values(state.files));
        }
    });

    filesRef.on('child_changed', (snapshot) => {
        const updatedFile = snapshot.val();
        if (updatedFile) {
            state.files[updatedFile.id] = updatedFile;
            const cardToUpdate = document.querySelector(`.file-card[data-id="${updatedFile.id}"]`);
            if (cardToUpdate) {
                const likeCountSpan = cardToUpdate.querySelector('.like-btn span');
                if (likeCountSpan) {
                    likeCountSpan.textContent = updatedFile.likes || 0;
                }
            }
        }
    });

    filesRef.on('child_removed', (snapshot) => {
        const deletedFile = snapshot.val();
        if (deletedFile) {
            delete state.files[deletedFile.id];
            renderContent(Object.values(state.files));
        }
    });
};


// =================================================================
// 🔹 8. USER FUNCTIONALITY & EVENT HANDLERS
// =================================================================

// Live Search
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allFiles = Object.values(state.files);
    if (searchTerm.trim() === '') {
        renderContent(allFiles);
    } else {
        const filteredFiles = allFiles.filter(file => file.title.toLowerCase().includes(searchTerm));
        renderContent(filteredFiles);
    }
});

// Subcategory Filtering
categoriesNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.subcategory) {
        e.preventDefault();
        const subcategory = e.target.dataset.subcategory.toLowerCase();
        const allFiles = Object.values(state.files);
        const filteredFiles = allFiles.filter(file => file.title.toLowerCase().includes(subcategory));
        renderContent(filteredFiles);
        contentContainer.scrollIntoView({ behavior: 'smooth' });
    }
});

// Event Delegation for card buttons (Like, Share, Edit, Delete)
contentContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button, a');
    if (!button) return;

    const card = e.target.closest('.file-card');
    if (!card) return;
    
    const fileId = card.dataset.id;
    const file = state.files[fileId];

    if (button.classList.contains('like-btn')) {
        if (state.isAdmin) {
            db.ref('files/' + fileId + '/likes').transaction((currentLikes) => (currentLikes || 0) + 1);
        } else {
            const likedFiles = JSON.parse(localStorage.getItem('likedResources')) || [];
            if (!likedFiles.includes(fileId)) {
                db.ref('files/' + fileId + '/likes').transaction((currentLikes) => (currentLikes || 0) + 1);
                likedFiles.push(fileId);
                localStorage.setItem('likedResources', JSON.stringify(likedFiles));
                button.classList.add('text-red-600', 'pointer-events-none');
            }
        }
    }

    if (button.classList.contains('share-btn')) {
        if (navigator.share && file) {
            navigator.share({
                title: file.title,
                text: `Check out this resource from Resource Kaptan: ${file.title}`,
                url: file.link,
            }).catch(console.error);
        } else if (file) {
            alert(`Share this link: ${file.link}`);
        }
    }

    if (button.classList.contains('edit-btn')) {
        state.fileToEdit = fileId;
        editForm.editFileId.value = fileId;
        editForm.editFileTitle.value = file.title;
        editForm.editGoogleDriveLink.value = file.link;
        const categorySelect = editForm.editMainCategory;
        categorySelect.innerHTML = `
            <option>Software Notes</option><option>Interview Notes</option>
            <option>Tools & Technology</option><option>Trending Technology</option>
            <option>Software Project</option><option>Hardware Project</option>
        `;
        categorySelect.value = file.category;
        toggleModal(editModal, true);
    }
    
    if (button.classList.contains('delete-btn')) {
        state.fileToDelete = fileId;
        toggleModal(deleteModal, true);
    }
});


// Modal Close Buttons
adminLoginBtn.addEventListener('click', () => toggleModal(loginModal, true));
closeLoginModal.addEventListener('click', () => toggleModal(loginModal, false));
closeEditModal.addEventListener('click', () => toggleModal(editModal, false));
cancelDelete.addEventListener('click', () => toggleModal(deleteModal, false));

// =================================================================
// 🔹 9. MOBILE SIDEBAR LOGIC
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
    const adminLoginBtnMobile = document.getElementById('adminLoginBtnMobile');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    
    if (mobileMenu && mobileMenuBtn && closeMobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
        closeMobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) mobileMenu.classList.add('hidden');
        });
    }

    const menuTriggers = document.querySelectorAll('.mobile-menu-trigger');
    menuTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            trigger.nextElementSibling.classList.toggle('hidden');
            trigger.querySelector('.fa-chevron-down').classList.toggle('rotate-180');
        });
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.all-notes-btn')) {
            e.preventDefault();
            renderContent(Object.values(state.files));
        }
    });

    if (adminLoginBtnMobile) {
        adminLoginBtnMobile.addEventListener('click', () => {
            toggleModal(loginModal, true);
            if(mobileMenu) mobileMenu.classList.add('hidden');
        });
    }

    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', () => {
            stopSessionTracking();
            auth.signOut();
            if(mobileMenu) mobileMenu.classList.add('hidden');
        });
    }

    auth.onAuthStateChanged(user => {
        const isLoggedIn = !!user;
        if(adminLoginBtnMobile) adminLoginBtnMobile.classList.toggle('hidden', isLoggedIn);
        if(logoutBtnMobile) logoutBtnMobile.classList.toggle('hidden', !isLoggedIn);
    });
    
    const mobileNavContainer = document.querySelector('#mobileMenu .side-menu-content nav');
    if (mobileNavContainer) {
        mobileNavContainer.addEventListener('click', (e) => {
            const targetLink = e.target.closest('a');
            if (targetLink && targetLink.dataset.subcategory) {
                e.preventDefault();
                const subcategory = targetLink.dataset.subcategory;
                const allFiles = Object.values(state.files);
                const filteredFiles = allFiles.filter(file => 
                    file.category.includes(subcategory) || file.title.toLowerCase().includes(subcategory.toLowerCase())
                );
                renderContent(filteredFiles);
                if(mobileMenu) mobileMenu.classList.add('hidden');
                contentContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    // Initial fetch of files
    fetchFiles();
});

// =================================================================
// 🔹 10. SESSION MANAGEMENT LOGIC
// =================================================================

const MAX_SESSIONS = 1;

const startSessionTracking = (user) => {
    if (!user) return;
    const userSessionsRef = db.ref(`sessions/${user.uid}`);
    currentSessionId = db.ref().push().key;
    userSessionsRef.transaction((currentSessions) => {
        currentSessions = currentSessions || {};
        const sessionKeys = Object.keys(currentSessions);
        if (sessionKeys.length >= MAX_SESSIONS) {
            sessionKeys.sort((a, b) => currentSessions[a] - currentSessions[b]);
            delete currentSessions[sessionKeys[0]];
        }
        currentSessions[currentSessionId] = firebase.database.ServerValue.TIMESTAMP;
        return currentSessions;
    }).then(() => {
        listenForForcedLogout(user.uid);
    });
};

const listenForForcedLogout = (uid) => {
    if (sessionRef) sessionRef.off();
    sessionRef = db.ref(`sessions/${uid}/${currentSessionId}`);
    sessionRef.on('value', (snapshot) => {
        if (snapshot.val() === null) {
            sessionRef.off();
            auth.signOut().then(() => {
                alert("You have been automatically logged out because a new session was started on another device.");
            });
        }
    });
};

const stopSessionTracking = () => {
    const user = auth.currentUser;
    if (user && currentSessionId) {
        if (sessionRef) sessionRef.off();
        db.ref(`sessions/${user.uid}/${currentSessionId}`).remove();
        currentSessionId = null;
    }
};