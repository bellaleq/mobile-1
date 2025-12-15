// ==================== CONFIGURATION ====================
const SUPABASE_URL = 'https://jwbduvwjkpluxtyawxve.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YmR1dndqa3BsdXh0eWF3eHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTMxMTEsImV4cCI6MjA4MTM2OTExMX0.a2aOmXh1-rLAWbrN9aTmsKGL0W7MtitVm2S0bcw1H-8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Language texts
const texts = {
    pashto: {
        formTitle: "تلفون جدید ثبت کړئ",
        brandLabel: "برانډ (مارک)",
        modelLabel: "مودل",
        priceLabel: "قیمت (افغانی)",
        partsLabel: "قطعات (پرزه‌جاتی)",
        descriptionLabel: "اضافی معلومات",
        submitBtnText: "ثبت کړئ",
        resetBtnText: "پاک کړئ",
        resetDbBtnText: "بازنشانی دیتابیس",
        tableTitle: "ثبت شوي تلفون‌ها",
        totalPhonesText: "تعداد تلفون‌ها",
        avgPriceText: "میانگین قیمت",
        totalPartsText: "قطعات ثبت شده",
        emptyTableText: "تر اوسه هیڅ تلفون ثبت نه دی شوی.",
        parts: ["باتری", "چارجر", "هندزفری", "کابل", "کاور", "سکرین پروتکتور", "میموری کارت"],
        toastSaved: "تلفون په بریالیتوب سره ثبت شو!",
        toastUpdated: "تلفون معلومات تازه شول!",
        toastDeleted: "تلفون له لیست څخه ړنگ شو!",
        toastError: "لطفاً ټول اړین معلومات ډک کړئ!",
        toastLoginSuccess: "په بریالیتوب سره سیستم ته ننوتل!",
        toastRegisterSuccess: "حساب په بریالیتوب سره جوړ شو!",
        toastResetDb: "دیتابیس په بریالیتوب سره بازنشانی شو!",
        languageText: "پښتو",
        connected: "متصل به دیتابیس",
        disconnected: "دیتابیس سره وصل نه دی",
        syncSuccess: "دیتابیس سره همغږي شو!",
        confirmDelete: "آیا مطمئن هستید؟",
        confirmReset: "آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید؟",
        accessDenied: "شما دسترسی لازم برای این عملیات را ندارید"
    },
    dari: {
        formTitle: "تلفون جدید ثبت کنید",
        brandLabel: "برند (مارک)",
        modelLabel: "مدل",
        priceLabel: "قیمت (افغانی)",
        partsLabel: "قطعات (پرزه‌جات)",
        descriptionLabel: "اطلاعات اضافی",
        submitBtnText: "ثبت کنید",
        resetBtnText: "پاک کنید",
        resetDbBtnText: "بازنشانی دیتابیس",
        tableTitle: "تلفون‌های ثبت شده",
        totalPhonesText: "تعداد تلفون‌ها",
        avgPriceText: "میانگین قیمت",
        totalPartsText: "قطعات ثبت شده",
        emptyTableText: "تا اکنون هیچ تلفونی ثبت نشده است.",
        parts: ["باتری", "شارژر", "هندزفری", "کابل", "کاور", "محافظ صفحه", "کارت حافظه"],
        toastSaved: "تلفون با موفقیت ثبت شد!",
        toastUpdated: "اطلاعات تلفون به‌روز شد!",
        toastDeleted: "تلفون از لیست حذف شد!",
        toastError: "لطفاً تمام اطلاعات ضروری را پر کنید!",
        toastLoginSuccess: "ورود به سیستم موفقیت‌آمیز بود!",
        toastRegisterSuccess: "ثبت‌نام با موفقیت انجام شد!",
        toastResetDb: "دیتابیس با موفقیت بازنشانی شد!",
        languageText: "دری",
        connected: "متصل به دیتابیس",
        disconnected: "عدم اتصال به دیتابیس",
        syncSuccess: "همگام‌سازی با دیتابیس انجام شد!",
        confirmDelete: "آیا مطمئن هستید؟",
        confirmReset: "آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید؟",
        accessDenied: "شما دسترسی لازم برای این عملیات را ندارید"
    }
};

