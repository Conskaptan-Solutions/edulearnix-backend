// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCb1NbNdXPhlxkDw-dn2b9kJAvI-HOlejQ",
  authDomain: "digikaptan-41f63.firebaseapp.com",
  projectId: "digikaptan-41f63",
  storageBucket: "digikaptan-41f63.firebasestorage.app",
  messagingSenderId: "280850880954",
  appId: "1:280850880954:web:ad6270d8946f93e1792583"
};

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously,
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot,
    query, 
    orderBy,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Categories Data ---
const categories = {
    "🖌️ Design & Creative Tools": ["Canva Pro", "Adobe Creative Cloud", "Figma Pro"],
    "🤖 AI Tools": ["ChatGPT Plus", "Gemini (Google AI)","Perplexity AI","N8N","Granola","Superhuman","Raycast","ChatPRD","Mobbin","Cursor AI","Replit","Bolt.new","Make.com", "MidJourney", "Jasper AI"],
    "🎬 Entertainment & Streaming": ["Netflix Premium", "Spotify Premium", "Amazon Prime Video", "Disney+"],
    "📊 Productivity & Office Tools": ["Microsoft Office 365", "Google Workspace", "Notion Pro", "Evernote Premium"],
    "🛡️ Security & Utility": ["VPN Services", "Antivirus", "Cloud Storage"],
    "📚 Education & Learning": ["Coursera Plus", "Udemy Courses", "Skillshare Premium", "LinkedIn Learning"]
};

// --- DOM Elements ---
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const uploadForm = document.getElementById('upload-form');
const productGrid = document.getElementById('product-grid');
const categorySelect = document.getElementById('product-category');
const subCategorySelect = document.getElementById('product-subcategory');
const categoriesNav = document.querySelector('#categories-nav div');
const productsCountEl = document.getElementById('products-count');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('edit-form');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
// Add these for the mobile sidebar
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarCategories = document.getElementById('sidebar-categories');
const mobileAuthSection = document.getElementById('mobile-auth-section');
// Add these for the Full Image View Modal
const fullImageViewModal = document.getElementById('full-image-view-modal');
const fullImage = document.getElementById('full-image');
const closeFullImageView = document.getElementById('close-full-image-view');

// --- State Management ---
let isAdminLoggedIn = false;
let productToDeleteId = null;
let allProducts = []; // This will store a copy of all products from Firebase

// --- Toast Notification Function ---
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden', 'bg-green-500', 'bg-red-500');
    toast.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- Authentication Logic ---
onAuthStateChanged(auth, user => {
    // Clear mobile auth section first
    mobileAuthSection.innerHTML = '';

    if (user && !user.isAnonymous) {
        isAdminLoggedIn = true;
        // Desktop buttons
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        adminPanel.classList.remove('hidden');
        // Mobile button
        mobileAuthSection.innerHTML = `<button id="mobile-logout-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Logout</button>`;
        document.getElementById('mobile-logout-btn').addEventListener('click', () => logoutBtn.click()); // Trigger desktop logout
    } else {
        isAdminLoggedIn = false;
        // Desktop buttons
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        adminPanel.classList.add('hidden');
        // Mobile button
        mobileAuthSection.innerHTML = `<button id="mobile-login-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Admin Login</button>`;
        document.getElementById('mobile-login-btn').addEventListener('click', () => loginBtn.click()); // Trigger desktop login
    }
    fetchAndDisplayProducts(); 
});

async function initialSignIn() {
    try {
        if (auth.currentUser) return;
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("Initial sign-in failed:", error);
    }
}

// --- Event Listeners ---
loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => loginModal.classList.add('hidden'));
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
         loginModal.classList.add('hidden');
    }
});

logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    await initialSignIn();
    showToast('Logged out successfully!');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginModal.classList.add('hidden');
        loginForm.reset();
        showToast('Admin login successful!');
    } catch (error) {
        console.error("Login failed:", error);
        showToast('Login failed. Check console for details.', true);
    }
});

