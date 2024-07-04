"use client";

import { api } from "~/trpc/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useState } from "react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import type { AdminPosts, ColDefHelper } from "~/types/types";
import type { JSONContent } from "@tiptap/react";
import { showError, showLoading, showSuccess } from "~/utils/utils";
import toast from "react-hot-toast";

export default function Posts() {
  const [rowData, setRowData] = useState<AdminPosts[]>([]);
  const [colDefs] = useState<ColDefHelper<AdminPosts>>([
    { field: "id", editable: false },
    { field: "title", editable: true },
    { field: "content", editable: true },
    { field: "perviewSrc", editable: true },
    { field: "createdAt", editable: false },
    { field: "updatedAt", editable: false },
    { headerName: "createdByName", field: "name", editable: false },
    { headerName: "createdBySubname", field: "subname", editable: false },
    { field: "likes", editable: true },
    { field: "comments" },
    { field: "tags", editable: false },
  ] as ColDef<AdminPosts>[]);

  const updateSinglePost = api.admin.updateSinglePost.useMutation({
    onSuccess: () => {
      showSuccess("Post updated successfully");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const { data, isFetching } = api.admin.getAllPosts.useQuery();

  function CellValueChanged(event: CellValueChangedEvent<AdminPosts>) {
    const { id, title, content, perviewSrc, likes } = event.data;

    return updateSinglePost.mutate({
      id,
      title,
      content: JSON.parse(content as unknown as string) as JSONContent,
      perviewSrc,
      likes,
    });
  }

  useEffect(() => {
    if (isFetching) {
      showLoading("Fetching posts...");
    }
    if (data) {
      setRowData([
        ...data.flatMap((page) => {
          const {
            id,
            content,
            title,
            perviewSrc,
            createdAt,
            createdBy: { name, subname },
            updatedAt,
            likes,
            tags,
            _count: { comments },
          } = page;
          toast.dismiss();

          return {
            id,
            title,
            content: JSON.stringify(content),
            perviewSrc,
            createdAt,
            updatedAt,
            name,
            subname: subname ?? "user without subname",
            likes,
            comments,
            tags: JSON.stringify(tags) as unknown as { displayName: string }[],
          };
        }),
      ]);
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
