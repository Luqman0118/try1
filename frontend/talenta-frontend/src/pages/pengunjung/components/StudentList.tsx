import React from "react";
import "./StudentList.css";

interface Talent {
    id: number;
    nama_lengkap?: string;
    name?: string;
    prodi: string;
    // other fields are not needed for the table
}

interface StudentListProps {
    talents: Talent[];
}

const StudentList: React.FC<StudentListProps> = ({ talents }) => {
    return (
        <div className="student-list">
            <h2>Daftar Mahasiswa</h2>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Jurusan</th>
                    </tr>
                </thead>
                <tbody>
                    {talents.map(t => (
                        <tr key={t.id}>
                            <td>{t.nama_lengkap ?? t.name ?? ''}</td>
                            <td>{t.prodi}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
