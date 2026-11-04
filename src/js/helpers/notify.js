import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const baseOptions = {
  position: 'topRight',
  timeout: 4000,
  closeOnClick: true,
};

export const notify = {
  success(message, title = 'Success') {
    iziToast.success({ ...baseOptions, title, message });
  },

  error(message, title = 'Error') {
    iziToast.error({ ...baseOptions, title, message });
  },
};
