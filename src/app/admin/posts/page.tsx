"use client";

import { api } from "~/trpc/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import toast from "react-hot-toast";
import type { AdminPosts, ColDefHelper } from "~/types/types";
import { updatePost } from "~/actions/mutation/mutaiton";

export default function Posts() {
  const [rowData, setRowData] = useState<AdminPosts[]>([]);
  const [colDefs] = useState<ColDefHelper<AdminPosts>>([
    { field: "id", editable: false },
    { field: "title", editable: true },
    { field: "content", editable: true },
    { field: "createdAt" },
    { field: "updatedAt" },
    { headerName: "createdBy", field: "createdBy.name" },
  ] as ColDef<AdminPosts>[]);

  const updateSinglePost = updatePost("Success", "field can't be null");

  const { data, isFetched, isLoading } = api.admin.getAllPosts.useQuery();

  function CellValueChanged(event: CellValueChangedEvent<AdminPosts>) {
    // Ensure the content is a string
    const updatedContent = event.data.content ? String(event.data.content) : "";

    return updateSinglePost.mutate({
      id: event.data.id,
      title: event.data.title,
      content: updatedContent,
      createdAt: event.data.createdAt,
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
