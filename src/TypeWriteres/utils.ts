import React from "react";

function clear_interval(interval: number) {
   console.log(`clearing internval: ${interval}`);
   clearInterval(interval);
};

interface TyperProps {
   children: String;
   speed?: number;
   promises?: React.RefObject<Promise<void>[]>;
   resolver?: React.RefObject<Resolver<void>>;
   signal?: React.RefObject<Promise<void>>;
   onComplete?: () => void;
}

type Resolver<T> = (value: T | PromiseLike<T>) => void;

function createReffedDefferedPromise<T>() : { promise: Promise<T>, resolver: Resolver<T> } {
   let resolver!: Resolver<T>;
   const promise = new Promise<T>((res) => { resolver = res });
   return { promise, resolver };
}

export { type TyperProps, clear_interval, type Resolver, createReffedDefferedPromise };
