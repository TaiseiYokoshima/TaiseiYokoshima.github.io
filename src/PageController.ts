import { Controller, Registry } from "./TypeWriteres";


const debug = false;

export default class PageController {
   private title: Controller;
   private headers: Registry;
   private contents: Registry;

   constructor(title: Controller, headers: Registry, contents: Registry) {
      this.title = title;
      this.headers = headers;
      this.contents = contents;
   }

   async close() {
      let x = this.title.close();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await x;
      await this.headers.close();
      await this.contents.close();
   }

   async open() {
      await this.title.open();
      if (debug) console.log("title opened");
      await this.headers.open();
      if (debug) console.log("headers opened");
      await this.contents.open();
      if (debug) console.log("contents opened");
   }
}
