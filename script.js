// ===========================================
// 1. DOM Elements (Mengambil elemen HTML)
// ===========================================
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginArea = document.getElementById('login-form-area');
const registerArea = document.getElementById('register-form-area');
const messageElement = document.getElementById('message');
const curhatanFeed = document.getElementById('curhatan-feed');
const curhatForm = document.getElementById('curhat-form');
const logoutButton = document.getElementById('logout-button');
const currentUsernameSpan = document.getElementById('current-username');
const profileForm = document.getElementById('profile-form');
const profileAvatarSelect = document.getElementById('profile-avatar-select');
const profileAvatarDisplay = document.getElementById('profile-avatar-display');


// ===========================================
// 2. Fungsi Data Management (Akun, Curhatan, Profil)
// ===========================================

// --- Akun ---
const getAccounts = () => {
    const accountsJSON = localStorage.getItem('accounts');
    return accountsJSON ? JSON.parse(accountsJSON) : [];
};
const saveAccounts = (accounts) => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
};

// --- Curhatan ---
const getCurhatan = () => {
    const curhatanJSON = localStorage.getItem('curhatan'); 
    return curhatanJSON ? JSON.parse(curhatanJSON) : [];
};
const saveCurhatan = (curhatan) => {
    localStorage.setItem('curhatan', JSON.stringify(curhatan));
};
// Tambahkan fungsi DELETE (Wajib ada di scope global karena dipanggil oleh onclick)
const deleteCurhatan = (idToDelete) => {
    let curhatan = getCurhatan();
    const updatedCurhatan = curhatan.filter(curhat => curhat.id !== idToDelete);
    saveCurhatan(updatedCurhatan);
    displayCurhatan(); // Muat ulang tampilan
};

// --- Profil ---
const getProfile = (username) => {
    const profilesJSON = localStorage.getItem('profiles');
    const allProfiles = profilesJSON ? JSON.parse(profilesJSON) : {};
    return allProfiles[username] || { name: '', bio: '', avatarEmoji: '' }; 
};
const saveProfile = (username, profileData) => {
    const profilesJSON = localStorage.getItem('profiles');
    const allProfiles = profilesJSON ? JSON.parse(profilesJSON) : {};
    allProfiles[username] = profileData;
    localStorage.setItem('profiles', JSON.stringify(allProfiles));
};


// ===========================================
// 3. Fungsi Utility
// ===========================================

// Fungsi Toggle Form (Hanya untuk login.html)
const toggleForm = (showLogin) => {
    if (showLogin) {
        if (loginArea) loginArea.style.display = 'block';
        if (registerArea) registerArea.style.display = 'none';
        if (messageElement) messageElement.textContent = ''; 
    } else {
        if (loginArea) loginArea.style.display = 'none';
        if (registerArea) registerArea.style.display = 'block';
        if (messageElement) messageElement.textContent = '';
    }
};


// ===========================================
// 4. Fungsionalitas LOGIN/REGISTER (login.html)
// ===========================================

// --- Toggle Link Listener ---
// --- Toggle Link Listener ---
if (showRegisterLink && showLoginLink) { 
    
    // Baris 87: Event Listener untuk Daftar (pindah ke Register)
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForm(false);
    });

    // Baris 91: Event Listener untuk Masuk (pindah ke Login)
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForm(true);
    });
    
} // <-- Kurung kurawal penutup untuk IF di baris 86

// --- Fungsionalitas REGISTER ---
if (registerForm) { 
    registerForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !password) {
            if (messageElement) messageElement.textContent = 'Nama pengguna dan kata sandi harus diisi.';
            return;
        }

        let accounts = getAccounts();
        const existingAccount = accounts.find(acc => acc.username === username);
        if (existingAccount) {
            if (messageElement) messageElement.textContent = 'Nama pengguna ini sudah terdaftar.';
            return;
        }

        accounts.push({ username, password });
        saveAccounts(accounts);

        if (messageElement) {
            messageElement.textContent = 'Pendaftaran berhasil! Silakan Masuk.';
            messageElement.style.color = 'green';
        }
        
        registerForm.reset();
        setTimeout(() => toggleForm(true), 1500);
    });
}

// --- Fungsionalitas LOGIN ---
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            if (messageElement) messageElement.textContent = 'Nama pengguna dan kata sandi harus diisi.';
            return;
        }

        const accounts = getAccounts();
        const user = accounts.find(acc => acc.username === username && acc.password === password);

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            if (messageElement) {
                messageElement.textContent = 'Masuk berhasil! Mengarahkan ke Beranda...';
                messageElement.style.color = 'green';
            }

            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);

        } else {
            if (messageElement) {
                messageElement.textContent = 'Nama pengguna atau kata sandi salah.';
                messageElement.style.color = 'red';
            }
        }
    });
}


// ===========================================
// 5. Fungsionalitas CURHATAN (submit.html)
// ===========================================

// --- Fungsionalitas SUBMIT CURHATAN ---
if (curhatForm) { 
    curhatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('curhat-title').value.trim();
        const content = document.getElementById('curhat-content').value.trim();
        const currentUser = localStorage.getItem('currentUser') || 'Anonim'; 

        const submitMessage = document.getElementById('submit-message');

        if (!title || !content) {
            if (submitMessage) submitMessage.textContent = 'Judul dan isi curhatan harus diisi!';
            return;
        }
        
        let curhatan = getCurhatan();
        
        const newCurhat = {
            id: Date.now(), // ID UNIK untuk menghapus
            title: title,
            content: content,
            author: currentUser, 
            date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        curhatan.unshift(newCurhat); 
        saveCurhatan(curhatan);

        // Pesan Sukses
        if (submitMessage) {
            submitMessage.textContent = 'Curhatan Rahasia berhasil dikirim!';
            submitMessage.style.color = 'green';
            submitMessage.style.display = 'block';
        }
        
        curhatForm.reset();
        setTimeout(() => {
            if (submitMessage) submitMessage.textContent = '';
        }, 3000);
    });
}


