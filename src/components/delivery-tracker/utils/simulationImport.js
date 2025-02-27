export const importSimulationResults = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate imported data structure
        if (!data.timestamp || !data.params || !data.metrics || !data.analysis) {
          throw new Error('Invalid simulation data format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse simulation data'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}; 