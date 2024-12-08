import React, { useState } from 'react';
import { useAuth } from "../context/authContext";

function InfoSearchAllLivingStudent() {
    const {admin} = useAuth()
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(true); // 控制表格顯示

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8888/api/admin/all_living_student_search?dorm_id=${admin.dorm_id}`
            );
            
            if (!response.ok) {
                throw new Error('Student not found');
            }

            const data = await response.json();
            setStudentData(data); // 包裝成陣列以便渲染
            setError('');
        } catch (err) {
            setStudentData(null);
            setError(err.message || 'An error occurred');
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '800px',
            margin: '20px auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
        },
        formGroup: {
            marginBottom: '15px',
        },
        label: {
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        button: {
            marginTop: '10px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        alert: {
            color: '#721c24',
            backgroundColor: '#f8d7da',
            padding: '10px',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginTop: '10px',
        },
        card: {
            marginTop: '15px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
        },
        tableButton: {
            padding: '8px 12px',
            backgroundColor: '#28a745', // 綠色
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            margin: '10px 0',
            transition: 'background-color 0.3s ease',
        },
        tableButtonHover: {
            backgroundColor: '#218838', // 更深的綠色
        },
    };

    return (
        <div style={styles.container}>
            {admin && <h2>Search All Living Student Information in {admin.dorm_id} </h2>}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Search
                </button>
            </form>

            {error && <div style={styles.alert}>{error}</div>}

            {/* 切換表格顯示狀態的按鈕 */}
            <button
                onClick={() => setShowTable((prev) => !prev)}
                style={styles.tableButton}
            >
                {showTable ? 'Hide Table' : 'Show Table'}
            </button>

            {showTable && studentData && studentData.map(student => (
                <div style={styles.card} key={student.student_id}>
                    <h5>Student Details</h5>
                    <p><strong>Student ID:</strong> {student.student_id}</p>
                    <p><strong>Bed:</strong> {student.b_id}</p>
                    <p><strong>Move in date:</strong> {student.move_in_date}</p>
                    <p><strong>Due date:</strong> {student.due_date}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Contact:</strong> {student.phone}</p>
                </div>
            ))}
        </div>
    );
}

export default InfoSearchAllLivingStudent;
