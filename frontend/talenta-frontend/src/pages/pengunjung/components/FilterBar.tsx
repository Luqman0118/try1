interface FilterBarProps {
    search: string;
    setSearch: (value: string) => void;
    filterProdi: string;
    setFilterProdi: (value: string) => void;
    filterSkill: string;
    setFilterSkill: (value: string) => void;
}

const FilterBar = ({ search, setSearch, filterProdi, setFilterProdi, filterSkill, setFilterSkill }: FilterBarProps) => {
    return (
        <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
                type="text"
                placeholder="Cari nama"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="Filter prodi"
                value={filterProdi}
                onChange={(e) => setFilterProdi(e.target.value)}
                style={inputStyle}
            />
            <input
                type="text"
                placeholder="Filter skill"
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
};

export default FilterBar;
