import Swal from 'sweetalert2';



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
