import { useEffect } from "react";

const useLastPath = () => {
    useEffect(() => {
        localStorage.setItem("lastPath", window.location.pathname);
    }, []);
};

export default useLastPath;