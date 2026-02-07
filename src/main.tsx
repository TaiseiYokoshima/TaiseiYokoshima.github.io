import './index.css'
import App from './App.tsx'

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, type RootState, type Page, isPage, changePage } from './store';

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <StrictMode>
            <Router>
               <App/>
            </Router>
      </StrictMode>
   </Provider>
);




function Router({children}: { children: React.ReactNode }) {
   const dispatch = useDispatch();
   const currentPage = useSelector((state: RootState) => state.app.currentPage);


   useEffect(() => {
      const endpoints = window.location.pathname.split('/').filter((value) => value !== "");

      if (endpoints.length !== 1) {
         return;
      };

      const pageStr = endpoints[0];

      if (!isPage(pageStr)) {
         return
      };

      const page = pageStr as Page;
      if (page !== currentPage) {
         dispatch(changePage(page));
         return;
      };
   }, [])

   useEffect(() => {
      window.history.pushState(null, "", `/${currentPage}`);
   }, [currentPage])


   return children;
}
