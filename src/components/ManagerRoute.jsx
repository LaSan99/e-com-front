import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ManagerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user && user.role === "manager" ? children : <Navigate to="/" />;
};

export default ManagerRoute;
