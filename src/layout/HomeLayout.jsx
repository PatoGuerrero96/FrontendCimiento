import { Outlet } from 'react-router-dom'
import HeaderPublico from "../components/HeaderPublico"
import FooterPublico from "../components/FooterPublico"
const HomeLayout = () => {

  return (
    <>
  <HeaderPublico/>
    <Outlet />
    <FooterPublico/>
    
    </>
  );
};

export default HomeLayout;