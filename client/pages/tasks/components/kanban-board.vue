<template>
    <div class="p-4">
        <UButton
            icon="i-heroicons-plus"
            size="sm"
            class="mb-4"
            color="emerald"
            variant="outline"
            @click="addTask('PENDING')"
        >
            Add New Task
        </UButton>
        <div class="flex gap-6 overflow-x-auto pb-4">
            <div
                v-for="column in columns"
                :key="column.id"
                class="flex-shrink-0 w-96 max-h-[calc(90vh-80px)]"
            >
                <div
                    class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-full overflow-auto"
                >
                    <!-- Column Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <UIcon
                                :name="column.icon"
                                class="w-5 h-5 text-primary"
                            />
                            <h3
                                class="font-semibold text-gray-900 dark:text-white"
                            >
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
                        @start="onDragStart($event)"
                        @end="onTaskDrop(column.id)"
                    >
                        <template v-for="task in column.tasks" :key="task.id">
                            <UCard
                                class="cursor-move hover:shadow-md transition-shadow"
                                :data-id="task.id"
                            >
                                <div class="space-y-1">
                                    <div
                                        class="flex items-start justify-between"
                                    >
                                        <h4
                                            class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2"
                                        >
                                            {{ task.title }}
                                        </h4>
                                        <UDropdown
                                            :items="getTaskActions(task)"
                                            :popper="{
                                                placement: 'bottom-end',
                                            }"
                                        >
                                            <UButton
                                                icon="i-heroicons-ellipsis-vertical"
                                                size="2xs"
                                                color="gray"
                                                variant="ghost"
                                            />
                                        </UDropdown>
                                    </div>

                                    <p
                                        v-if="task.description"
                                        class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2"
                                    >
                                        {{ task.description }}
                                    </p>

                                    <div
                                        class="flex items-center justify-between pt-2"
                                    >
                                        <div class="flex gap-2">
                                            <UBadge
                                                v-if="task.priority"
                                                :color="
                                                    getPriorityColor(
                                                        task.priority,
                                                    )
                                                "
                                                variant="subtle"
                                                size="xs"
                                            >
                                                {{ task.priority }}
                                            </UBadge>
                                        </div>

                                        <span
                                            v-if="task.created_at"
                                            class="text-xs text-gray-500"
                                        >
                                            {{
                                                getFriendlyDate(task.created_at)
                                            }}
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
                        {{ newTask.id ? "Edit Task" : "Add New Task" }}
                    </h3>
                </template>

                <UForm
                    :state="newTask"
                    :schema="taskSchema"
                    class="space-y-4"
                    @submit="submitTask"
                >
                    <UFormGroup label="Title" name="title" required>
                        <UInput
                            v-model="newTask.title"
                            placeholder="Enter task title"
                        />
                    </UFormGroup>

                    <UFormGroup label="Description" name="description">
                        <UTextarea
                            v-model="newTask.description"
                            placeholder="Enter task description"
                        />
                    </UFormGroup>

                    <UFormGroup label="Priority" name="priority">
                        <USelect
                            v-model="newTask.priority"
                            :options="priorityOptions"
                            placeholder="Select priority"
                            class="bg-card"
                        />
                    </UFormGroup>

                    <div class="flex justify-end gap-2">
                        <UButton
                            color="gray"
                            variant="ghost"
                            @click="isModalOpen = false"
                        >
                            Cancel
                        </UButton>
                        <UButton type="submit" :loading="isSubmitting">
                            {{ newTask.id ? "Update" : "Add" }} Task
                        </UButton>
                    </div>
                </UForm>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { useToast } from "#ui/composables/useToast";
import { VueDraggable } from "vue-draggable-plus";
import { z } from "zod";

import type {
    Maybe,
    Task,
    TaskPriority,
    TaskStatus,
} from "~/types/codegen/graphql";

import { deleteTask, tasksPaginate, upsertTask } from "~/graphql/Task";
import { getPriorityColor } from "~/pages/tasks/utils/helper";
import { getFriendlyDate } from "~/utils/helpers";

const taskSchema = z.object({
    description: z.string().min(1, "Description is required"),
    priority: z.string().min(1, "Priority is required"),
    title: z.string().min(1, "Title is required"),
});

const toast = useToast();
const auth = useAuthStore();

// State
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const selectedColumnId = ref("");
const newTask = ref<Partial<Task>>({
    description: "",
    id: "",
    priority: "MEDIUM" as TaskPriority.Medium,
    status: "PENDING" as TaskStatus.Pending,
    title: "",
});

const draggedTask = ref<Task | null>(null);

const priorityOptions = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
];

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
                    AND: [conditions()],
                },
            ],
        },
    }),
});

const { refetch: refetchTasks, result: tasksResult } = useQuery(
    tasksPaginate,
    () => queryVariables.value,
);

onMounted(() => {
    console.log("TASKS:", tasksResult.value?.tasksPaginate);
});

const taskBoard = useTaskBoardStore();
const columns = computed(() => taskBoard.columns);

