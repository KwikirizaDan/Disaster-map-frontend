import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionsCellRenderer = (props) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/disasters/${props.data.id}`);
  };

  const handleEdit = () => {
    navigate(`/disasters/edit/${props.data.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this disaster?')) {
      return;
    }

    try {
      const response = await fetch(`https://disastermap.vercel.app/api/disasters/${props.data.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${props.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete disaster');
      }

      props.api.applyTransaction({ remove: [props.data] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleView} className="text-blue-500 hover:underline">View</button>
      <button onClick={handleEdit} className="text-blue-500 hover:underline">Edit</button>
      <button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button>
    </div>
  );
};

export default ActionsCellRenderer;
