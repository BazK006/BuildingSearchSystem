// สคริปต์สำหรับปุ่ม เปิด/ปิด การมองเห็นรหัสผ่าน
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    togglePassword.addEventListener('click', function () {
        // สลับประเภทของ input ระหว่าง password กับ text
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);

        // สลับไอคอนระหว่าง ตาปิด (eye-slash) กับ ตาเปิด (eye)
        if (type === 'password') {
            toggleIcon.classList.remove('bi-eye');
            toggleIcon.classList.add('bi-eye-slash');
        } else {
            toggleIcon.classList.remove('bi-eye-slash');
            toggleIcon.classList.add('bi-eye');
        }
    });
});