watchEffect(() => {
    const tasks = tasksResult.value?.tasksPaginate?.data;
    if (tasks) {
        const sorted = [...tasks].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
        taskBoard.setTasks(sorted);
    }
});

const addTask = (columnId: string) => {
    selectedColumnId.value = columnId;
    newTask.value = {
        description: "",
        id: "",
        priority: undefined,
        status: columnId as Maybe<TaskStatus> | undefined,
        title: "",
    };
    isModalOpen.value = true;
};

const { mutate: saveTask } = useMutation(upsertTask);

const submitTask = async () => {
    isSubmitting.value = true;

    try {
        // If task is new, use selectedColumnId as status
        const isNew = !newTask.value.id;
        const status = isNew ? selectedColumnId.value : newTask.value.status;
        const tasksInColumn =
            columns.value.find((col) => col.id === status)?.tasks ?? [];

        const input = {
            description: newTask.value.description,
            priority: newTask.value.priority,
            status: status as TaskStatus,
            title: newTask.value.title,
            updatedBy: { connect: auth.user?.id },
            ...(isNew && { order: tasksInColumn.length }),
            ...(isNew && { createdBy: { connect: auth.user?.id } }),
            ...(newTask.value.id && { id: newTask.value.id }),
        };

        await saveTask({ input });

        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: `Task ${isNew ? "created" : "updated"} successfully`,
        });

        resetForm();
    } catch (error: any) {
        toast.add({
            color: "red",
            description: error.message,
            icon: "i-heroicons-exclamation-circle",
            title: "Error saving task",
        });
        console.error("Error saving task:", error);
    } finally {
        isSubmitting.value = false;
    }
};

const onDragStart = (event: any) => {
    const id = event?.item?.dataset?.id;
    if (!id) return;

    // Find task in all columns
    for (const col of columns.value) {
        const found = col.tasks.find((t) => t.id === id);
        if (found) {
            draggedTask.value = found;
            break;
        }
    }

    console.log("Dragging task:", draggedTask.value);
};

const onTaskDrop = async (targetColumnId: string) => {
    if (!draggedTask.value) return;

    const task = draggedTask.value;
    draggedTask.value = null; // reset

    const sourceColumn = columns.value.find((col) =>
        col.tasks.find((t) => t.id === task.id),
    );
    const targetColumn = columns.value.find((col) => col.id === targetColumnId);

    if (!targetColumn || !sourceColumn) return;

    const newIndex = targetColumn.tasks.findIndex((t) => t.id === task.id);

    const isDifferentColumn = task.status !== sourceColumn.id;

    try {
        // Update task with new status and order
        const input = {
            id: task.id,
            order: newIndex,
            status: sourceColumn.id,
            updatedBy: { connect: auth.user?.id },
        };

        await saveTask({ input });

        // Reorder other tasks in target column
        const tasksToUpdate = targetColumn.tasks
            .filter((t) => t.id !== task.id)
            .map((t, index) => ({
                ...t,
                order: index >= newIndex ? index + 1 : index,
            }));

        for (const t of tasksToUpdate) {
            await saveTask({
                input: {
                    id: t.id,
                    order: t.order,
                    updatedBy: { connect: auth.user?.id },
                },
            });
        }

        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: isDifferentColumn ? "Task moved" : "Task reordered",
        });
    } catch (error: any) {
        toast.add({
            color: "red",
            description: error.message,
            icon: "i-heroicons-exclamation-circle",
            title: "Error updating task",
        });
    }
};

const getTaskActions = (task: Task) => [
    [
        {
            click: () => editTask(task),
            icon: "i-heroicons-pencil-square",
            label: "Edit",
        },
    ],
    [
        {
            click: () => deleteTaskHandler(task.id),
            icon: "i-heroicons-trash",
            label: "Delete",
        },
    ],
];

const editTask = (task: Task) => {
    newTask.value = { ...task };
    selectedColumnId.value = task.status;
    isModalOpen.value = true;
};

const { mutate: removeTask } = useMutation(deleteTask);

const deleteTaskHandler = async (taskId: string) => {
    if (!auth.can("delete task")) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: "Error: No permission to delete Task",
        });

        return;
    }

    try {
        await removeTask({ id: [taskId] });
        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: "Task deleted successfully",
        });
    } catch (error: any) {
        toast.add({
            color: "red",
            description: error.message,
            icon: "i-heroicons-exclamation-circle",
            title: "Error deleting task",
        });
        console.error("Error deleting task:", error);
    }
};

const resetForm = () => {
    newTask.value = {
        description: "",
        priority: "MEDIUM" as TaskPriority.Medium,
        status: "PENDING" as TaskStatus.Pending,
        title: "",
    };
    isModalOpen.value = false;
};

const { $echo } = useNuxtApp();
onMounted(() => {
    $echo.channel("tasks").listen(".TaskUpdated", (event) => {
        console.log("Got update:", event.task);
        taskBoard.updateTask(event.task);
        refetchTasks();
    });
});
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
