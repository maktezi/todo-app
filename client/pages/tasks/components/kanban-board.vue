<template>
    <div class="p-4">
        <div class="flex gap-6 overflow-x-auto pb-4">
            <div
                v-for="column in columns"
                :key="column.id"
                class="flex-shrink-0 w-80"
            >
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <!-- Column Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <UIcon :name="column.icon" class="w-5 h-5 text-primary" />
                            <h3 class="font-semibold text-gray-900 dark:text-white">
                                {{ column.title }}
                            </h3>
                            <UBadge
                                :color="column.color"
                                variant="subtle"
                                size="sm"
                            >
                                {{ column.tasks.length }}
                            </UBadge>
                        </div>
                        <UButton
                            icon="i-heroicons-plus"
                            size="sm"
                            color="gray"
                            variant="ghost"
                            @click="addTask(column.id)"
                        />
                    </div>

                    <!-- Draggable Task List -->
                    <VueDraggable
                        v-model="column.tasks"
                        :group="{ name: 'tasks', pull: true, put: true }"
                        :animation="200"
                        item-key="id"
                        ghost-class="ghost-card"
                        class="space-y-3 min-h-[200px]"
                        :data-column-id="column.id"
                        @change="onTaskMove($event, column.id)"
                    >
                        <template
                            v-for="task in column.tasks"
                            :key="task.id"
                        >
                            <UCard class="cursor-move hover:shadow-md transition-shadow">
                                <div class="space-y-2">
                                    <div class="flex items-start justify-between">
                                        <h4 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                                            {{ task.title }}
                                        </h4>
                                        <UDropdown :items="getTaskActions(task)" :popper="{ placement: 'bottom-end' }">
                                            <UButton
                                                icon="i-heroicons-ellipsis-vertical"
                                                size="2xs"
                                                color="gray"
                                                variant="ghost"
                                            />
                                        </UDropdown>
                                    </div>

                                    <p v-if="task.description" class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {{ task.description }}
                                    </p>

                                    <div class="flex items-center justify-between">
                                        <div class="flex gap-2">
                                            <UBadge
                                                v-if="task.priority"
                                                :color="getPriorityColor(task.priority)"
                                                variant="subtle"
                                                size="xs"
                                            >
                                                {{ task.priority }}
                                            </UBadge>
                                        </div>

                                        <span v-if="task.created_at" class="text-xs text-gray-500">
                                            {{ getFriendlyDate(task.created_at) }}
                                        </span>
                                    </div>
                                </div>
                            </UCard>
                        </template>
                    </VueDraggable>
                </div>
            </div>
        </div>

        <!-- Add/Edit Task Modal -->
        <UModal v-model="isModalOpen">
            <UCard>
                <template #header>
                    <h3 class="text-lg font-semibold text-primary">
                        {{ newTask.id ? 'Edit Task' : 'Add New Task' }}
                    </h3>
                </template>

                <UForm :state="newTask" class="space-y-4" @submit="submitTask">
                    <UFormGroup label="Title" required>
                        <UInput v-model="newTask.title" placeholder="Enter task title" />
                    </UFormGroup>

                    <UFormGroup label="Description">
                        <UTextarea v-model="newTask.description" placeholder="Enter task description" />
                    </UFormGroup>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormGroup label="Priority">
                            <USelect
                                v-model="newTask.priority"
                                :options="priorityOptions"
                                placeholder="Select priority"
                            />
                        </UFormGroup>
                    </div>

                    <div class="flex justify-end gap-2">
                        <UButton color="gray" variant="ghost" @click="isModalOpen = false">
                            Cancel
                        </UButton>
                        <UButton type="submit" :loading="isSubmitting">
                            {{ newTask.id ? 'Update' : 'Add' }} Task
                        </UButton>
                    </div>
                </UForm>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type {BadgeColor} from "#ui/types";

import { useToast } from "#ui/composables/useToast";
import {VueDraggable} from 'vue-draggable-plus'

import type {Maybe, Task, TaskPriority, TaskStatus} from "~/types/codegen/graphql";

import {deleteTask, tasksPaginate, upsertTask} from "~/graphql/Task";
import {getPriorityColor} from "~/pages/tasks/utils/helper";
import {getFriendlyDate} from "~/utils/helpers"

interface Column {
    color: BadgeColor
    icon: string
    id: string
    tasks: Task[]
    title: string
}

const toast = useToast()
const auth = useAuthStore()

// State
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const selectedColumnId = ref('')
const newTask = ref<Partial<Task>>({
    description: '',
    id: '',
    priority: 'MEDIUM' as TaskPriority.Medium,
    status: 'PENDING' as TaskStatus.Pending,
    title: ''
})

const priorityOptions = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' }
]

function conditions() {
    const isAdmin = auth.user?.roles?.some((r) => r?.name === "Admin");
    const requiredPermissions = [
        "view task",
        "create task",
        "edit task",
        "delete task",
    ];
    const hasPermissions = requiredPermissions.every((perm) => auth.can(perm));

    if (isAdmin || hasPermissions) return undefined;

    return {
        column: "CREATED_BY",
        operator: "EQ",
        value: auth.user?.id,
    };
}


const queryVariables = ref({
    first: 10,
    page: 1,
    ...(conditions() && {
        whereConditions: {
            OR: [
                {
                    AND: [conditions()]
                }
            ]
        }
    })
});

