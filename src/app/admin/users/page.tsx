"use client";

import { api } from "../../../trpc/react"

export default function Posts() {

  const { data } = api.post.getAllUsers.useQuery()

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-transparent">
          <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r-1 border-[#ffffff40]">id</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r-1 border-[#ffffff40]">name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r-1 border-[#ffffff40]">email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r-1 border-[#ffffff40]">image</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r-1 border-[#ffffff40]">role</th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-gray-200">
          {data
            ? data.map((user) => { return (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.image}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.role}</td>
                </tr>
            )})
            : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white" colSpan={2}>Loading...</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

