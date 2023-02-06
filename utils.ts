export function secondsToDateTime(seconds: number) {
  const date = new Date(seconds * 1000);
  const month = date.getMonth() + 1;
  return (
    "" +
    date.getDate() +
    "." +
    month +
    "." +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
}
