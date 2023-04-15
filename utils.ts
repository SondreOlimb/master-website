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

export function nsToDateTimeString(ns: number) {
  const ms = Math.floor(ns / 1e6); // convert ns to ms
  const dateTime = new Date(ms).toISOString(); // convert ms to UTC date string
  return dateTime.replace("T", " ").slice(0, 19); // format as "yyyy-mm-dd hh:mm:ss"
}
