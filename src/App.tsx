import './App.css'
import { Title, Div, createReffedDefferedPromise } from "./TypeWriteres";
import { useRef } from 'react';

function useSignal<T>() {
   const { promise, resolver } = createReffedDefferedPromise<T>();
   const signal = useRef(promise);
   const signaler = useRef(resolver);
   return { signal, signaler };
}

function App() {
   const { signal: divsSignalRef, signaler: divsSignalerRef } = useSignal<void>();

   const divsPromises = new Array<Promise<void>>();
   const divsPromisesRef = useRef(divsPromises);


   // titile
   const { promise: titleSignal, resolver: titleSignaler } = createReffedDefferedPromise<void>();
   const titleSignalRef = useRef(titleSignal);
   const titleSignalerRef = useRef(titleSignaler);

   const { promise: titlePromise, resolver: titleResolver } = createReffedDefferedPromise<void>();
   const titlePromiseRef = useRef(titlePromise);
   const titleResolverRef = useRef(titleResolver);


   const onClick = async () => {
      console.log("signaling title to start animation");
      titleSignalerRef.current();

      console.log("awaiting title animation to finish...")
      await titlePromiseRef.current;
      console.log("title animation finished");

      console.log("signaling divs to start animation");
      divsSignalerRef.current();

      console.log("awaiting divs animation to finish...")
      await Promise.all(divsPromisesRef.current);
      console.log("divs animation finished");
   };


   return (
      <>
         <div id='terminal-window'>

            <Title signal={titleSignalRef} resolver={titleResolverRef}> this is the title </Title>

            <Div signal={divsSignalRef} promises={divsPromisesRef} speed={100}> this is the first text I want </Div>
            <Div signal={divsSignalRef} promises={divsPromisesRef}> this is the second text I want </Div>

            <button onClick={onClick}> press me </button>

         </div>
      </>

   )
}

export default App
