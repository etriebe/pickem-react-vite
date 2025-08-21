export interface TeamIconProps {
    imagePath: string;
    altText: string;
}

export default function TeamIcon({ imagePath, altText }: TeamIconProps) {
    return (
        <img
            className='teamlogo'
            src={imagePath}
            alt={altText} />
    );
}
