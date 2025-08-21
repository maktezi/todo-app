import { permissionFragment } from "./Fragment";

export const permissionsPaginate = gql`
    query permissionsPaginate(
            $first: Int!
            $page: Int
            $search: String
            $sort: SortInput
        ) {
            permissionsPaginate(
                first: $first
                page: $page
                search: $search
                sort: $sort
            ) {
                data {
                    ...permission
                }
                paginatorInfo {
                    currentPage
                    lastPage
                    perPage
                    total
                    
                }
            }
        }
        ${permissionFragment}
`;

export const upsertPermission = gql`
    mutation upsertPermission($input: PermissionInput!){
        upsertPermission(input: $input){
            ...permission
        }
    }
    ${permissionFragment}
`;

export const deletePermission = gql`
    mutation deletePermission($id: [ID!]) {
        deletePermission(id: $id) {
            id
        }
    }
`;