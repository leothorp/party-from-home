export const callApi = (action: string, params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetch(`/api/${action}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  });
};
