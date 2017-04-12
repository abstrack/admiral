import {Address} from "./address";
import {Project} from "./project";

export class Client {
  id: number;
  companyNumber: number;
  name: string;
  phones: string[];
  projects: Project[];
  addresses: Address[];
}
