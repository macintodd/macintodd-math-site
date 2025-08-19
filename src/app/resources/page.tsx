import React from "react";

export default function ResourcesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Teaching Resources</h2>
      <ul className="space-y-4">
        <li>
          <a
            href="https://notes-creator-eight.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Notes Creator App
          </a>
          <p className="text-gray-600 text-sm">
            Create, edit, and format digital worksheets for your classes. Now available at <span className="font-mono">notes-creator-eight.vercel.app</span>.
          </p>
        </li>
        {/* Add more resources here as needed */}
      </ul>
    </div>
  );
}