// --- MOBILE SIDEBAR LOGIC ---
const openSidebar = () => {
    mobileSidebar.classList.remove('-translate-x-full');
    mobileSidebar.classList.add('translate-x-0');
    sidebarOverlay.classList.remove('hidden');
};

const closeSidebar = () => {
    mobileSidebar.classList.remove('translate-x-0');
    mobileSidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
};

mobileMenuBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// --- MOBILE SIDEBAR ACCORDION LOGIC ---
sidebarCategories.addEventListener('click', (e) => {
    const categoryBtn = e.target.closest('.sidebar-category-btn');
    if (!categoryBtn) return; // Exit if the click was not on a category button

    const submenu = categoryBtn.nextElementSibling;
    const arrowIcon = categoryBtn.querySelector('svg');

    // Close all other submenus
    document.querySelectorAll('.sidebar-submenu').forEach(otherSubmenu => {
        if (otherSubmenu !== submenu) {
            otherSubmenu.classList.add('hidden');
            const otherArrow = otherSubmenu.previousElementSibling.querySelector('svg');
            if (otherArrow) {
                otherArrow.classList.remove('rotate-90');
            }
        }
    });

    // Toggle the clicked submenu
    submenu.classList.toggle('hidden');
    if (arrowIcon) {
        arrowIcon.classList.toggle('rotate-90');
    }
});


// --- Product Upload Logic ---
// --- Product Upload Logic ---
// --- Product Upload Logic ---
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productData = {
        name: document.getElementById('product-name').value,
        category: categorySelect.value,
        subcategory: subCategorySelect.value,
        thumbnail: document.getElementById('product-file-url').value, // Corrected ID
        actualPrice: Number(document.getElementById('actual-price').value),
        offerPrice: Number(document.getElementById('offer-price').value),
        createdAt: new Date()
    };
    try {
        await addDoc(collection(db, `artifacts/${appId}/public/data/products`), productData);
        uploadForm.reset();
        subCategorySelect.disabled = true;
        showToast('Product uploaded successfully!');
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('Error uploading product. See console.', true);
    }
});
// --- SKELETON LOADER FUNCTION ---
function showSkeletonLoaders(count = 8) {
    const skeletonHTML = `
        <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            <div class="w-full h-48 bg-gray-700"></div>
            <div class="p-2">
                <div class="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-5 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div class="flex gap-2">
                    <div class="h-10 bg-gray-700 rounded w-1/2"></div>
                    <div class="h-10 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    `;
    productGrid.innerHTML = Array(count).fill(skeletonHTML).join('');
}

