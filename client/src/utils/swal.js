import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: false,
    position: 'center',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    background: '#111827',
    color: '#fff',
    customClass: {
        popup: 'glass-swal',
        confirmButton: 'swal-confirm-btn',
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export const showAlert = (title, text, icon = 'success') => {
    Swal.fire({
        title,
        text,
        icon,
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        customClass: {
            popup: 'rounded-2xl border border-white/10 backdrop-blur-xl',
        }
    });
};

export default showAlert;
