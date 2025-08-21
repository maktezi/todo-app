import { documentFragment } from "~/graphql/Fragment";

export const documentsPaginate = gql`
    query documentsPaginate(
        $first: Int!
        $page: Int
        $search: String
        $sort: SortInput
        $filter: [FilterInput]
        $whereConditions: QueryDocumentsPaginateWhereWhereConditions
    ) {
        documentsPaginate(
            first: $first
            page: $page
            search: $search
            sort: $sort
            filter: $filter
            where: $whereConditions
        ) {
            data {
                ...document
            }
            paginatorInfo {
                currentPage
                lastPage
                perPage
                total
            }
        }
    }
    ${documentFragment}
`;

export const recentDocuments = gql`
    query recentDocuments {
        documentsPaginate(
            first: 20
            sort: { column: "UPDATED_AT", direction: "DESC" }
        ) {
            data {
                id
                doc_no
                type
                status
                updated_at
            }
        }
    }
`;

export const upsertDocument = gql`
    mutation upsertDocument($input: DocumentInput!) {
        upsertDocument(input: $input) {
            ...document
        }
    }
    ${documentFragment}
`;

export const deleteDocument = gql`
    mutation deleteDocument($id: [ID!]) {
        deleteDocument(id: $id) {
            id
        }
    }
`;

export const documentsCount = gql`
    query documentsCount {
        documentsCount
    }
`;

export const totalPendingDocuments = gql`
    query totalPendingDocuments {
        totalPendingDocuments
    }
`;

export const totalPendingNewToday = gql`
    query totalPendingNewToday {
        totalPendingNewToday
    }
`;
