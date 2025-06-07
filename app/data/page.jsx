"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export default function DataPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          User Information
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border">
            <thead className="bg-blue-100 text-blue-700 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Birthdate</th>
                <th className="p-3 border">First Name</th>
                <th className="p-3 border">Last Name</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">City</th>
                <th className="p-3 border">State</th>
                <th className="p-3 border">Zip</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="even:bg-gray-50 hover:bg-blue-50 transition">
                  <td className="p-3 border">{u.email}</td>
                  <td className="p-3 border">{u.birthdate}</td>
                  <td className="p-3 border">{u.firstName}</td>
                  <td className="p-3 border">{u.lastName}</td>
                  <td className="p-3 border">{u.phone}</td>
                  <td className="p-3 border">
                    {u.addressLine1} {u.addressLine2}
                  </td>
                  <td className="p-3 border">{u.city}</td>
                  <td className="p-3 border">{u.state}</td>
                  <td className="p-3 border">{u.zip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
