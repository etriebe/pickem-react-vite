import TeamIcon from "./TeamIcon";

export interface MakePicksTeamCellProps {
    imagePath: string;
    altText: string;
    isSmallScreen: boolean;
    cellText: string;
}

export default function MakePicksTeamCell({ imagePath, altText, isSmallScreen, cellText }: MakePicksTeamCellProps) {
    const divClassName = isSmallScreen ? 'teamPickContainerSmall' : 'teamPickContainer';
    return (
        <>
            <div className={divClassName}>
                <TeamIcon imagePath={imagePath} altText={altText} useSmallLogo={isSmallScreen} />
                {cellText}
            </div>
        </>);
}
