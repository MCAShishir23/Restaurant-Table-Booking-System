'use client';

import { useState, useEffect } from "react";

export default function BookingsList() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch("http://localhost:2410/getBookings");
      const data = await response.json();
      setBookings(data);
    };

    fetchBookings();
  }, []);

  const handleEdit = (booking: any) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBooking(null);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const form = event.target as HTMLFormElement; // Cast event.target to HTMLFormElement
  
    const updatedBooking = {
      name: form.name.valueOf,
      contact: form.contact.value,
      date: form.date.value,
      time: form.time.value,
      guests: form.guests.value,
    };
  
    try {
      const response = await fetch(`http://localhost:2410/editBooking/${editingBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBooking),
      });
  
      if (response.ok) {
        setBookings(bookings.map(booking =>
          booking.id === editingBooking.id ? { ...booking, ...updatedBooking } : booking
        ));
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error editing booking:", error);
    }
  };
  

  const handleDelete = async (id: number) => {
    // Display confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to delete this booking?");
  
    if (!isConfirmed) {
      // If the user cancels, exit the function
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:2410/deleteBooking/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Update the bookings state to remove the deleted booking
        setBookings(bookings.filter(booking => booking.id !== id));
        alert("Booking deleted successfully!");  // Show a success alert
      } else {
        alert("Failed to delete booking. Please try again.");  // Show error alert if delete failed
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking. Please try again later.");  // Show an error alert if something goes wrong
    }
  };
  

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">All Bookings</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Contact</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Guests</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking: any, index: number) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{booking.name}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.contact}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.time}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.guests}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  onClick={() => handleEdit(booking)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(booking.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Booking</h3>
            <form onSubmit={handleSave}>
            <div className="mb-4">
  <label className="block">Name:</label>
  <input
    type="text"
    name="name"
    defaultValue={editingBooking?.name}
    className="border-2 border-blue-500 p-2 w-full bg-blue-50 text-black"  // Changed color
    placeholder="Enter your name"
  />
</div>
<div className="mb-4">
  <label className="block">Contact:</label>
  <input
    type="text"
    name="contact"
    defaultValue={editingBooking?.contact}
    className="border-2 border-green-500 p-2 w-full bg-green-50 text-black"  // Changed color
    placeholder="Enter your contact number"
  />
</div>
<div className="mb-4">
  <label className="block">Date:</label>
  <input
    type="text"
    name="date"
    defaultValue={editingBooking?.date}
    className="border-2 border-red-500 p-2 w-full bg-red-50 text-black"  // Changed color
    placeholder="Enter booking date"
  />
</div>
<div className="mb-4">
  <label className="block">Time:</label>
  <input
    type="text"
    name="time"
    defaultValue={editingBooking?.time}
    className="border-2 border-purple-500 p-2 w-full bg-purple-50 text-black"  // Changed color
    placeholder="Enter booking time"
  />
</div>
<div className="mb-4">
  <label className="block">Guests:</label>
  <input
    type="number"
    name="guests"
    defaultValue={editingBooking?.guests}
    className="border-2 border-yellow-500 p-2 w-full bg-yellow-50 text-black"  // Changed color
    placeholder="Enter number of guests"
  />
</div>
<div className="flex justify-between">
  <button
    type="button"
    className="px-4 py-2 bg-gray-500 text-white rounded"
    onClick={handleCloseModal}
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-4 py-2 bg-blue-500 text-white rounded"
  >
    Save
  </button>
</div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
