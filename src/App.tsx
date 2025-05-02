import { Routes, Route } from 'react-router-dom';
import ListEmployee from './components/ListEmployee'; 
import CreateEmployee from './components/CreateEmployee'; 
import ViewEmployee from './components/ViewEmployee'
import EditEmployee from './components/EditEmployee';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ListEmployee />} />
      
      <Route path="/list" element={<ListEmployee />} />
      <Route path="/create" element={<CreateEmployee />} />
      <Route path="/view/:id" element={<ViewEmployee />} />
      <Route path ="/Edit/:id" element={<EditEmployee/>}/>
    </Routes>
  );
};

export default App;