// --- Dynamic Product Display ---
function renderProductCard(product) {
    const thumbnailUrl = product.thumbnail || 'https://placehold.co/600x400/111827/FFFFFF?text=Image+Not+Found';
    const onErrorScript = `this.onerror=null;this.src='https://placehold.co/600x400/111827/FFFFFF?text=Failed+To+Load';`;

    let adminButtons = '';
    if (isAdminLoggedIn) {
        const productData = encodeURIComponent(JSON.stringify(product));
        adminButtons = `<div class="absolute top-2 right-2 flex gap-2 z-10">
                <button class="edit-btn p-2 bg-blue-600/80 hover:bg-blue-700 rounded-full transition-colors" title="Edit Product" data-product="${productData}"><svg class="w-4 h-4 text-white pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                <button class="delete-btn p-2 bg-red-600/80 hover:bg-red-700 rounded-full transition-colors" title="Delete Product" data-id="${product.id}"><svg class="w-4 h-4 text-white pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
            </div>`;
    }

    let priceHTML = `<p class="text-lg font-bold text-indigo-400">Rs. ${product.offerPrice || product.actualPrice}</p>`; // Font size smaller
    if (product.actualPrice && product.offerPrice && product.actualPrice > product.offerPrice) {
        const discount = Math.round(((product.actualPrice - product.offerPrice) / product.actualPrice) * 100);
        priceHTML = `<div class="flex items-baseline gap-2">
                <p class="text-lg font-bold text-indigo-400">Rs. ${product.offerPrice}</p>
                <p class="text-xs text-gray-500 line-through">Rs. ${product.actualPrice}</p>
                <p class="text-xs font-semibold text-green-400">${discount}% off</p>
            </div>`;
    }

    const whatsappNumber = "918272946202";
    const whatsappMessage = `Hello DigiKaptan, I'm interested in purchasing the following product:\n\n*Product:* ${product.name}\n*Offer Price:* Rs. ${product.offerPrice}\n\nPlease let me know the next steps. Thank you!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return `<div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 flex flex-col group">
            ${adminButtons}
            
            <!-- 1. IMAGE HEIGHT REDUCED (h-48) -->
            <div class="relative w-full h-48 border-b border-gray-700 group">
                <img src="${thumbnailUrl}" alt="${product.name}" class="w-full h-full object-cover" onerror="${onErrorScript}">
                <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button class="full-view-btn text-white font-bold py-2 px-4 rounded-lg border-2 border-white hover:bg-white hover:text-black transition" data-full-image-url="${thumbnailUrl}">
                        Full View
                    </button>
                </div>
            </div>

            <!-- 2. PADDING AND SPACING REDUCED (p-2, mb-1) -->
            <div class="p-2 flex flex-col flex-grow">
                <p class="text-xs text-gray-400">${product.category}</p>
                <p class="text-sm font-semibold text-indigo-300">${product.subcategory}</p>
                <h3 class="text-md font-bold text-gray-100 mt-1">${product.name}</h3>
                
                <!-- 3. PRICE BLOCK MARGIN REDUCED (mt-1 mb-2) -->
                <div class="mt-1 mb-2">
                    ${priceHTML}
                </div>

                <div class="flex gap-2 mt-auto">
                    <button class="share-btn flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm" title="Share" data-name="${product.name}" data-offer-price="${product.offerPrice}" data-actual-price="${product.actualPrice}"><svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm14.363-5.332a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zM6.637 18.217a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm7.726-5.001a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm-4.5-5.001a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186z"></path></svg>Share</button>
                    <a href="${whatsappUrl}" target="_blank" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center text-sm">Buy Now</a>
                </div>
            </div>
        </div>`;
}
// This new function takes an array of products and displays them
function renderProducts(productsToDisplay) {
    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <h3 class="text-2xl font-bold text-gray-300">No Products Found</h3>
                <p class="text-gray-500 mt-2">Try a different search term or category.</p>
            </div>
        `;
    } else {
        productGrid.innerHTML = productsToDisplay.map(product => renderProductCard(product)).join('');
    }
}

function fetchAndDisplayProducts() {
    showSkeletonLoaders();
    const productsRef = collection(db, `artifacts/${appId}/public/data/products`);
const q = query(productsRef, orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
        // Store all products in our new variable
        allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Render all products initially
        renderProducts(allProducts); 
        
        productsCountEl.dataset.target = snapshot.size;
        animateCounters();
    }, (error) => {
        console.error("Error fetching products:", error);
        productGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Could not load products. See console for error.</p>';
    });
}