// ==================== GLOBAL VARIABLES ====================
let currentLang = 'pashto';
let currentUser = null;
let phonesDB = JSON.parse(localStorage.getItem('phonesDB')) || [];
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
let isOnline = true;

// ==================== DOM ELEMENTS ====================
let authContainer, appContainer, loginTab, registerTab, loginForm, registerForm, phoneForm;
let partsContainer, phoneTableBody, emptyRow, toast, toastTitle, toastMessage, toastClose;
let logoutBtn, logoutBtnMobile, mobileMenuBtn, userInfoMobile, formSection, actionsHeader;
let languageToggle, languageText, resetDbBtn, loadingIndicator;

// ==================== INITIALIZATION FUNCTIONS ====================

async function initializeDefaultAdmin() {
    try {
        // First check if admin exists in Supabase (if online)
        let adminExists = false;
        
        if (isOnline) {
            const { data: supabaseUsers, error } = await supabase
                .from('users')
                .select('email')
                .eq('email', 'admin@gmail.com')
                .limit(1);
            
            if (!error && supabaseUsers && supabaseUsers.length > 0) {
                adminExists = true;
            }
        }
        
        // If not in Supabase, check localStorage
        if (!adminExists) {
            adminExists = usersDB.some(u => u.email === 'admin@gmail.com');
            
            if (!adminExists) {
                // Create admin user
                const adminUser = {
                    id: 'admin_' + Date.now(),
                    name: 'مدیر سیستم',
                    email: 'admin@gmail.com',
                    password: 'admin123',
                    role: 'admin',
                    avatar_text: 'م',
                    language: 'pashto',
                    created_at: new Date().toISOString()
                };
                
                // Add to localStorage
                usersDB.push(adminUser);
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                
                // Add to Supabase if online
                if (isOnline) {
                    try {
                        const { error } = await supabase
                            .from('users')
                            .insert([adminUser]);
                        
                        if (error) {
                            console.error('Error creating admin in Supabase:', error);
                        } else {
                            console.log('✅ Admin user created in Supabase');
                        }
                    } catch (supabaseError) {
                        console.log('⚠️ Could not sync admin with Supabase');
                    }
                }
                
                console.log('✅ Admin user created');
            }
        }
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
    }
}

async function checkConnection() {
    try {
        // Test connection with a simple query
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1)
            .single();
        
        isOnline = !error;
        updateConnectionStatus();
        
        if (isOnline) {
            console.log('✅ Connected to Supabase');
        } else {
            console.log('❌ Not connected to Supabase');
        }
        
        return isOnline;
    } catch (error) {
        console.error('Connection check error:', error);
        isOnline = false;
        updateConnectionStatus();
        return false;
    }
}

function updateConnectionStatus() {
    const connectionStatus = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    if (connectionStatus && statusText) {
        connectionStatus.className = isOnline ? 'connection-status online' : 'connection-status offline';
        statusText.textContent = isOnline ? texts[currentLang].connected : texts[currentLang].disconnected;
    }
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function showAuth() {
    if (authContainer) authContainer.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    showLoginForm();
}

async function showApp() {
    if (!currentUser) {
        showAuth();
        return;
    }
    
    if (authContainer) authContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    
    await initializeAppData();
}

async function initializeAppData() {
    updateUserInfo();
    setLanguage(currentUser.language || 'pashto');
    loadParts();
    await loadTableData();
    updateStats();
    toggleAdminFeatures();
    
    if (resetDbBtn) {
        resetDbBtn.style.display = currentUser.role === 'admin' ? 'block' : 'none';
    }
}

function showLoginForm() {
    if (loginTab) {
        loginTab.classList.add('active');
        loginTab.classList.remove('inactive');
    }
    if (registerTab) {
        registerTab.classList.remove('active');
        registerTab.classList.add('inactive');
    }
    if (loginForm) {
        loginForm.classList.add('active');
        loginForm.classList.remove('inactive');
    }
    if (registerForm) {
        registerForm.classList.remove('active');
        registerForm.classList.add('inactive');
    }
    
    // Reset login form
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').reset();
    }
}

