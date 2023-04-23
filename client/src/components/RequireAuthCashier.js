import {useLocation, Navigate, Outlet} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireCashierAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.role === "CASHIER" ? <Outlet/> : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireCashierAuth;