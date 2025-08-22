import React, { useState, useEffect } from 'react';

interface BookingFormProps {
  turf: any;
  initialDate?: string;
  onConfirmBooking: (bookingData: any) => Promise<any>;
  checkAvailability: (turfId: number, date: string, timeSlot: string) => Promise<boolean>;
  loading: boolean;
  user: any;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  turf,
  initialDate,
  onConfirmBooking,
  checkAvailability,
  loading,
  user,
  onClose
}) => {
  const [bookingData, setBookingData] = useState({
    date: initialDate || '',
    startTime: '',
    endTime: '',
    duration: 1,
    totalAmount: 0,
    notes: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    if (bookingData.date) {
      checkSlotsAvailability();
    }
  }, [bookingData.date]);

  useEffect(() => {
    calculateTotal();
  }, [bookingData.startTime, bookingData.duration]);

  const checkSlotsAvailability = async () => {
    if (!bookingData.date) return;
    
    setCheckingAvailability(true);
    const available: string[] = [];
    
    for (const slot of timeSlots) {
      try {
        const isAvailable = await checkAvailability(turf.id, bookingData.date, slot);
        if (isAvailable) {
          available.push(slot);
        }
      } catch (err) {
        // If check fails, assume available
        available.push(slot);
      }
    }
    
    setAvailableSlots(available);
    setCheckingAvailability(false);
  };

  const calculateTotal = () => {
    if (bookingData.startTime && bookingData.duration) {
      const hourlyRate = turf.hourly_rate || parseInt(turf.price?.replace('৳', '').replace('/hour', '')) || 500;
      const total = hourlyRate * bookingData.duration;
      setBookingData(prev => ({ ...prev, totalAmount: total }));
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!bookingData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot book for past dates';
      }
    }
    
    if (!bookingData.startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    
    if (!bookingData.duration || bookingData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 hour';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!user) {
      alert('Please log in to make a booking');
      return;
    }

    try {
      const endTime = calculateEndTime(bookingData.startTime, bookingData.duration);
      
      const booking = {
        turf_id: turf.id,
        booking_date: bookingData.date,
        start_time: bookingData.startTime,
        end_time: endTime,
        total_amount: bookingData.totalAmount,
        notes: bookingData.notes
      };

      await onConfirmBooking(booking);
      setBookingSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Booking failed' });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (bookingSuccess) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-check-circle text-6xl text-emerald-400 mb-4"></i>
        <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">Booking Confirmed!</h3>
        <p className="text-gray-300 mb-4">
          Your booking for {turf.name} has been successfully created.
        </p>
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Date:</strong> {bookingData.date}</p>
            <p><strong>Time:</strong> {bookingData.startTime} - {calculateEndTime(bookingData.startTime, bookingData.duration)}</p>
            <p><strong>Duration:</strong> {bookingData.duration} hour(s)</p>
            <p><strong>Total:</strong> <span className="text-emerald-400">৳{bookingData.totalAmount}</span></p>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Closing automatically...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {errors.submit}
        </div>
      )}

      {/* Turf Info */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">{turf.name}</h3>
        <p className="text-gray-300 text-sm">{turf.location}</p>
        <p className="text-emerald-400 font-bold">৳{turf.hourly_rate || turf.price?.replace('৳', '').replace('/hour', '') || '500'}/hour</p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={bookingData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full bg-gray-700 border ${errors.date ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
        />
        {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Start Time <span className="text-red-400">*</span>
        </label>
        {checkingAvailability ? (
          <div className="text-center py-4">
            <div className="spinner mb-2"></div>
            <p className="text-gray-400 text-sm">Checking availability...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const isAvailable = availableSlots.includes(time);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleInputChange('startTime', time)}
                  disabled={!isAvailable}
                  className={`py-2 px-3 rounded text-sm transition-all duration-300 ${
                    bookingData.startTime === time
                      ? 'bg-emerald-600 text-white'
                      : isAvailable
                      ? 'bg-gray-700 hover:bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {time}
                  {!isAvailable && <i className="fas fa-lock ml-1 text-xs"></i>}
                </button>
              );
            })}
          </div>
        )}
        {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Duration (hours) <span className="text-red-400">*</span>
        </label>
        <select
          value={bookingData.duration}
          onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
          className={`w-full bg-gray-700 border ${errors.duration ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
        >
          <option value="">Select duration</option>
          {[1, 2, 3, 4, 5, 6].map(hours => (
            <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
          ))}
        </select>
        {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
        <textarea
          value={bookingData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
          rows={3}
          placeholder="Any special requirements or notes..."
        />
      </div>

      {/* Booking Summary */}
      {bookingData.startTime && bookingData.duration && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Date:</span>
              <span className="text-white">{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Time:</span>
              <span className="text-white">
                {bookingData.startTime} - {calculateEndTime(bookingData.startTime, bookingData.duration)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Duration:</span>
              <span className="text-white">{bookingData.duration} hour(s)</span>
            </div>
            <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
              <span className="text-gray-300 font-semibold">Total Amount:</span>
              <span className="text-emerald-400 font-bold text-lg">৳{bookingData.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !bookingData.startTime || !bookingData.duration}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Processing Booking...
          </>
        ) : (
          <>
            <i className="fas fa-credit-card mr-2"></i>
            Confirm Booking - ৳{bookingData.totalAmount}
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;