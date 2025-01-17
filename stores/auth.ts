// store/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref({
    id: null,
    uuid: '',
    email: '',
    firstname: '',
    lastname: '',
    role: '',
  });

  const router = useRouter();

  const initializeAuth = () => {
    const savedUser = Cookies.get('user');
    const token = Cookies.get('token');

    if (savedUser) {
      isAuthenticated.value = true;
      user.value = JSON.parse(savedUser);
    }
  };

  async function login (userData) {
    try {
      if (!userData || !userData.token) {
        console.error('Invalid login data:', userData)
        throw new Error('Invalid login response')
      }

      if (userData.user.status === "รอยืนยัน") {
        Swal.fire({
          title: 'การเข้าถึงถูกปฏิเสธ',
          text: 'สถานะของคุณคือ "รอยืนยัน" กรุณารอการยืนยันจากผู้ดูแล',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        })
        return false;
      }

      isAuthenticated.value = true;

      console.log('userDataAuth : ', userData)

      user.value = {
        email: userData.user.email,
        id: userData.user.id,
        firstname: userData.user.firstname,
        lastname: userData.user.lastname,
        role: userData.user.role,
        uuid: userData.user.uuid
      };

      Cookies.set('user', JSON.stringify(user.value), { expires: 7 });
      Cookies.set('token', userData.token, { expires: 7 });

      Swal.fire({
        title: 'เข้าสู่ระบบสำเร็จ',
        text: 'ยินดีต้อนรับ, ' + userData.user.firstname + ' ' + userData.user.lastname,
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });

      if (userData.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.log('error', error)
    }
  };

  const logout = async () => {
    isAuthenticated.value = false;
    user.value = {
      id: null,
      email: '',
      firstname: '',
      lastname: '',
      role: '',
      uuid: '',
    };

    Cookies.remove('user');
    Cookies.remove('token');

    router.push('/');

    await Swal.fire('ออกจากระบบสำเร็จ', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 'success');
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    initializeAuth,
  };
});