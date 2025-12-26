import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageHelper } from '@/helper/storageHelper';
import { PAGES } from '@/constants/PagesName';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDataFromLocalStorage } from '@/lib/globalSlice';


const useAuthRedirect = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=> state.global);
  useEffect(()  => {

    console.log("login data called")
    const isLoggedIn =  localStorageHelper.getItem('login_data');
    
    if(!userData)
    {
      dispatch(setUserDataFromLocalStorage(isLoggedIn));
    }
      

    console.log("login data", isLoggedIn)

    if (!isLoggedIn) {
        router.push(PAGES.LOGIN, { replace: true });
      }
      


}, [router]);
};

export default useAuthRedirect;
