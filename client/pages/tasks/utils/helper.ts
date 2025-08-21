import type {BadgeColor} from "#ui/types";

export const getPriorityColor = (priority: string): BadgeColor => {
    switch (priority?.toUpperCase()) {
        case 'HIGH': return 'red'
        case 'MEDIUM': return 'yellow'
        case 'LOW': return 'green'
        default: return 'gray'
    }
}

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
    })
}
