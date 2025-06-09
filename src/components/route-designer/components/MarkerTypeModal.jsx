/* eslint-disable */
import React from 'react';

const MARKER_TYPES = [
    {
        id: 'distributionCenter',
        name: 'Distribution Center',
        icon: {
            path: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z",
            fillColor: "#1976d2",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 1.5
        }
    },
    {
        id: 'oilWell',
        name: 'Oil Well',
        icon: {
            path: "M11.8 5c0-1.65 1.35-3 3-3s3 1.35 3 3h2c0-2.76-2.24-5-5-5s-5 2.24-5 5m5 1L6 21h12L7 6h9.8zM3 21h18v2H3v-2z",
            fillColor: "#f44336",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 1.5
        }
    },
    {
        id: 'warehouse',
        name: 'Warehouse',
        icon: {
            path: "M22 21V7L12 3L2 7v14h5v-9h10v9h5zM17 21h-2v-2h2v2zM11 21H9v-2h2v2z",
            fillColor: "#4CAF50",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 1.5
        }
    },
    {
        id: 'factory',
        name: 'Factory',
        icon: {
            path: "M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z",
            fillColor: "#FF9800",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 1.5
        }
    },
    {
        id: 'port',
        name: 'Port',
        icon: {
            path: "M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z",
            fillColor: "#2196F3",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 1.5
        }
    }
];

function MarkerTypeModal({ isOpen, onClose, onSelect, currentType, pointType }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                    Select {pointType === 'start' ? 'Start' : 'End'} Point Marker
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {MARKER_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                currentType === type.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-12 h-12"
                                    style={{
                                        fill: type.icon.fillColor,
                                        stroke: type.icon.strokeColor,
                                        strokeWidth: type.icon.strokeWeight
                                    }}
                                >
                                    <path d={type.icon.path} />
                                </svg>
                                <span className="mt-2 text-sm font-medium">{type.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded button-3d hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MarkerTypeModal;
export { MARKER_TYPES }; 