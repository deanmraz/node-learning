export default async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ ...event, ...context }),
  };
};
