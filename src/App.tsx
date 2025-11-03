import './App.css'

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from './NavBar';
import { Title } from './TypeWriteres';
import PageContent from './Pages';

import type { RootState } from './store';
import { open } from './store';

function Cover() {
   const target = useSelector((state: RootState) => state.app.targetPage);
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


function Opener() {
   const target = useSelector((state: RootState) => state.app.targetPage);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const dispatch = useDispatch();

   useEffect(() => {
      if (target === null) return;
      dispatch(open());
   }, [currentPage]);

   return <></>;
}

function App() {
   return (
      <>
         <div className='terminal top-container'>
            <Cover/>
            <NavBar/>
            <Title speed={30}/>
            <PageContent/>
            <Opener/>
         </div>
      </>
   );
}

export default App;
