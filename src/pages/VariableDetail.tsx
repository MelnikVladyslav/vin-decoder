import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface VehicleVariable {
  ID: number;
  Name: string;
  Description?: string;
}

const VariableDetail: React.FC = () => {
  const { variableId } = useParams<{ variableId: string }>();
  const [variable, setVariable] = useState<VehicleVariable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVariable = async () => {
      if (!variableId) return;

      try {
        // Since detail is not directly available, fetch list and find
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json');
        const data = await response.json();
        
        if (data.Results && Array.isArray(data.Results)) {
          const found = data.Results.find((v: any) => v.ID === parseInt(variableId));
          if (found) {
            setVariable(found);
          } else {
            setError('Variable not found');
          }
        }
      } catch (err) {
        setError('Error fetching variable details');
      } finally {
        setLoading(false);
      }
    };

    fetchVariable();
  }, [variableId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!variable) return <div>Variable not found</div>;

  return (
    <div className="variable-detail">
      <Link to="/variables" className="back-link">← Back to Variables</Link>
      
      <h2>{variable.Name}</h2>
      <div className="detail-card">
        <p><strong>ID:</strong> {variable.ID}</p>
        <p><strong>Description:</strong></p>
        <div 
          className="description-html"
          dangerouslySetInnerHTML={{ __html: variable.Description || 'No detailed description available.' }} 
        />
      </div>
    </div>
  );
};

export default VariableDetail;
