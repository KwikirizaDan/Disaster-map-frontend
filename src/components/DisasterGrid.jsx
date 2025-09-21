import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import $ from "jquery";

// Core DataTables
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";

// Buttons extension
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";

// Excel export requires JSZip
import JSZip from "jszip";
window.JSZip = JSZip;

const DisasterGrid = () => {
  const navigate = useNavigate();
  const { getAuthHeaders, isAuthenticated, logout } = useAuth();
  const tableRef = useRef(null);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
    }

    const table = $(tableRef.current).DataTable({
      dom:
        "<'flex justify-between items-center mb-4'<'flex items-center'B><'ml-auto'f>>" +
        "t" +
        "<'flex justify-between items-center mt-4'ip>",
      buttons: [
        {
          extend: "csvHtml5",
          text: "CSV",
          className:
            "flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 mr-2 transition",
        },
        {
          extend: "excelHtml5",
          text: "Excel",
          className:
            "flex items-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition",
        },
      ],
      language: {
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        infoFiltered: "(filtered from _MAX_ total entries)",
        lengthMenu: "",
        search: "_INPUT_",
        searchPlaceholder: "Search disasters...",
        paginate: {
          first: '<span class="material-symbols-outlined">first_page</span>',
          previous:
            '<span class="material-symbols-outlined">chevron_left</span>',
          next: '<span class="material-symbols-outlined">chevron_right</span>',
          last: '<span class="material-symbols-outlined">last_page</span>',
        },
      },
      ajax: {
        url: "http://127.0.0.1:5000/api/disasters",
        type: "GET",
        dataSrc: "",
        beforeSend: function (xhr) {
          const headers = getAuthHeaders();
          for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
          }
        },
        error: function (xhr) {
          if (xhr.status === 401) {
            localStorage.removeItem("authToken");
            logout();
            navigate("/login");
          }
        },
      },
      columns: [
        {
          title: "Title",
          data: "title",
          render: function (data) {
            return `<div class="flex items-center">
              <span class="material-symbols-outlined mr-2 text-gray-500">title</span>
              ${data}
            </div>`;
          },
        },
        {
          title: "Location",
          data: "location_name",
          render: function (data) {
            return `<div class="flex items-center">
              <span class="material-symbols-outlined mr-2 text-gray-500">location_on</span>
              ${data}
            </div>`;
          },
        },
        {
          title: "Date",
          data: "updated_at",
          render: function (data) {
            return `<div class="flex items-center">
              <span class="material-symbols-outlined mr-2 text-gray-500">event</span>
              ${new Date(data).toLocaleDateString()}
            </div>`;
          },
        },
        {
          title: "Type",
          data: "type",
          render: function (data) {
            return data
              ? `<div class="flex items-center">
              <span class="material-symbols-outlined mr-2 text-gray-500">category</span>
              ${data.charAt(0).toUpperCase() + data.slice(1)}
            </div>`
              : "";
          },
        },
        {
          title: "Severity",
          data: "severity",
          render: function (data) {
            if (!data) return "";
            const severityMap = {
              low: "Low",
              medium: "Medium",
              high: "High",
              critical: "Critical",
            };
            const severityClass = {
              low: "bg-blue-100 text-blue-800",
              medium: "bg-yellow-100 text-yellow-800",
              high: "bg-orange-100 text-orange-800",
              critical: "bg-red-100 text-red-800",
            };
            return `<span class="px-2 py-1 text-xs font-medium rounded-full ${
              severityClass[data] || "bg-gray-100 text-gray-800"
            }">${severityMap[data] || data}</span>`;
          },
        },
        {
          title: "Status",
          data: "status",
          render: function (data) {
            if (!data) return "";
            const statusMap = {
              reported: "Reported",
              in_progress: "In Progress",
              resolved: "Resolved",
            };
            const statusClass = {
              reported: "bg-yellow-100 text-yellow-800",
              in_progress: "bg-blue-100 text-blue-800",
              resolved: "bg-green-100 text-green-800",
            };
            return `<span class="px-2 py-1 text-xs font-medium rounded-full ${
              statusClass[data] || "bg-gray-100 text-gray-800"
            }">${statusMap[data] || data}</span>`;
          },
        },
        {
          title: "Actions",
          data: "id",
          orderable: false,
          render: function (data) {
            return `
              <div class="flex space-x-2">
                <button class="view-btn px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition flex items-center" data-id="${data}">
                  <span class="material-symbols-outlined mr-1 text-sm">visibility</span>
                  View
                </button>
                <button class="edit-btn px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition flex items-center" data-id="${data}">
                  <span class="material-symbols-outlined mr-1 text-sm">edit</span>
                  Edit
                </button>
                <button class="delete-btn px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition flex items-center" data-id="${data}">
                  <span class="material-symbols-outlined mr-1 text-sm">delete</span>
                  Delete
                </button>
              </div>
            `;
          },
        },
      ],
      pageLength: 10,
      destroy: true,
      createdRow: function (row, data, dataIndex) {
        if (dataIndex % 2 === 0) {
          $(row).addClass("bg-gray-50");
        }
      },
      initComplete: function () {
        $(".dataTables_length").remove();
        const searchInput = $(".dataTables_filter input");
        searchInput.addClass(
          "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        );
        $(".dataTables_filter").addClass("relative");
        searchInput.addClass("pr-10");
        $(".dataTables_filter").append(
          '<span class="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">search</span>'
        );

        $(tableRef.current).on("click", ".view-btn", function () {
          const id = $(this).data("id");
          navigate(`/disasters/details/${id}`);
        });

        $(tableRef.current).on("click", ".edit-btn", function () {
          const id = $(this).data("id");
          navigate(`/disasters/edit/${id}`);
        });

        $(tableRef.current).on("click", ".delete-btn", function () {
          const id = $(this).data("id");
          setDeleteId(id);
          setShowDeleteModal(true);
        });
      },
    });

    return () => {
      table.destroy();
    };
  }, [isAuthenticated, getAuthHeaders, navigate, logout]);

  const handleReportDisaster = () => navigate("/disasters/new");

  const handleDeleteConfirmed = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(
        `http://127.0.0.1:5000/api/disasters/${deleteId}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (response.ok) {
        toast.success("Disaster deleted successfully!");
        $(tableRef.current).DataTable().ajax.reload();
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        logout();
        navigate("/login");
      } else {
        throw new Error("Failed to delete disaster");
      }
    } catch (error) {
      console.error("Error deleting disaster:", error);
      toast.error("Failed to delete disaster");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Disaster Data</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReportDisaster}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-blue-600 text-white text-sm font-bold shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              <span className="material-symbols-outlined text-base mr-1">add</span>
              Report Disaster
            </button>
          </div>
        </div>

        <table
          ref={tableRef}
          className="display stripe hover w-full rounded-lg"
          style={{ width: "100%" }}
        ></table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this disaster?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterGrid;
