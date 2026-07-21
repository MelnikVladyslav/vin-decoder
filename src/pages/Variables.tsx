import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface VehicleVariable {
  ID: number;
  Name: string;
  Description?: string;
}

const Variables: React.FC = () => {
  const [variables, setVariables] = useState<VehicleVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json');
        const data = await response.json();
        
        if (data.Results && Array.isArray(data.Results)) {
          setVariables(data.Results);
        } else {
          setError('Failed to load variables');
        }
      } catch (err) {
        setError('Error fetching variables list');
      } finally {
        setLoading(false);
      }
    };

    fetchVariables();
  }, []);

  if (loading) return <div className="loading">Loading variables...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="variables">
      <h2>All Vehicle Variables</h2>
      <p className="description">List of all possible variables from NHTSA API with their descriptions.</p>
      
      <div className="variables-list">
        {variables.map((variable) => (
          <div key={variable.ID} className="variable-card">
            <Link to={`/variables/${variable.ID}`} className="variable-link">
              <h3>{variable.Name}</h3>
              <div 
                className="description-html"
                dangerouslySetInnerHTML={{ __html: variable.Description || 'No description available' }} 
              />
              <span className="id">ID: {variable.ID}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Variables;
