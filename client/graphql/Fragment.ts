export const userFragment = gql`
    fragment user on User {
        id
        name
        first_name
        middle_name
        last_name
        email
        phone
        password
        is_admin
        roles {
            id
            name
        }
        is_active
        created_at
        updated_at
        deleted_at
    }
`;

export const roleFragment = gql`
    fragment role on Role {
        id
        name
        guard_name
        users {
            id
            name
        }
        permissions {
            id
            name
        }
        created_at
        updated_at
    }
`;

export const permissionFragment = gql`
    fragment permission on Permission {
        id
        name
        guard_name
        created_at
        updated_at
    }
`;

export const documentFragment = gql`
    fragment document on Document {
        id
        doc_no
        type
        category
        status
        requested_at
        issued_at
        valid_until
        createdBy {
            id
            name
        }
        updatedBy {
            id
            name
        }
        created_at
        updated_at
    }
`;
