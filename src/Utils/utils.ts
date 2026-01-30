function clear_interval(interval: number) {
   // console.log(`clearing internval: ${interval}`);
   clearInterval(interval);
};


type Resolver<T> = (value: T | PromiseLike<T>) => void;

function createDeferredPromise<T>() : { promise: Promise<T>, resolver: Resolver<T> } {
   let resolver!: Resolver<T>;
   const promise = new Promise<T>((res) => { resolver = res });
   return { promise, resolver };
}

export {  clear_interval, type Resolver, createDeferredPromise };
