"use client";

import { api } from "~/trpc/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import toast from "react-hot-toast";
import type { AdminUsers } from "~/types/types";
import { showError, showLoading } from "~/utils/utils";

export default function Posts() {
  const [rowData, setRowData] = useState<AdminUsers[]>([]);
  const [colDefs] = useState([
    { field: "id", editable: false },
    { field: "name", editable: true },
    { field: "subname", editable: true },
    { field: "email", editable: true },
    { field: "description", editable: true },
    { field: "role", editable: true },
    { field: "image", editable: true },
    { field: "likedPosts", editable: false },
  ] as ColDef<AdminUsers>[]);

  const updateSingleUser = api.admin.updateSingleUser.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data, isFetching } = api.admin.getAllUsers.useQuery();

  function CellValueChanged(event: CellValueChangedEvent<AdminUsers>) {
    const { id, name, subname, email, description, role, image } = event.data;

    if (!subname) {
      return showError("subname cannot be empty");
    }

    return updateSingleUser.mutate({
      id,
      name,
      subname,
      email,
      description,
      role,
      image,
    });
  }

  useEffect(() => {
    if (isFetching) {
      showLoading("Fetching users...");
    }
    if (data) {
      setRowData([...data.flatMap((page) => page)]);
      toast.dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          cacheBlockSize={10}
          columnDefs={colDefs}
          paginationPageSizeSelector={[10, 15, 20, 50, 100, 200]}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            editable: true,
            resizable: true,
            sortable: true,
          }}
          onCellValueChanged={(event) => {
            CellValueChanged(event);
          }}
        />
      </div>
    </div>
  );
}