function showRegisterForm() {
    if (registerTab) {
        registerTab.classList.add('active');
        registerTab.classList.remove('inactive');
    }
    if (loginTab) {
        loginTab.classList.remove('active');
        loginTab.classList.add('inactive');
    }
    if (registerForm) {
        registerForm.classList.add('active');
        registerForm.classList.remove('inactive');
    }
    if (loginForm) {
        loginForm.classList.remove('active');
        loginForm.classList.add('inactive');
    }
    
    // Reset register form
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').reset();
    }
}

function updateUserInfo() {
    if (!currentUser) return;
    
    const avatarText = currentUser.avatar_text || currentUser.name.charAt(0);
    const roleText = currentUser.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی';
    const headerRoleText = currentUser.role === 'admin' ? 'مدیریت کامل سیستم' : 'مشاهده اطلاعات';
    
    // Update desktop header
    const avatarEl = document.getElementById('avatarText');
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const headerRoleEl = document.getElementById('headerRoleText');
    
    if (avatarEl) avatarEl.textContent = avatarText;
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userRoleEl) userRoleEl.textContent = roleText;
    if (headerRoleEl) headerRoleEl.textContent = headerRoleText;
    
    // Update mobile header
    const avatarMobileEl = document.getElementById('avatarTextMobile');
    const userNameMobileEl = document.getElementById('userNameMobile');
    const userRoleMobileEl = document.getElementById('userRoleMobile');
    
    if (avatarMobileEl) avatarMobileEl.textContent = avatarText;
    if (userNameMobileEl) userNameMobileEl.textContent = currentUser.name;
    if (userRoleMobileEl) userRoleMobileEl.textContent = roleText;
    
    // Update avatar colors
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(avatar => {
        avatar.className = 'user-avatar ' + currentUser.role;
    });
}

// ==================== LANGUAGE FUNCTIONS ====================

function setLanguage(lang) {
    currentLang = lang;
    
    // Save user language preference
    if (currentUser) {
        currentUser.language = lang;
        localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
        
        // Update in Supabase if online
        if (isOnline) {
            supabase
                .from('users')
                .update({ language: lang })
                .eq('id', currentUser.id)
                .then(({ error }) => {
                    if (error) console.error('Error updating language:', error);
                });
        }
    }
    
    // Update all UI texts
    updateUITexts();
    updateConnectionStatus();
    loadParts();
}

function updateUITexts() {
    const lang = texts[currentLang];
    
    // Update form labels
    const formLabels = {
        'formTitle': lang.formTitle,
        'brandLabel': lang.brandLabel,
        'modelLabel': lang.modelLabel,
        'priceLabel': lang.priceLabel,
        'partsLabel': lang.partsLabel,
        'descriptionLabel': lang.descriptionLabel,
        'submitBtnText': lang.submitBtnText,
        'resetBtnText': lang.resetBtnText,
        'resetDbBtnText': lang.resetDbBtnText,
        'tableTitle': lang.tableTitle,
        'totalPhonesText': lang.totalPhonesText,
        'avgPriceText': lang.avgPriceText,
        'totalPartsText': lang.totalPartsText,
        'emptyTableText': lang.emptyTableText,
        'languageText': lang.languageText
    };
    
    Object.keys(formLabels).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = formLabels[id];
        }
    });
    
    // Update auth tabs
    const loginTabText = document.getElementById('loginTabText');
    const registerTabText = document.getElementById('registerTabText');
    const loginBtnText = document.getElementById('loginBtnText');
    const registerBtnText = document.getElementById('registerBtnText');
    
    if (loginTabText) loginTabText.textContent = currentLang === 'pashto' ? 'ننوتل' : 'ورود';
    if (registerTabText) registerTabText.textContent = currentLang === 'pashto' ? 'نوی حساب' : 'ثبت‌نام';
    if (loginBtnText) loginBtnText.textContent = currentLang === 'pashto' ? 'ننوتل' : 'ورود';
    if (registerBtnText) registerBtnText.textContent = currentLang === 'pashto' ? 'ثبت کړئ' : 'ثبت‌نام';
    
    // Update table headers if they exist
    const tableHeaders = document.querySelectorAll('th');
    if (tableHeaders.length >= 5) {
        tableHeaders[0].textContent = currentLang === 'pashto' ? 'برانډ' : 'برند';
        tableHeaders[1].textContent = currentLang === 'pashto' ? 'مودل' : 'مدل';
        tableHeaders[2].textContent = currentLang === 'pashto' ? 'قیمت' : 'قیمت';
        tableHeaders[3].textContent = currentLang === 'pashto' ? 'قطعات' : 'قطعات';
        tableHeaders[4].textContent = currentLang === 'pashto' ? 'عملیات' : 'عملیات';
    }
}

