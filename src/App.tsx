import './App.css'
import { Title, Div, createReffedDefferedPromise } from "./TypeWriteres";
import { useRef } from 'react';

import { Controller, Registry } from './TypeWriteres';

function useSignal<T>() {
   const { promise, resolver } = createReffedDefferedPromise<T>();
   const signal = useRef(promise);
   const signaler = useRef(resolver);
   return { signal, signaler };
}

function App() {
   const title_controller = useRef(new Controller());
   const divs_registry = useRef(new Registry());

   const open = async () => {
      // console.log("open title");
      // await title_controller.current.open();
      // console.log("title opened")

      console.log("open divs");
      await divs_registry.current.open();
      console.log("divs opened")
   };

   const close = async () => {
      console.log("close divs");
      await divs_registry.current.close();
      console.log("divs closed")
   };


   return (
      <>
         <div id='terminal-window'>

            {/* <Title controller={title_controller}> this is the title</Title> */}
            <Div registry={divs_registry} speed={35}> this is the first text I want. I am trying out</Div>
            <Div registry={divs_registry}> this is the second text I want </Div>

            <button onClick={open}> open </button>
            <button onClick={close}> close </button>

         </div>
      </>

   )
}

export default App
