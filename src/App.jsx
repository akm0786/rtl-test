import { Provider } from "react-redux";
import {store} from './store'
import UsersList from "./components/UserList";

function App() {
  return  (
    <Provider store={store}>
      <h1> React components API Practice</h1>
      <UsersList/>

    </Provider>
  )
}

export default App