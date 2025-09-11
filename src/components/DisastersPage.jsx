import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MantineReactTable } from 'mantine-react-table';
import { Button, Box, Flex } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DisastersPage = () => {
  const { isAdmin, isReporter, token } = useAuth();
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/disasters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDisasters(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisasters();
  }, []);

  const handleExport = (rows) => {
    const rowData = rows.map((row) => row.original);
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Disasters');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'disasters.xlsx');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this disaster?')) {
      return;
    }

    try {
      const response = await fetch(`https://disastermap.vercel.app/api/disasters/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete disaster');
      }

      setDisasters(disasters.filter((d) => d.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
      },
      {
        accessorKey: 'location_name',
        header: 'Location',
      },
      {
        accessorKey: 'casualties',
        header: 'Casualties',
      },
      {
        accessorKey: 'damage_estimate',
        header: 'Damage Est.',
      },
      {
        accessorKey: 'reported_at',
        header: 'Reported At',
        cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
    ],
    [],
  );

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full flex flex-col">
       <h1 className="text-2xl font-bold mb-4">Disasters</h1>
       <Box sx={{ overflow: 'auto' }}>
        <MantineReactTable
            columns={columns}
            data={disasters}
            enableRowSelection
            enableColumnOrdering
            enableGlobalFilter={true}
            enableRowActions
            renderRowActions={({ row }) => (
                <Flex gap="md">
                <Button variant="filled" color="blue" onClick={() => navigate(`/disasters/edit/${row.original.id}`)}>Edit</Button>
                <Button variant="filled" color="red" onClick={() => handleDelete(row.original.id)}>Delete</Button>
                </Flex>
            )}
            renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: 'flex', gap: '8px', padding: '8px' }}>
                {(isAdmin() || isReporter()) && (
                <Button color="green" onClick={() => navigate('/disasters/new')} variant="filled">
                Add Disaster
                </Button>
                )}
                <Button
                onClick={() => handleExport(table.getCoreRowModel().rows)}
                variant="filled"
                >
                Export All Data
                </Button>
                <Button
                disabled={table.getSelectedRowModel().rows.length === 0}
                onClick={() => handleExport(table.getSelectedRowModel().rows)}
                variant="filled"
                >
                Export Selected Rows
                </Button>
            </Box>
            )}
            mantineTableProps={{
                sx: {
                    tableLayout: 'fixed',
                    backgroundColor: '#1a1b1e',
                },
                }}
                mantineTheme={{
                colorScheme: 'dark',
                }}
        />
       </Box>
    </div>
  );
};

export default DisastersPage;