// --- CATEGORY NAVBAR & DROPDOWN LOGIC ---
function populateCategories() {
    // For Admin Form
    for (const category in categories) {
        const option = document.createElement('option');
        option.value = category; option.textContent = category;
        categorySelect.appendChild(option.cloneNode(true));
        document.getElementById('edit-product-category').appendChild(option);
    }
    // For Desktop Navbar
    categoriesNav.innerHTML = Object.keys(categories).map(category => `<button class="category-btn text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap" data-category="${category}">${category}</button>`).join('');

    // UPDATED FOR MOBILE SIDEBAR ACCORDION
    sidebarCategories.innerHTML = Object.keys(categories).map(category => {
        const subcategoryLinks = categories[category].map(sub => 
            `<li class="pl-4"><a href="#" class="block px-3 py-2 text-gray-400 hover:bg-gray-700 rounded-md">${sub}</a></li>`
        ).join('');

        return `
            <li>
                <button class="sidebar-category-btn w-full flex justify-between items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                    
                    <!-- THE FIX IS HERE ON THE SPAN BELOW -->
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis">${category}</span>

                    <svg class="w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
                <ul class="sidebar-submenu hidden mt-1 space-y-1">
                    ${subcategoryLinks}
                </ul>
            </li>
        `;
    }).join('');
}

function setupDynamicDropdowns() {
    const dropdownContainer = document.getElementById('category-dropdown-container');
    let hideTimeout;
    const hideMenu = () => { hideTimeout = setTimeout(() => { dropdownContainer.classList.add('hidden'); }, 200); };
    categoriesNav.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('category-btn')) {
            clearTimeout(hideTimeout);
            const button = e.target;
            const categoryName = button.dataset.category;
            dropdownContainer.innerHTML = categories[categoryName].map(sub => `<a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">${sub}</a>`).join('');
            const btnRect = button.getBoundingClientRect();
            dropdownContainer.style.left = `${btnRect.left}px`;
            dropdownContainer.style.top = `${btnRect.bottom}px`;
            dropdownContainer.style.minWidth = `${btnRect.width}px`;
            dropdownContainer.classList.remove('hidden');
        }
    });
    categoriesNav.addEventListener('mouseleave', hideMenu);
    dropdownContainer.addEventListener('mouseleave', hideMenu);
    dropdownContainer.addEventListener('mouseover', () => { clearTimeout(hideTimeout); });
}

// --- EDIT & DELETE LOGIC ---
// --- EDIT & DELETE LOGIC ---
// --- EDIT, DELETE, & SHARE LOGIC ---
// --- EDIT, DELETE, SHARE, & FULL VIEW LOGIC (Corrected Version) ---
productGrid.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const shareBtn = e.target.closest('.share-btn');
    const fullViewBtn = e.target.closest('.full-view-btn');

    // --- FULL VIEW MODAL LOGIC ---
    if (fullViewBtn) {
        const imageUrl = fullViewBtn.dataset.fullImageUrl;
        if (imageUrl) {
            fullImage.src = imageUrl;
            fullImageViewModal.classList.remove('hidden');
        }
    }

    // --- EDIT BUTTON LOGIC ---
    if (editBtn) {
        const product = JSON.parse(decodeURIComponent(editBtn.dataset.product));
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-file-url').value = product.thumbnail;
        document.getElementById('edit-actual-price').value = product.actualPrice;
        document.getElementById('edit-offer-price').value = product.offerPrice;
        
        const catDrop = document.getElementById('edit-product-category');
        catDrop.value = product.category;
        
        const subDrop = document.getElementById('edit-product-subcategory');
        subDrop.innerHTML = '';
        if (product.category && categories[product.category]) {
            categories[product.category].forEach(sub => {
                const option = document.createElement('option');
                option.value = sub; 
                option.textContent = sub;
                subDrop.appendChild(option);
            });
        }
        subDrop.value = product.subcategory;
        
        editModal.classList.remove('hidden');
    }

    // --- DELETE BUTTON LOGIC ---
    if (deleteBtn) {
        productToDeleteId = deleteBtn.dataset.id;
        deleteModal.classList.remove('hidden');
    }

    // --- SHARE BUTTON LOGIC ---
    if (shareBtn) {
        const productName = shareBtn.dataset.name;
        const offerPrice = shareBtn.dataset.offerPrice;
        const actualPrice = shareBtn.dataset.actualPrice;
        const shareText = `Check out this amazing deal on DigiKaptan!\n\n*Product:* ${productName}\n*Offer Price:* Rs. ${offerPrice} (was Rs. ${actualPrice})\n\nGet it here:`;
        const shareData = {
            title: `Deal on ${productName} from DigiKaptan!`,
            text: shareText,
            url: window.location.href
        };
        if (navigator.share) {
            navigator.share(shareData).then(() => showToast('Shared successfully!')).catch(err => console.error("Share failed:", err));
        } else {
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            showToast('Share link copied to clipboard!');
        }
    }
});
// --- FULL IMAGE VIEW MODAL CLOSE LOGIC ---
const closeFullView = () => {
    fullImageViewModal.classList.add('hidden');
    fullImage.src = ''; // Clear the image source to stop loading
};
closeFullImageView.addEventListener('click', closeFullView);
fullImageViewModal.addEventListener('click', (e) => {
    // Close if the user clicks on the dark background overlay
    if (e.target === fullImageViewModal) {
        closeFullView();
    }
});

