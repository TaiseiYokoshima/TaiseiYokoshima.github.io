import { type Dispatch, type SetStateAction} from "react";
import PageController from "../PageController";

type Page = "experience" | "projects" | "education" | "contact" | "about";

interface Props { 
   pageController: PageController, 
   page: Page,
   setPage: Dispatch<SetStateAction<Page>>;
   bringUp: () => void,
}

export { type Page, type Props };
