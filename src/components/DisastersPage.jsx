import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ActionsCellRenderer from './ActionsCellRenderer';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DisastersPage = () => {
  const { isAdmin, isReporter, token } = useAuth();
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef();
  const [searchText, setSearchText] = useState('');

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

  const columnDefs = [
    { field: 'title', sortable: true, filter: true },
    { field: 'type', sortable: true, filter: true },
    { field: 'status', sortable: true, filter: true },
    { field: 'severity', sortable: true, filter: true },
    { field: 'location_name', headerName: 'Location', sortable: true, filter: true },
    { field: 'casualties', sortable: true, filter: true },
    { field: 'damage_estimate', headerName: 'Damage Est.', sortable: true, filter: true },
    { field: 'reported_at', valueFormatter: params => new Date(params.value).toLocaleDateString(), sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        token: token,
      },
      flex: 1,
    },
  ];

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setQuickFilter(searchText);
    }
  }, [searchText]);

  const handleExportCsv = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const handleExportPdf = () => {
    const gridApi = gridRef.current.api;
    const columns = gridApi.getColumnDefs();
    const headers = columns.map(col => col.headerName || col.field).filter(h => h !== 'Actions');
    const body = [];
    gridApi.forEachNodeAfterFilterAndSort(node => {
      const row = headers.map(header => {
        const colId = columns.find(c => (c.headerName || c.field) === header).field;
        return node.data[colId];
      });
      body.push(row);
    });

    const docDefinition = {
      content: [
        { text: 'Disasters Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: Array(headers.length).fill('*'),
            body: [headers, ...body]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('disasters.pdf');
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Disasters</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        {(isAdmin() || isReporter()) && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/disasters/new')}
          >
            Add Disaster
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExportCsv}
        >
          Export to Excel
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExportPdf}
        >
          Export to PDF
        </button>
      </div>
      <div className="ag-theme-alpine-dark" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={disasters}
          columnDefs={columnDefs}
          domLayout='autoHeight'
        />
      </div>
    </div>
  );
};

export default DisastersPage;