function toggleLanguage() {
    const newLang = currentLang === 'pashto' ? 'dari' : 'pashto';
    setLanguage(newLang);
    
    // Reload table data with new language
    loadTableData();
}

function toggleAdminFeatures() {
    if (!currentUser) return;
    
    if (currentUser.role === 'admin') {
        if (formSection) formSection.style.display = 'block';
        if (actionsHeader) actionsHeader.style.display = 'table-cell';
        
        // Show action buttons in table
        document.querySelectorAll('.action-buttons').forEach(btn => {
            btn.style.display = 'flex';
        });
    } else {
        if (formSection) formSection.style.display = 'none';
        if (actionsHeader) actionsHeader.style.display = 'none';
        
        // Hide action buttons in table
        document.querySelectorAll('.action-buttons').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

// ==================== FORM FUNCTIONS ====================

function loadParts() {
    if (!partsContainer) return;
    
    partsContainer.innerHTML = '';
    
    texts[currentLang].parts.forEach(part => {
        const checkboxId = `part_${part.replace(/\s+/g, '_')}`;
        
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        
        checkboxItem.innerHTML = `
            <input type="checkbox" id="${checkboxId}" name="parts" value="${part}">
            <label for="${checkboxId}">${part}</label>
        `;
        
        partsContainer.appendChild(checkboxItem);
    });
}

function togglePasswordVisibility(inputId, toggleButtonId) {
    const input = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleButtonId);
    
    if (input && toggleButton) {
        const icon = toggleButton.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'fas fa-eye';
        }
    }
}

// ==================== EVENT LISTENERS SETUP ====================

function setupEventListeners() {
    // Auth tabs
    if (loginTab) {
        loginTab.addEventListener('click', showLoginForm);
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', showRegisterForm);
    }
    
    // Password toggles
    const loginToggle = document.getElementById('loginPasswordToggle');
    const registerToggle = document.getElementById('registerPasswordToggle');
    const confirmToggle = document.getElementById('registerConfirmPasswordToggle');
    
    if (loginToggle) {
        loginToggle.addEventListener('click', () => 
            togglePasswordVisibility('loginPassword', 'loginPasswordToggle'));
    }
    
    if (registerToggle) {
        registerToggle.addEventListener('click', () => 
            togglePasswordVisibility('registerPassword', 'registerPasswordToggle'));
    }
    
    if (confirmToggle) {
        confirmToggle.addEventListener('click', () => 
            togglePasswordVisibility('registerConfirmPassword', 'registerConfirmPasswordToggle'));
    }
    
    // Forms
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (phoneForm) {
        phoneForm.addEventListener('submit', handlePhoneFormSubmit);
    }
    
    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPhoneForm);
    }
    
    if (resetDbBtn) {
        resetDbBtn.addEventListener('click', resetDatabase);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', handleLogout);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }
    
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // Sync button
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', syncWithSupabase);
    }
}

