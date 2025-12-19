interface TalentCardProps {
    name: string;
    prodi: string;
    skills: string[];
    email: string;
    linkedin?: string;
    github?: string;
    onClick?: () => void;
}

const TalentCard = ({ name, prodi, skills, email, linkedin, github, onClick }: TalentCardProps) => {
    return (
        <div style={cardStyle} onClick={onClick} className={onClick ? "clickable" : undefined}>
            <h3>{name}</h3>
            <p>Prodi: {prodi}</p>
            <p>Skills: {skills.join(", ")}</p>
            <div style={{ marginTop: 8 }}>
                <a href={`mailto:${email}`} style={linkStyle}>Email</a>
                {linkedin && <a href={linkedin} style={linkStyle} target="_blank">LinkedIn</a>}
                {github && <a href={github} style={linkStyle} target="_blank">GitHub</a>}
            </div>
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    background: "#fff",
};

const linkStyle: React.CSSProperties = {
    marginRight: 10,
    color: "#2563eb",
    textDecoration: "underline",
    cursor: "pointer",
};

export default TalentCard;
