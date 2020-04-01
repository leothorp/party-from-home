import { useCallback } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import useMountEffect from '../useMountEffect/useMountEffect';

const QUERY = gql`
    query User($identity: String!) {
        user(identity: $identity) {
            id
            displayName
            photoURL
        }
    }
`;

export default function useUser(options?: { userId?: string, onReceive?: (data: any) => void }) {
    const [get, { data }] = useLazyQuery(QUERY, {
        onCompleted: d => {
            if (options?.onReceive)
                options.onReceive(d.user);
        }
    });

    const getUser = useCallback((identity: string) => {
        if (data?.user.identity === identity && options?.onReceive)
            options.onReceive(data.user);
        else
            get({
                variables: {
                    identity,
                }
            });
    }, [data, get, options]);

    useMountEffect(() => {
        if (options?.userId) {
            getUser(options.userId);
        }
    });

    return { user: data?.user, getUser };
}