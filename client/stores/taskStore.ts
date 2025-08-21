import { defineStore } from "pinia";

import type { Task } from "~/types/codegen/graphql";

export const useTaskBoardStore = defineStore("taskBoard", () => {
    const columns = ref([
        {
            color: "blue",
            icon: "i-heroicons-queue-list",
            id: "PENDING",
            tasks: [] as Task[],
            title: "Pending",
        },
        {
            color: "green",
            icon: "i-heroicons-check-circle",
            id: "COMPLETED",
            tasks: [] as Task[],
            title: "Completed",
        },
    ]);

    function setTasks(tasks: Task[]) {
        columns.value.forEach((col) => (col.tasks = []));

        tasks.forEach((task) => {
            const col = columns.value.find((c) => c.id === task.status);
            if (col) col.tasks.push(task);
        });

        // Sort by order
        columns.value.forEach((col) => {
            col.tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        });
    }

    function updateTask(task: Task) {
        columns.value.forEach((col) => {
            col.tasks = col.tasks.filter((t) => t.id !== task.id);
        });

        const newCol = columns.value.find((col) => col.id === task.status);
        if (newCol) {
            const insertIndex = newCol.tasks.findIndex(
                (t) => (t.order ?? 0) > (task.order ?? 0),
            );
            if (insertIndex === -1) newCol.tasks.push(task);
            else newCol.tasks.splice(insertIndex, 0, task);
        }
    }

    function deleteTask(taskId: string) {
        columns.value.forEach((col) => {
            col.tasks = col.tasks.filter((t) => t.id !== taskId);
        });
    }

    return {
        columns,
        deleteTask,
        setTasks,
        updateTask,
    };
});
