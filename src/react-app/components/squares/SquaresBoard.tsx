import { useParams } from "react-router";

type SquaresProps = {
}

function SquaresBoard({ }: SquaresProps) {
    const { leagueId, boardId } = useParams();
    return (
        <div>SquaresBoard - {leagueId} : {boardId}</div>
    )
}

export default SquaresBoard 