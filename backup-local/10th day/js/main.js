const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
const eyeOffIcon = togglePasswordBtn.querySelector('.eye-off-icon');

const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    eyeIcon.classList.toggle('hidden');
    eyeOffIcon.classList.toggle('hidden');

    togglePasswordBtn.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
    );
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.classList.add('loading');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');

        console.log('Login submitted:', {
            email: document.getElementById('email').value,
            rememberMe: document.getElementById('rememberMe').checked
        });
    }, 2000);
});

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
        }
    });
});

document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Social login clicked:', btn.getAttribute('aria-label'));
    });
});
