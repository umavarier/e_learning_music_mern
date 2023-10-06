import axios from "axios";
import { baseUrl } from "./Constants";


const instance= axios.create({
    baseURL:baseUrl,    
})
// export const verifyUserToken = (token) => {
//     return instance.post('/verifyUserToken', { token });
//   };
  


export default instance