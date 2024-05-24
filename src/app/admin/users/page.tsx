"use client";

import { api } from "~/trpc/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import toast from "react-hot-toast";
import type { AdminUsers } from "~/types/types";
import { updateUser } from "~/actions/mutation/mutaiton";

export default function Posts() {
  const [rowData, setRowData] = useState<AdminUsers[]>([]);
  const [colDefs] = useState([
    { field: "id", editable: false },
    { field: "name", editable: true },
    { field: "email", editable: true },
    { field: "image", editable: true },
    { field: "role" },
  ] as ColDef<AdminUsers>[]);

  const updateSinglePost = updateUser("Success", "field cann't be null");

  const { data, isFetched, isLoading } = api.admin.getAllUsers.useQuery();

  function CellValueChanged(event: CellValueChangedEvent<AdminUsers>) {
    console.log(event.data);
    return updateSinglePost.mutate({
      id: event.data.id,
      name: event.data.name,
      email: event.data.email,
      image: event.data.image,
      role: event.data.role,
    });
  }

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...");
    }
    if (data) {
      setRowData([...data.flatMap((page) => page)]);
      toast.dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

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
