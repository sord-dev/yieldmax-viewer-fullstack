import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useBreadCrumb = (): string[] => {
    const [activePage, setActivePage] = useState<string>('')
    const { pathname } = useLocation()

    useEffect(() => { setActivePage(pathname); }, [pathname])

    const pathSegments = activePage.split('/').filter(segment => segment !== '');
    
    const breadcrumb = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return { name: segment, path };
    });

    // capitalize the first letter of each segment
    return breadcrumb.map(item => item.name.charAt(0).toUpperCase() + item.name.slice(1));
}