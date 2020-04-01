import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
    {
        users {
            identity
            displayName
            photoURL
        }
    }
`;

export default function useUsers() {
    const { data } = useQuery(QUERY);

    return { users: (data?.users || []) as any[] };
}