
export function create(event: any, context: any, callback: any): void {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Token service says hi!',
      input: event,
    }),
  };

  callback(null, response);
}
