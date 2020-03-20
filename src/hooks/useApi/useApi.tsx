import { useAppState } from '../../state';

export default function useApi() {
  const { user } = useAppState();

  const callApi = (action: string, params: any): Promise<any> => {
    if (user) {
      params.identity = user.uid;
      params.token = user.token;
      params.passcode = user.passcode;
    }

    return new Promise((resolve, reject) => {
      fetch(`/api/${action}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .then(res => {
          return res.json();
        })
        .then(resolve)
        .catch(reject);
    });
  };

  return { callApi };
}
