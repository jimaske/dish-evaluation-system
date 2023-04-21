import { createStore } from "vuex";
import match from "./match.js"
import user from "./user.js"
const store = createStore({
  modules:{
	  match,
	  user
  }
});
export default store;