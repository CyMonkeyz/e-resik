// app/pages/pengelola/JadwalPenjemputan.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { useApp, type Request } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import Button from '../../components/Button';
import { 
  IoCalendar, 
  IoChevronBack, 
  IoChevronForward, 
  IoToday, 
  IoPerson, 
  IoCall, 
  IoHome, 
  IoTime, 
  IoInformationCircleOutline 
} from 'react-icons/io5';

export default function JadwalPenjemputan() {
  const { requests } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pickupRequests = useMemo(() => 
    requests.filter(r => r.type === 'pickup' && (r.status === 'confirmed' || r.status === 'in_progress' || r.status === 'pending'))
  , [requests]);

  const requestsByDate = useMemo(() => {
    const grouped: { [key: string]: Request[] } = {};
    pickupRequests.forEach(req => {
      const dateKey = new Date(req.scheduledDate).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(req);
    });
    return grouped;
  }, [pickupRequests]);

  const selectedDayRequests = selectedDate ? requestsByDate[selectedDate.toDateString()] || [] : [];

  const handleOpenModal = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Calendar rendering logic
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border border-gray-200 rounded-md"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toDateString();
    const hasRequests = requestsByDate[dateKey] && requestsByDate[dateKey].length > 0;
    const isSelected = selectedDate?.toDateString() === dateKey;
    const isToday = new Date().toDateString() === dateKey;

    calendarDays.push(
      <div
        key={day}
        onClick={() => setSelectedDate(date)}
        className={`p-2 border rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-600 text-white' : 
          isToday ? 'bg-blue-100 text-blue-800' : 
          'border-gray-200 hover:bg-gray-100'
        }`}
      >
        <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{day}</div>
        {hasRequests && (
          <div className={`mt-1 text-xs flex items-center ${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>
            {requestsByDate[dateKey].length} Penjemputan
          </div>
        )}
      </div>
    );
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navbar />
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Jadwal Penjemputan</h1>
          <p className="text-gray-600 mt-2">
            Lihat dan kelola jadwal penjemputan sampah dari warga.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentDate(new Date())} className="p-2 hover:bg-gray-100 rounded-full"><IoToday /></button>
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><IoChevronBack /></button>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><IoChevronForward /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
              <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays}
            </div>
          </motion.div>

          {/* Scheduled Pickups for Selected Day */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Jadwal untuk {selectedDate ? selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Pilih Tanggal'}
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedDayRequests.length > 0 ? (
                selectedDayRequests.map(req => (
                  <motion.div
                    key={req.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOpenModal(req)}
                    className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{req.userName}</p>
                        <p className="text-sm text-gray-600">{req.wasteType} - {req.estimatedWeight}kg</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-blue-600 font-medium mt-2">Jam: {req.scheduledTime}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <IoCalendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p>Tidak ada jadwal penjemputan pada tanggal ini.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Penjemputan">
        {selectedRequest && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedRequest.userName}</h3>
                <p className="text-gray-600">ID Permintaan: #REQ-{selectedRequest.id}</p>
              </div>
              <StatusBadge status={selectedRequest.status} size="md"/>
            </div>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center"><IoPerson className="mr-3 text-gray-500"/> {selectedRequest.userName}</p>
              <p className="flex items-center"><IoHome className="mr-3 text-gray-500"/> {selectedRequest.userAddress}</p>
              <p className="flex items-center"><IoCall className="mr-3 text-gray-500"/> {selectedRequest.userPhone}</p>
              <hr className="my-2"/>
              <p className="flex items-center"><IoCalendar className="mr-3 text-gray-500"/> {new Date(selectedRequest.scheduledDate).toLocaleDateString('id-ID')}</p>
              <p className="flex items-center"><IoTime className="mr-3 text-gray-500"/> {selectedRequest.scheduledTime}</p>
              <p className="flex items-center"><IoInformationCircleOutline className="mr-3 text-gray-500"/> Catatan: {selectedRequest.notes || "-"}</p>
            </div>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(false)} className="w-full">Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
