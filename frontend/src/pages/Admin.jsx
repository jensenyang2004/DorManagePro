import React from 'react';
import AdminNavbar from '../components/AdminNavBar';
import InfoSearchByStudentId from '../components/InfoSearchByStudentId';
import InfoSearchByRoomNumber from '../components/InfoSearchByRoomNumber';
import SnackAnnouncement from '../components/SnackAnnouncement';
import DormTransferRequestSearch from '../components/DormTransferRequestSearch';
import SnackReservationStatus from '../components/SnackReservationStatus';
import MaintenanceStatus from '../components/MaintenanceStatusSearch';

function Admin() {

    return (
        <div>
            <AdminNavbar />
            <div>
                <InfoSearchByStudentId />
                <InfoSearchByRoomNumber />
                <SnackAnnouncement />
                <DormTransferRequestSearch />
                <SnackReservationStatus />
                <MaintenanceStatus/>
            </div>
        </div>
    );
}

export default Admin;
