import React, {useEffect} from "react";

export function useOutsideClick<T extends HTMLElement, V extends HTMLElement>(
    ref: React.RefObject<T | null>,
    btnRef: React.RefObject<V | null>,
    callback: () => void
) {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!ref.current || !btnRef.current) return;
            if (!ref.current.contains(event.target as Node) && !btnRef.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, btnRef, callback]);
}