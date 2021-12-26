import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';

const MyRoutes = () => {
    return (
        <HashRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/signin" element={<SignIn />} />
                <Route path="/:username/profile" element={<Profile />} />
            </Routes>
        </HashRouter>
    );
};

export default MyRoutes;
