import './App.css'

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from './NavBar';
import { Title } from './TypeWriteres';
import PageContent from './Pages';
import type { RootState } from './store';
import { open } from './store';

import AnimationStatus from './AnimationStatus';

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
            <NavBar/>
            <div style={{ overflowY: 'auto' }}>
               <Title speed={30}/>
               <PageContent/>
            </div>
            <AnimationStatus/>
            <Opener/>
         </div>
      </>
   );
}

export default App;
