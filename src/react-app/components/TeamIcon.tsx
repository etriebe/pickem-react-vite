import { useState, useEffect } from "react";

export interface TeamIconProps {
    imagePath: string;
    altText: string;
}

export default function TeamIcon({ imagePath, altText }: TeamIconProps) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const response = await import(/* @vite-ignore */`${window.location.origin}${imagePath}`) // change relative path to suit your needs
            setImage(response.default)
        }

        fetchImage()
    }, [imagePath])
    return (
        <img
            className='teamlogo'
            src={imagePath}
            alt={altText} />
    );
}
