export const authMe = gql`
    query me {
        me {
            id
            name
            email
            is_admin
            roles {
                name
            }
            permissions {
                name
            }
        }
    }
`;

export const login = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                first_name
                last_name
                middle_name
                name
                email
                is_admin
                roles {
                    id
                    name
                }
                permissions {
                    id
                    name
                }
            }
        }
    }
`;

export const logout = gql`
    mutation logout {
        logout {
            message
        }
    }
`;

export const requestOtp = gql`
    mutation requestOtp($userId: ID, $email: String, $sessionKey: String) {
        requestOtp(
            user_id: $userId
            email: $email
            generated_session_key: $sessionKey
        ) {
            status
            remarks
            error
            expiry
            session_key
        }
    }
`;

export const verifyOtp = gql`
    mutation verifyOtp($userId: ID, $sessionKey: String!, $otp: String!) {
        verifyOtp(
            user_id: $userId
            generated_session_key: $sessionKey
            otp: $otp
        ) {
            status
            remarks
            error
            expiry
            user {
                id
                email
            }
        }
    }
`;
