/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { GetAllSuppliers, GetProjectsByStatus } from '../../../api/worksideAPI';

const RouteModals = ({
  isSaveModalOpen,
  isLoadModalOpen,
  onClose,
  routeName,
  setRouteName,
  routeDescription,
  setRouteDescription,
  supplierName,
  setSupplierName,
  projectName,
  setProjectName,
  originator,
  setOriginator,
  onSave,
  savedRoutes,
  onLoad,
  onDelete
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Fetch suppliers when save modal opens
  useEffect(() => {
    if (isSaveModalOpen) {
      const fetchSuppliers = async () => {
        setLoadingSuppliers(true);
        try {
          const response = await GetAllSuppliers();
          if (response.status === 200 && response.data) {
            setSuppliers(response.data);
          } else {
            console.error('Failed to fetch suppliers:', response);
            setSuppliers([]);
          }
        } catch (error) {
          console.error('Error fetching suppliers:', error);
          setSuppliers([]);
        } finally {
          setLoadingSuppliers(false);
        }
      };

      fetchSuppliers();
    }
  }, [isSaveModalOpen]);

  // Fetch projects when save modal opens
  useEffect(() => {
    if (isSaveModalOpen) {
      const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
          // Using hardcoded values for testing as requested
          const response = await GetProjectsByStatus("ACTIVE", "CRC");
          if (response.status === 200 && response.data) {
            setProjects(response.data);
          } else {
            console.error('Failed to fetch projects:', response);
            setProjects([]);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        } finally {
          setLoadingProjects(false);
        }
      };

      fetchProjects();
    }
  }, [isSaveModalOpen]);

  return (
    <>
      {/* Save Route Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Save Route</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="routeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Route Name *
                </label>
                <input
                  id="routeName"
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Enter route name"
                  required
                />
              </div>
              <div>
                <label htmlFor="routeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="routeDescription"
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Enter route description"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <select
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="border p-2 w-full rounded bg-white"
                  disabled={loadingSuppliers}
                >
                  <option value="">
                    {loadingSuppliers ? 'Loading suppliers...' : 'Select a supplier'}
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <select
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="border p-2 w-full rounded bg-white"
                  disabled={loadingProjects}
                >
                  <option value="">
                    {loadingProjects ? 'Loading projects...' : 'Select a project'}
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project.projectname}>
                      {project.projectname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="originator" className="block text-sm font-medium text-gray-700 mb-1">
                  Originator
                </label>
                <input
                  id="originator"
                  type="text"
                  value={originator}
                  onChange={(e) => setOriginator(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Enter originator name"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!routeName}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Route Modal */}
      {isLoadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Load Route</h2>
            <div className="space-y-4">
              {savedRoutes.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {savedRoutes.map((route) => (
                    <div key={route._id} className="border rounded p-4 mb-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Route Name - First and most prominent */}
                          <h3 className="font-bold text-lg text-green-600 mb-2">
                            {route.routeName || route.name || 'Unnamed Route'}
                          </h3>
                          
                          {/* Route Description - Second */}
                          {(route.routeDescription || route.description) && (
                            <p className="text-sm text-gray-700 mb-3 italic">
                              {route.routeDescription || route.description}
                            </p>
                          )}
                          
                          {/* Other details - Third */}
                          <div className="text-sm text-gray-500 space-y-1">
                            <p><span className="font-medium">Supplier:</span> {route.supplierName || 'N/A'}</p>
                            <p><span className="font-medium">Project:</span> {route.projectName || 'N/A'}</p>
                            <p><span className="font-medium">Originator:</span> {route.originator || 'N/A'}</p>
                            
                            {/* Additional route info */}
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-400">
                                Waypoints: {route.selectedWaypoints?.length || 0} | 
                                Avoidance Zones: {route.avoidanceZones?.length || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            type="button"
                            onClick={() => onLoad(route)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(route._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No saved routes found</p>
              )}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RouteModals; 