// ==================== AUTH HANDLERS ====================

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('خطا', 'لطفاً اطلاعات ورود را تکمیل کنید', 'error');
        return;
    }
    
    // Disable login button and show loading
    const loginBtn = document.getElementById('loginBtn');
    const originalContent = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
                        (currentLang === 'pashto' ? 'د ننوتلو په حال کې...' : 'در حال ورود...');
    
    try {
        let user = null;
        
        // First check in localStorage
        user = usersDB.find(u => u.email === email && u.password === password);
        
        // If not found or online, check Supabase
        if ((!user || isOnline) && isOnline) {
            try {
                const { data: supabaseUser, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)
                    .single();
                
                if (!error && supabaseUser) {
                    user = supabaseUser;
                    
                    // Add to localStorage for offline access
                    const userExists = usersDB.some(u => u.id === user.id);
                    if (!userExists) {
                        usersDB.push(user);
                        localStorage.setItem('usersDB', JSON.stringify(usersDB));
                    }
                }
            } catch (supabaseError) {
                console.log('Supabase login check failed, using local data');
            }
        }
        
        if (user) {
            currentUser = user;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            // Update online status
            await checkConnection();
            
            // Show app
            await showApp();
            showToast('موفقیت', texts[currentLang].toastLoginSuccess, 'success');
        } else {
            showToast('خطا', 'ایمیل یا رمز عبور اشتباه است', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('خطا', 'خطا در ورود به سیستم', 'error');
    } finally {
        // Re-enable login button
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalContent;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('خطا', 'لطفاً تمام فیلدها را پر کنید', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('خطا', 'رمز عبور و تکرار آن مطابقت ندارند', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('خطا', 'رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('خطا', 'فرمت ایمیل معتبر نیست', 'error');
        return;
    }
    
    if (email === 'admin@gmail.com') {
        showToast('خطا', 'این ایمیل برای مدیر سیستم رزرو شده است', 'error');
        return;
    }
    
    // Disable register button and show loading
    const registerBtn = document.getElementById('registerBtn');
    const originalContent = registerBtn.innerHTML;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
                           (currentLang === 'pashto' ? 'د ثبت په حال کې...' : 'در حال ثبت‌نام...');
    
    try {
        // Check if email exists
        let emailExists = usersDB.some(u => u.email === email);
        
        if (!emailExists && isOnline) {
            try {
                const { data: existingUser, error } = await supabase
                    .from('users')
                    .select('email')
                    .eq('email', email)
                    .single();
                
                emailExists = !error && existingUser;
            } catch (supabaseError) {
                console.log('Supabase email check failed');
            }
        }
        
        if (emailExists) {
            showToast('خطا', 'این ایمیل قبلاً ثبت شده است', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + Date.now(),
            name,
            email,
            password,
            role: 'user',
            avatar_text: name.charAt(0),
            language: 'pashto',
            created_at: new Date().toISOString()
        };
        
        // Save to localStorage
        usersDB.push(newUser);
        localStorage.setItem('usersDB', JSON.stringify(usersDB));
        
        // Save to Supabase if online
        if (isOnline) {
            try {
                const { error } = await supabase.from('users').insert([newUser]);
                if (error) throw error;
            } catch (supabaseError) {
                console.log('Could not save user to Supabase');
            }
        }
        
        // Login the new user
        currentUser = newUser;
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        
        // Update online status
        await checkConnection();
        
        // Show app
        await showApp();
        showToast('موفقیت', texts[currentLang].toastRegisterSuccess, 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showToast('خطا', 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید', 'error');
    } finally {
        // Re-enable register button
        registerBtn.disabled = false;
        registerBtn.innerHTML = originalContent;
    }
}

// ==================== PHONE MANAGEMENT FUNCTIONS ====================

async function handlePhoneFormSubmit(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('خطا', texts[currentLang].accessDenied, 'error');
        return;
    }
    
    const brand = document.getElementById('brand').value.trim();
    const model = document.getElementById('model').value.trim();
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value.trim();
    const recordId = document.getElementById('recordId').value;
    
    // Validation
    if (!brand || !model || !price) {
        showToast('خطا', texts[currentLang].toastError, 'error');
        return;
    }
    
    if (isNaN(price) || parseInt(price) <= 0) {
        showToast('خطا', 'قیمت باید عدد مثبت باشد', 'error');
        return;
    }
    
    // Get selected parts
    const selectedParts = [];
    document.querySelectorAll('input[name="parts"]:checked').forEach(checkbox => {
        selectedParts.push(checkbox.value);
    });
    
    // Create phone object
    const phone = {
        brand,
        model,
        price: parseInt(price),
        parts: selectedParts,
        description,
        date: new Date().toLocaleDateString('fa-IR'),
        added_by: currentUser.name,
        added_by_id: currentUser.id,
        created_at: new Date().toISOString()
    };
    
    showLoading();
    
    try {
        if (recordId) {
            // Update existing phone
            phone.id = recordId;
            const index = phonesDB.findIndex(p => p.id === recordId);
            
            if (index !== -1) {
                // Update in localStorage
                phonesDB[index] = phone;
                localStorage.setItem('phonesDB', JSON.stringify(phonesDB));
                
                // Update in Supabase if online
                if (isOnline) {
                    try {
                        const { error } = await supabase
                            .from('phones')
                            .update(phone)
                            .eq('id', recordId);
                        
                        if (error) throw error;
                    } catch (supabaseError) {
                        console.log('Could not update in Supabase');
                    }
                }
                
                showToast('موفقیت', texts[currentLang].toastUpdated, 'success');
            }
        } else {
            // Create new phone
            phone.id = 'phone_' + Date.now();
            
            // Add to localStorage
            phonesDB.unshift(phone); // Add to beginning
            localStorage.setItem('phonesDB', JSON.stringify(phonesDB));
            
            // Add to Supabase if online
            if (isOnline) {
                try {
                    const { error } = await supabase.from('phones').insert([phone]);
                    if (error) throw error;
                } catch (supabaseError) {
                    console.log('Could not save to Supabase');
                }
            }
            
            showToast('موفقیت', texts[currentLang].toastSaved, 'success');
        }
        
        // Reset form and reload data
        resetPhoneForm();
        await loadTableData();
        updateStats();
    } catch (error) {
        console.error('Error saving phone:', error);
        showToast('خطا', 'خطا در ذخیره اطلاعات', 'error');
    } finally {
        hideLoading();
    }
}

async function loadTableData() {
    if (!phoneTableBody) return;
    
    showLoading();
    
    try {
        // If online, try to sync with Supabase
        if (isOnline) {
            try {
                const { data: supabasePhones, error } = await supabase
                    .from('phones')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (!error && supabasePhones) {
                    phonesDB = supabasePhones;
                    localStorage.setItem('phonesDB', JSON.stringify(phonesDB));
                    console.log('✅ Synced phones from Supabase');
                } else if (error) {
                    console.error('Error loading from Supabase:', error);
                }
            } catch (supabaseError) {
                console.log('Could not load from Supabase');
            }
        }
        
        // Clear table
        phoneTableBody.innerHTML = '';
        
        // Check if there's data
        if (phonesDB.length === 0) {
            if (emptyRow) {
                phoneTableBody.appendChild(emptyRow);
            }
            return;
        }
        
        // Add rows for each phone
        phonesDB.forEach(phone => {
            const row = document.createElement('tr');
            
            // Format price
            const formattedPrice = phone.price ? phone.price.toLocaleString('fa-IR') + ' افغانی' : '0 افغانی';
            
            // Create parts HTML
            let partsHTML = '';
            if (phone.parts && phone.parts.length > 0) {
                partsHTML = '<div class="parts-list">';
                phone.parts.forEach(part => {
                    partsHTML += `<span class="part-tag">${part}</span>`;
                });
                partsHTML += '</div>';
            } else {
                partsHTML = '<span class="no-parts">---</span>';
            }
            
            // Create actions HTML based on user role
            let actionsHTML = '';
            if (currentUser && currentUser.role === 'admin') {
                actionsHTML = `
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${phone.id}" title="${currentLang === 'pashto' ? 'تصحیح' : 'ویرایش'}">
                            <i class="fas fa-edit"></i> ${currentLang === 'pashto' ? 'تصحیح' : 'ویرایش'}
                        </button>
                        <button class="action-btn delete-btn" data-id="${phone.id}" title="${currentLang === 'pashto' ? 'ړنگول' : 'حذف'}">
                            <i class="fas fa-trash"></i> ${currentLang === 'pashto' ? 'ړنگول' : 'حذف'}
                        </button>
                    </div>
                `;
            } else {
                actionsHTML = '<span class="view-only">' + 
                             (currentLang === 'pashto' ? 'فقط لیدل' : 'فقط مشاهده') + 
                             '</span>';
            }
            
            // Set row HTML
            row.innerHTML = `
                <td>
                    <div class="brand-info">
                        <strong>${phone.brand || '---'}</strong>
                        ${phone.description ? `<small class="phone-description">${phone.description}</small>` : ''}
                    </div>
                </td>
                <td>${phone.model || '---'}</td>
                <td><strong class="price-display">${formattedPrice}</strong></td>
                <td>${partsHTML}</td>
                <td>${actionsHTML}</td>
            `;
            
            phoneTableBody.appendChild(row);
        });
        
        // Add event listeners for action buttons
        if (currentUser && currentUser.role === 'admin') {
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editPhone(btn.dataset.id));
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deletePhone(btn.dataset.id));
            });
        }
    } catch (error) {
        console.error('Error loading table data:', error);
        showToast('خطا', 'خطا در بارگذاری اطلاعات', 'error');
    } finally {
        hideLoading();
    }
}

async function syncWithSupabase() {
    showLoading();
    
    try {
        if (!isOnline) {
            showToast('خطا', 'عدم اتصال به اینترنت', 'error');
            return;
        }
        
        // Sync phones from localStorage to Supabase
        for (const phone of phonesDB) {
            // Check if phone exists in Supabase
            const { data: existingPhone, error: checkError } = await supabase
                .from('phones')
                .select('id')
                .eq('id', phone.id)
                .single();
            
            if (checkError || !existingPhone) {
                // Phone doesn't exist in Supabase, insert it
                const { error } = await supabase
                    .from('phones')
                    .insert([phone]);
                
                if (error) {
                    console.error('Error syncing phone:', error);
                }
            }
        }
        
        // Also sync from Supabase to localStorage
        await loadTableData();
        
        showToast('موفقیت', texts[currentLang].syncSuccess, 'success');
    } catch (error) {
        console.error('Error syncing with Supabase:', error);
        showToast('خطا', 'خطا در همگام‌سازی', 'error');
    } finally {
        hideLoading();
    }
}

function editPhone(id) {
    const phone = phonesDB.find(p => p.id === id);
    if (!phone) {
        showToast('خطا', 'مورد یافت نشد', 'error');
        return;
    }
    
    // Fill form with phone data
    document.getElementById('brand').value = phone.brand;
    document.getElementById('model').value = phone.model;
    document.getElementById('price').value = phone.price;
    document.getElementById('description').value = phone.description || '';
    document.getElementById('recordId').value = phone.id;
    
    // Check parts checkboxes
    document.querySelectorAll('input[name="parts"]').forEach(checkbox => {
        checkbox.checked = phone.parts ? phone.parts.includes(checkbox.value) : false;
    });
    
    // Scroll to form
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Change submit button text
    const submitBtn = document.getElementById('submitBtnText');
    if (submitBtn) {
        submitBtn.textContent = currentLang === 'pashto' ? 'تازه کول' : 'به‌روزرسانی';
    }
}

async function deletePhone(id) {
    if (!confirm(texts[currentLang].confirmDelete)) return;
    
    showLoading();
    
    try {
        // Remove from localStorage
        phonesDB = phonesDB.filter(p => p.id !== id);
        localStorage.setItem('phonesDB', JSON.stringify(phonesDB));
        
        // Remove from Supabase if online
        if (isOnline) {
            try {
                const { error } = await supabase
                    .from('phones')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
            } catch (supabaseError) {
                console.log('Could not delete from Supabase');
            }
        }
        
        showToast('موفقیت', texts[currentLang].toastDeleted, 'warning');
        await loadTableData();
        updateStats();
    } catch (error) {
        console.error('Error deleting phone:', error);
        showToast('خطا', 'خطا در حذف اطلاعات', 'error');
    } finally {
        hideLoading();
    }
}

function resetPhoneForm() {
    if (phoneForm) {
        phoneForm.reset();
        document.getElementById('recordId').value = '';
        
        // Reset submit button text
        const submitBtn = document.getElementById('submitBtnText');
        if (submitBtn) {
            submitBtn.textContent = texts[currentLang].submitBtnText;
        }
    }
}

function updateStats() {
    const totalPhones = phonesDB.length;
    const totalPhonesEl = document.getElementById('totalPhones');
    const avgPriceEl = document.getElementById('avgPrice');
    const totalPartsEl = document.getElementById('totalParts');
    
    if (totalPhonesEl) {
        totalPhonesEl.textContent = totalPhones.toLocaleString('fa-IR');
    }
    
    if (totalPhones > 0) {
        const totalPrice = phonesDB.reduce((sum, phone) => sum + (phone.price || 0), 0);
        const avgPrice = Math.round(totalPrice / totalPhones);
        
        if (avgPriceEl) {
            avgPriceEl.textContent = avgPrice.toLocaleString('fa-IR') + ' افغانی';
        }
        
        const totalParts = phonesDB.reduce((sum, phone) => 
            sum + (phone.parts ? phone.parts.length : 0), 0);
        
        if (totalPartsEl) {
            totalPartsEl.textContent = totalParts.toLocaleString('fa-IR');
        }
    } else {
        if (avgPriceEl) avgPriceEl.textContent = '0 افغانی';
        if (totalPartsEl) totalPartsEl.textContent = '0';
    }
}

async function resetDatabase() {
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('خطا', texts[currentLang].accessDenied, 'error');
        return;
    }
    
    if (!confirm(texts[currentLang].confirmReset)) return;
    
    showLoading();
    
    try {
        // Clear phones from localStorage
        phonesDB = [];
        localStorage.setItem('phonesDB', JSON.stringify(phonesDB));
        
        // Clear phones from Supabase if online
        if (isOnline) {
            try {
                const { error } = await supabase
                    .from('phones')
                    .delete()
                    .neq('id', '');
                
                if (error) throw error;
            } catch (supabaseError) {
                console.log('Could not reset Supabase');
            }
        }
        
        showToast('موفقیت', texts[currentLang].toastResetDb, 'success');
        
        // Reset form and reload data
        resetPhoneForm();
        await loadTableData();
        updateStats();
    } catch (error) {
        console.error('Error resetting database:', error);
        showToast('خطا', 'خطا در بازنشانی دیتابیس', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== UTILITY FUNCTIONS ====================

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('loggedInUser');
    showAuth();
    
    // Show logout message
    showToast('موفقیت', currentLang === 'pashto' ? 'په بریالیتوب سره سیستم څخه ووتل' : 'با موفقیت از سیستم خارج شدید', 'info');
}

function toggleMobileMenu() {
    if (userInfoMobile) {
        userInfoMobile.classList.toggle('hidden');
    }
}

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('active');
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('active');
    }
}

function showToast(title, message, type = 'success') {
    if (!toast || !toastTitle || !toastMessage) return;
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set toast type
    toast.className = 'toast ' + type;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    if (toast) {
        toast.classList.remove('show');
    }
}

// ==================== INITIALIZATION ====================

function getDOMElements() {
    authContainer = document.getElementById('authContainer');
    appContainer = document.getElementById('appContainer');
    loginTab = document.getElementById('loginTab');
    registerTab = document.getElementById('registerTab');
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    phoneForm = document.getElementById('phoneForm');
    partsContainer = document.getElementById('partsContainer');
    phoneTableBody = document.getElementById('phoneTableBody');
    emptyRow = document.getElementById('emptyRow');
    toast = document.getElementById('toast');
    toastTitle = document.getElementById('toastTitle');
    toastMessage = document.getElementById('toastMessage');
    toastClose = document.getElementById('toastClose');
    logoutBtn = document.getElementById('logoutBtn');
    logoutBtnMobile = document.getElementById('logoutBtnMobile');
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
    userInfoMobile = document.getElementById('userInfoMobile');
    formSection = document.getElementById('formSection');
    actionsHeader = document.getElementById('actionsHeader');
    languageToggle = document.getElementById('languageToggle');
    languageText = document.getElementById('languageText');
    resetDbBtn = document.getElementById('resetDbBtn');
    loadingIndicator = document.getElementById('loadingIndicator');
}

async function initApp() {
    console.log('🚀 Initializing application...');
    
    // Get DOM elements
    getDOMElements();
    
    // Show loading
    showLoading();
    
    try {
        // Check connection status
        await checkConnection();
        
        // Initialize default admin
        await initializeDefaultAdmin();
        
        // Check for logged in user
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            try {
                currentUser = JSON.parse(loggedInUser);
                console.log('✅ User found in localStorage:', currentUser.email);
                await showApp();
            } catch (e) {
                console.error('❌ Error parsing user data:', e);
                localStorage.removeItem('loggedInUser');
                showAuth();
            }
        } else {
            console.log('ℹ️ No user logged in, showing auth screen');
            showAuth();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Start connection check interval
        setInterval(checkConnection, 30000);
        
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showToast('خطا', 'خطا در راه‌اندازی سیستم', 'error');
        showAuth();
    } finally {
        hideLoading();
    }
}

// ==================== START APPLICATION ====================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export to global scope for debugging
window.app = {
    currentUser,
    phonesDB,
    usersDB,
    isOnline,
    showToast,
    handleLogout,
    resetDatabase,
    syncWithSupabase
};