// Handle Edit Form Submission
// Handle Edit Form Submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('edit-product-id').value;
    const updatedData = {
        name: document.getElementById('edit-product-name').value,
        thumbnail: document.getElementById('edit-product-file-url').value, // Corrected ID
        actualPrice: Number(document.getElementById('edit-actual-price').value),
        offerPrice: Number(document.getElementById('edit-offer-price').value),
        category: document.getElementById('edit-product-category').value,
        subcategory: document.getElementById('edit-product-subcategory').value,
    };
    try {
        const productRef = doc(db, `artifacts/${appId}/public/data/products`, productId);
        await updateDoc(productRef, updatedData);
        showToast('Product updated successfully!');
        editModal.classList.add('hidden');
    } catch (error) {
        console.error("Error updating document: ", error);
        showToast('Error updating product. See console.', true);
    }
});

closeEditModal.addEventListener('click', () => editModal.classList.add('hidden'));
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('edit-product-id').value;
    const updatedData = {
        name: document.getElementById('edit-product-name').value,
        price: Number(document.getElementById('edit-product-price').value),
        thumbnail: document.getElementById('edit-product-thumbnail').value,
        category: document.getElementById('edit-product-category').value,
        subcategory: document.getElementById('edit-product-subcategory').value,
    };
    try {
        await updateDoc(doc(db, `artifacts/${appId}/public/data/products`, productId), updatedData);
        showToast('Product updated successfully!');
        editModal.classList.add('hidden');
    } catch (error) { console.error("Error updating doc:", error); showToast('Update failed.', true); }
});

cancelDeleteBtn.addEventListener('click', () => { deleteModal.classList.add('hidden'); productToDeleteId = null; });
confirmDeleteBtn.addEventListener('click', async () => {
    if (productToDeleteId) {
        try {
            await deleteDoc(doc(db, `artifacts/${appId}/public/data/products`, productToDeleteId));
            showToast('Product deleted successfully!');
        } catch (error) { console.error("Error deleting doc:", error); showToast('Delete failed.', true); }
        finally { deleteModal.classList.add('hidden'); productToDeleteId = null; }
    }
});

// --- Dynamic Category Selects in Forms ---
categorySelect.addEventListener('change', () => {
    const subcats = categories[categorySelect.value] || [];
    subCategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
    subcats.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub; opt.textContent = sub;
        subCategorySelect.appendChild(opt);
    });
    subCategorySelect.disabled = !subcats.length;
});
document.getElementById('edit-product-category').addEventListener('change', (e) => {
    const subcats = categories[e.target.value] || [];
    const subDrop = document.getElementById('edit-product-subcategory');
    subDrop.innerHTML = '<option value="">Select Subcategory</option>';
    subcats.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub; opt.textContent = sub;
        subDrop.appendChild(opt);
    });
    subDrop.disabled = !subcats.length;
});

