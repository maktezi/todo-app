import { taskFragment } from "~/graphql/Fragment";

export const tasksPaginate = gql`
    query tasksPaginate(
        $first: Int!
        $page: Int
        $search: String
        $sort: SortInput
        $filter: [FilterInput]
        $whereConditions: QueryTasksPaginateWhereWhereConditions
    ) {
        tasksPaginate(
            first: $first
            page: $page
            search: $search
            sort: $sort
            filter: $filter
            where: $whereConditions
        ) {
            data {
                ...task
            }
            paginatorInfo {
                currentPage
                lastPage
                perPage
                total
            }
        }
    }
    ${taskFragment}
`;

export const upsertTask = gql`
    mutation upsertTask($input: TaskInput!) {
        upsertTask(input: $input) {
            ...task
        }
    }
    ${taskFragment}
`;

export const deleteTask = gql`
    mutation deleteTask($id: [ID!]!) {
        deleteTask(id: $id)
    }
`;

export const tasksCount = gql`
    query tasksCount {
        tasksCount
    }
`;
