export function formatLimitAndPage(
  limit: string | null,
  offset: string | null,
) {
  const limitToNumber = limit ? Number(limit) : 20;
  const offsetToNumber = offset ? Number(offset) : 0;

  const finalLimit = limitToNumber > 50 ? 50 : limitToNumber;

  return {
    limit: finalLimit,
    offset: offsetToNumber,
  };
}
