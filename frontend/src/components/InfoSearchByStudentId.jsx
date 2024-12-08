import React, { useState } from 'react';

function InfoSearchByStudentId() {
    const [studentId, setStudentId] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId) {
            setStudentData(null);
            setError('Please enter a student ID to search.');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8888/api/admin/student_search?student_id=${studentId}`
            );
            
            if (!response.ok) {
                throw new Error('Student not found');
            }

            const data = await response.json();
            setStudentData([data]); // 包裝成陣列以便渲染
            setError('');
        } catch (err) {
            setStudentData(null);
            setError(err.message || 'An error occurred');
        }
    };

    const styles = {
        container: {
            padding: '20px',
            width: '600px',
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
    };

    return (
        <div style={styles.container}>
            <h2>Search Student Information by Student ID</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <div style={styles.formGroup}>
                    <label htmlFor="studentId" style={styles.label}>Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        style={styles.input}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                    />
                </div>
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

            {studentData && studentData.map(student => (
                <div style={styles.card} key={student.student_id}>
                    <h5>Student Details</h5>
                    <p><strong>Student ID:</strong> {student.student_id}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Contact:</strong> {student.phone}</p>
                </div>
            ))}
        </div>
    );
}

export default InfoSearchByStudentId;