// --- Animated Counter Logic ---
function animateCounters() {
    document.querySelectorAll('#stats [data-target]').forEach(counter => {
        counter.innerText = '0';
        const target = +counter.dataset.target;
        if (target === 0) return;
        const inc = Math.max(Math.ceil(target / 200), 1);
        const animate = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.min(count + inc, target);
                setTimeout(animate, 10);
            }
        };
        animate();
    });
}

// --- SEARCH AND FILTERING LOGIC ---

const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const logoLink = document.querySelector('nav .flex-shrink-0'); // Get the logo container

// Prevent form from submitting and reloading the page
searchForm.addEventListener('submit', (e) => e.preventDefault());

// --- 1. Keyword Search Functionality ---
searchInput.addEventListener('input', () => {
    showSkeletonLoaders();
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        renderProducts(allProducts); // If search is empty, show all products
        return;
    }

    const filteredProducts = allProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        const subcategoryMatch = product.subcategory.toLowerCase().includes(searchTerm);
        return nameMatch || categoryMatch || subcategoryMatch;
    });

    renderProducts(filteredProducts);
});

// --- 2. Category Click Filtering Functionality ---
function filterByCategory(subcategoryName) {
    showSkeletonLoaders();
    const normalizedSubcategory = subcategoryName.trim();
    const filteredProducts = allProducts.filter(product => product.subcategory === normalizedSubcategory);
    
    renderProducts(filteredProducts);
    
    // Smoothly scroll to the product grid so user sees the result
    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Listen for clicks on the DESKTOP category dropdowns
document.getElementById('category-dropdown-container').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        filterByCategory(e.target.textContent);
    }
});

// Listen for clicks on the MOBILE sidebar categories
sidebarCategories.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        filterByCategory(e.target.textContent);
        closeSidebar(); // Close sidebar after selection
    }
});

// --- 3. Reset Filter Functionality ---
// Clicking the logo will clear the search and show all products
logoLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent any default link behavior
    searchInput.value = ''; // Clear search bar
    renderProducts(allProducts); // Show all products
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
});

// --- Initial Load ---
// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Functions ---
    initialSignIn();
    populateCategories();
    setupDynamicDropdowns();
    document.addEventListener('contextmenu', event => event.preventDefault());


    // --- TESTIMONIAL SLIDER LOGIC ---
    const track = document.getElementById('testimonial-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const dotsNav = document.getElementById('testimonial-dots');

        if (slides.length > 0) {
            let slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 0;
            let autoPlayInterval;

            // Create pagination dots
            slides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    moveToSlide(index);
                    resetAutoPlay();
                });
                dotsNav.appendChild(dot);
            });
            const dots = Array.from(dotsNav.children);

            const moveToSlide = (targetIndex) => {
                // Ensure slideWidth is up-to-date
                slideWidth = slides[0].getBoundingClientRect().width;
                track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
                currentIndex = targetIndex;
                updateDots();
            };

            const updateDots = () => {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };

            nextBtn.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) { nextIndex = 0; }
                moveToSlide(nextIndex);
                resetAutoPlay();
            });

            prevBtn.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) { prevIndex = slides.length - 1; }
                moveToSlide(prevIndex);
                resetAutoPlay();
            });

            const startAutoPlay = () => {
                autoPlayInterval = setInterval(() => {
                    nextBtn.click();
                }, 5000); // Change slide every 5 seconds
            };

            const resetAutoPlay = () => {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            };

            moveToSlide(0);
            startAutoPlay();

            window.addEventListener('resize', () => {
                track.style.transition = 'none';
                moveToSlide(currentIndex);
                track.offsetHeight; // Trigger reflow
                track.style.transition = 'transform 0.5s ease-in-out';
            });
        }
    }


    // --- FAQ ACCORDION LOGIC ---
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
        faqAccordion.addEventListener('click', (e) => {
            const questionButton = e.target.closest('.faq-question');
            if (questionButton) {
                const answer = questionButton.nextElementSibling;
                const icon = questionButton.querySelector('.faq-icon svg');

                answer.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            }
        });
    }

});