// ===========================================
// 6. Fungsionalitas PROFIL (profile.html)
// ===========================================

// --- Fungsionalitas Tampil dan Simpan Profil ---
if (profileForm) {
    const currentUser = localStorage.getItem('currentUser');
    const profileMessage = document.getElementById('profile-message');

    // Load Data Profil Saat Halaman Dimuat
    const loadProfileData = () => {
        if (!currentUser) return;
        const profileData = getProfile(currentUser);
        
        // Menampilkan Username Saat Ini 
        if (currentUsernameSpan) {
            currentUsernameSpan.textContent = `@${currentUser}`;
        }
        
        // Memuat field
        if (profileAvatarSelect) profileAvatarSelect.value = profileData.avatarEmoji || '';
        document.getElementById('profile-name').value = profileData.name || '';
        document.getElementById('profile-bio').value = profileData.bio || '';
        
        // Menampilkan Avatar/Emoji
        if (profileAvatarDisplay) {
            if (profileData.avatarEmoji) {
                profileAvatarDisplay.innerHTML = profileData.avatarEmoji;
                profileAvatarDisplay.style.fontSize = '65px'; // Ukuran besar untuk profil
            } else {
                profileAvatarDisplay.textContent = currentUser.charAt(0).toUpperCase();
                profileAvatarDisplay.style.fontSize = '40px'; // Ukuran inisial
            }
        }
    };

    loadProfileData();

    // Simpan Profil Saat Form di-Submit
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const avatarEmoji = profileAvatarSelect ? profileAvatarSelect.value : '';
        const name = document.getElementById('profile-name').value.trim();
        const bio = document.getElementById('profile-bio').value.trim();

        const profileData = { avatarEmoji, name, bio };
        saveProfile(currentUser, profileData);
        loadProfileData(); 

        if (profileMessage) {
            profileMessage.textContent = 'Profil berhasil diperbarui!';
            profileMessage.style.display = 'block';
        }
        setTimeout(() => { if (profileMessage) profileMessage.style.display = 'none'; }, 3000);
    });
}


// ===========================================
// 7. Fungsionalitas DISPLAY (index.html & Header)
// ===========================================

// --- Tampil Foto Profil di Header ---
const displayHeaderProfile = () => {
    const headerAvatarElement = document.getElementById('header-profile-display');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!headerAvatarElement || !currentUser) return;

    const profileData = getProfile(currentUser); 
    const initial = currentUser.charAt(0).toUpperCase();

    let content;
    
    if (profileData.avatarEmoji) {
        content = profileData.avatarEmoji;
        headerAvatarElement.innerHTML = content;
        headerAvatarElement.style.fontSize = '24px'; // Ukuran sedang di header
    } 
    else {
        content = initial;
        headerAvatarElement.textContent = content;
        headerAvatarElement.style.fontSize = '16px'; // Ukuran kecil di header
    }
};

// --- Fungsionalitas Tampil Curhatan (index.html) ---
const displayCurhatan = () => {
    if (!curhatanFeed) return; // Keluar jika bukan index.html

    const curhatan = getCurhatan();
    curhatanFeed.innerHTML = ''; 

    if (curhatan.length === 0) {
        curhatanFeed.innerHTML = '<p style="padding: 15px; text-align: center; color: #888;">Belum ada curhatan rahasia.</p>';
        return;
    }

    curhatan.forEach(curhat => {
        const authorProfile = getProfile(curhat.author);
        const initial = curhat.author ? curhat.author.charAt(0).toUpperCase() : 'A';
        
        // Tentukan Nama yang Ditampilkan
        const displayName = authorProfile.name || 'Anonim'; 
        
        // Tentukan Konten Avatar
        let avatarContent;
        if (authorProfile.avatarEmoji) {
            avatarContent = authorProfile.avatarEmoji;
        } else {
            avatarContent = initial;
        }

        const card = document.createElement('div');
        card.className = 'curhatan-card';
        
        card.innerHTML = `
            <div class="curhatan-avatar">${avatarContent}</div>
            <div class="curhatan-content-area">
                <div class="curhatan-header">
                    <span class="curhatan-username">${displayName}</span>
                    <span class="curhatan-meta">@${curhat.author} · ${curhat.date}</span>
                    
                    <button class="btn-delete-curhat" onclick="deleteCurhatan(${curhat.id})">
                        Hapus
                    </button>
                </div>
                <div class="curhatan-body">
                    <h3>${curhat.title}</h3>
                    <p>${curhat.content.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
        
        curhatanFeed.appendChild(card);
    });
};


// --- Panggil Semua Fungsi Utama saat halaman dimuat ---

const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn && (currentPage === 'index.html' || currentPage === 'submit.html' || currentPage === 'profile.html' || currentPage === '')) {
        if (currentPage !== 'login.html') {
             window.location.href = 'login.html';
        }
    }
};

checkLoginStatus(); // Cek status login

// Panggil fungsi display HANYA jika elemennya ada di halaman
if (document.getElementById('header-profile-display')) {
    displayHeaderProfile(); 
}

if (curhatanFeed) {
    displayCurhatan(); 
}

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}