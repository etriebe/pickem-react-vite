export interface TeamIconProps {
    imagePath: string;
    altText: string;
    useSmallLogo: boolean;
}

export default function TeamIcon({ imagePath, altText, useSmallLogo }: TeamIconProps) {
    const logoClass = useSmallLogo ? 'teamlogoSmallScreen' : 'teamlogo';
    return (
        <img
            className={logoClass}
            src={imagePath}
            alt={altText} />
    );
}
