import InviteUser from "../components/InviteUser.js";

const TeamCard = ({ team }) => {
    return (
        <div className="mb-7" >
            <h3>{team.name}</h3>
            <p><strong>Technology:</strong> {team.technology}</p>
            <p><strong>Members:</strong> 
                {team.members.length}
                {team.members.n}
            </p>

            <InviteUser teamId={team._id} />
        </div>
    );
};

export default TeamCard;
