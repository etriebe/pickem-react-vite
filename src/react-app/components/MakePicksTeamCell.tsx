import { useState, useEffect } from "react";
import TeamIcon from "./TeamIcon";
import { Typography } from "@mui/material";

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
                <TeamIcon imagePath={imagePath} altText={altText} />
                {cellText}
            </div>
        </>);
}
