import { defineStore } from 'pinia'

import type { TaskStatus, Task } from '~/types/codegen/graphql';

export const useTaskBoardStore = defineStore('taskBoard', () => {
    const columns = ref([
        {
            color: 'blue',
            icon: 'i-heroicons-queue-list',
            id: 'PENDING',
            tasks: [] as Task[],
            title: 'Pending'
        },
        {
            color: 'green',
            icon: 'i-heroicons-check-circle',
            id: 'COMPLETED',
            tasks: [] as Task[],
            title: 'Completed'
        }
    ])

    function setTasks(tasks: Task[]) {
        columns.value.forEach(col => (col.tasks = []))

        tasks.forEach(task => {
            const col = columns.value.find(c => c.id === task.status)
            if (col) col.tasks.push(task)
        })

        // Sort by order
        columns.value.forEach(col => {
            col.tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        })
    }

    // Updated store methods
    function moveTask(taskId: string, newStatus: string, newIndex?: number) {
        // Find the task and remove from all columns
        let movingTask: Task | undefined
        let sourceColumn: any = null

        columns.value.forEach(col => {
            const index = col.tasks.findIndex(t => t.id === taskId)
            if (index !== -1) {
                movingTask = col.tasks.splice(index, 1)[0]
                sourceColumn = col
            }
        })

        if (!movingTask) return

        // Update task status
        movingTask.status = newStatus as TaskStatus

        // Find target column
        const targetCol = columns.value.find(c => c.id === newStatus)
        if (targetCol) {
            // Insert at specific index if provided, otherwise append
            if (typeof newIndex === 'number' && newIndex >= 0) {
                targetCol.tasks.splice(newIndex, 0, movingTask)
            } else {
                targetCol.tasks.push(movingTask)
            }

            // Update order for all tasks in target column
            targetCol.tasks.forEach((task, index) => {
                task.order = index
            })
        }

        // Update order for remaining tasks in source column if different from target
        if (sourceColumn && sourceColumn.id !== newStatus) {
            sourceColumn.tasks.forEach((task: Task, index: number) => {
                task.order = index
            })
        }
    }

    function updateTask(task: Task) {
        columns.value.forEach(col => {
            col.tasks = col.tasks.filter(t => t.id !== task.id)
        })

        const newCol = columns.value.find(col => col.id === task.status)
        if (newCol) {
            const insertIndex = newCol.tasks.findIndex(t => (t.order ?? 0) > (task.order ?? 0))
            if (insertIndex === -1) newCol.tasks.push(task)
            else newCol.tasks.splice(insertIndex, 0, task)
        }
    }

    function deleteTask(taskId: string) {
        columns.value.forEach(col => {
            col.tasks = col.tasks.filter(t => t.id !== taskId)
        })
    }

    return {
        columns,
        deleteTask,
        moveTask,
        setTasks,
        updateTask
    }
})
