import './App.css'

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from './NavBar';
import { Title } from './TypeWriteres';
import PageContent from './Pages';

import type { RootState } from './store';
import { open } from './store';

function Cover() {
   const target = useSelector((state: RootState) => state.app.TargetPage);
   const active = target !== null;

   const onClick = () => console.warn("mouse disabled while animation is running");

   return <div  onClick={onClick} style={{
      position: "absolute", 
      left: 0, 
      top: 0, 
      minHeight: "100vh", 
      minWidth: "100vw", 
      backgroundColor: "transparent",
      visibility: `${ active ? "visible" : "hidden" }`,
   }}/>;
}


function App() {

   const target = useSelector((state: RootState) => state.app.TargetPage);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const dispatch = useDispatch();

   useEffect(() => {
      if (target === null) return;
      dispatch(open());
   }, [currentPage]);


   return (
      <>
         <div className='terminal'>
            <Cover/>
            <NavBar/>
            <Title speed={30}/>
            <PageContent/>
         </div>
      </>
   );
}

export default App;
