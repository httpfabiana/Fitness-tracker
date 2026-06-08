import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/sidebar";
import BottomNav from "../../components/BottomNav/bottonNav";

const Layout = () => {

  return(
   <div className="layout-container">
    <Sidebar/>
     <div className="flex-1 overflow-y-scroll">
      <Outlet/>
     </div>

     <BottomNav/>
   </div>
  )
}

export default Layout;