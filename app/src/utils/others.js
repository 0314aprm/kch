import dayjs from 'dayjs';

/*
export function sanitize(html) {
  return {__html: DOMPurify.sanitize(html)}
}
*/
export function format_date(date) {
  return dayjs(date).format('YYYY年M月D日 HH:mm');
}
