import { roleFragment } from "~/graphql/Fragment";

export const rolesPaginate = gql`
    query rolesPaginate(
        $first: Int!
        $page: Int
        $search: String
        $sort: SortInput
    ) {
        rolesPaginate(
            first: $first
            page: $page
            search: $search
            sort: $sort
        ) {
            data {
                ...role
            }
            paginatorInfo {
                currentPage
                lastPage
                perPage
                total
            }
        }
    }
    ${roleFragment}
`;

export const upsertRole = gql`
    mutation upsertRole($input: RoleInput!) {
        upsertRole(input: $input) {
            ...role
        }
    }
    ${roleFragment}
`;

export const deleteRole = gql`
    mutation deleteRole($id: [ID!]) {
        deleteRole(id: $id) {
            id
        }
    }
`;