const { refetch: refetchTasks, result: tasksResult } = useQuery(tasksPaginate, () => queryVariables.value)

onMounted(() => {
    console.log("TASKS:", tasksResult.value?.tasksPaginate)
})

const columns = ref<Column[]>([
    {
        color: 'blue',
        icon: 'i-heroicons-queue-list',
        id: 'PENDING',
        tasks: [],
        title: 'Pending'
    },
    {
        color: 'green',
        icon: 'i-heroicons-check-circle',
        id: 'COMPLETED',
        tasks: [],
        title: 'Completed'
    }
])

// Watch for tasks data and populate columns
watchEffect(() => {
    if (tasksResult.value?.tasksPaginate?.data) {
        const allTasks = tasksResult.value.tasksPaginate.data

        // Reset columns tasks
        columns.value.forEach(column => {
            column.tasks = []
        })

        // Populate columns with tasks
        allTasks.forEach(task => {
            const column = columns.value.find(col => col.id === task.status)
            if (column) {
                column.tasks.push(task)
            }
        })

        console.log('Columns populated:', columns.value)
    }
})

const addTask = (columnId: string) => {
    selectedColumnId.value = columnId
    newTask.value = {
        description: '',
        id: '',
        priority: 'MEDIUM' as TaskPriority.Medium,
        status: columnId as Maybe<TaskStatus> | undefined,
        title: ''
    }
    isModalOpen.value = true
}

const { mutate: saveTask } = useMutation(upsertTask)

const submitTask = async () => {
    isSubmitting.value = true

    try {
        // If task is new, use selectedColumnId as status
        const isNew = !newTask.value.id
        const status = isNew ? selectedColumnId.value : newTask.value.status

        const input = {
            description: newTask.value.description,
            priority: newTask.value.priority,
            status: status as TaskStatus,
            title: newTask.value.title,
            updatedBy: { connect: auth.user?.id },
            ...(isNew && { createdBy: { connect: auth.user?.id } }),
            ...(newTask.value.id && { id: newTask.value.id })
        }

        await saveTask({ input })
        await refetchTasks()

        toast.add({
            color: 'green',
            icon: 'i-heroicons-check-circle',
            title: `Task ${isNew ? 'created' : 'updated'} successfully`
        })

        resetForm()
    } catch (error: any) {
        toast.add({
            color: 'red',
            description: error.message,
            icon: 'i-heroicons-exclamation-circle',
            title: 'Error saving task'
        })
        console.error('Error saving task:', error)
    } finally {
        isSubmitting.value = false
    }
}

const onTaskMove = async (event: any, columnId: string) => {
    console.log('Task move event:', event, 'Column:', columnId)

    if (event.added) {
        const task = event.added.element
        const newStatus = columnId as TaskStatus

        // Manually update the task's status before saving
        task.status = newStatus

        console.log('Moving task:', task.id, 'to status:', newStatus)

        try {
            await saveTask({
                input: {
                    description: task.description,
                    id: task.id,
                    priority: task.priority,
                    status: newStatus,
                    title: task.title
                }
            })

            await refetchTasks()

            toast.add({
                color: 'green',
                icon: 'i-heroicons-check-circle',
                title: 'Task moved successfully'
            })
        } catch (error: any) {
            await refetchTasks()
            toast.add({
                color: 'red',
                description: error.message,
                icon: 'i-heroicons-exclamation-circle',
                title: 'Error moving task'
            })
            console.error('Error moving task:', error)
        }
    }
}

const getTaskActions = (task: Task) => [
    [{
        click: () => editTask(task),
        icon: 'i-heroicons-pencil-square',
        label: 'Edit'
    }],
    [{
        click: () => deleteTaskHandler(task.id),
        icon: 'i-heroicons-trash',
        label: 'Delete'
    }]
]

const editTask = (task: Task) => {
    newTask.value = { ...task }
    selectedColumnId.value = task.status
    isModalOpen.value = true
}

const { mutate: removeTask } = useMutation(deleteTask)

const deleteTaskHandler = async (taskId: string) => {
    try {
        await removeTask({ id: [taskId] })
        await refetchTasks()
        toast.add({
            color: 'green',
            icon: 'i-heroicons-check-circle',
            title: 'Task deleted successfully'
        })
    } catch (error: any) {
        toast.add({
            color: 'red',
            description: error.message,
            icon: 'i-heroicons-exclamation-circle',
            title: 'Error deleting task'
        })
        console.error('Error deleting task:', error)
    }
}

const resetForm = () => {
    newTask.value = {
        description: '',
        priority: 'MEDIUM' as TaskPriority.Medium,
        status: 'PENDING' as TaskStatus.Pending,
        title: ''
    }
    isModalOpen.value = false
}

function updateTaskInUI(task: Task) {
    columns.value.forEach(column => {
        column.tasks = column.tasks.filter(t => t.id !== task.id)
    })

    const newColumn = columns.value.find(col => col.id === task.status)
    if (newColumn) {
        newColumn.tasks.unshift(task)
    }
}

const { $echo } = useNuxtApp()
onMounted(() => {
    $echo.channel('tasks').listen('.TaskUpdated', (event) => {
        console.log('Got update:', event.task)
        updateTaskInUI(event.task)
    })
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ghost-card {
    opacity: 0.5;
    transform: rotate(2deg);
}
</style>
