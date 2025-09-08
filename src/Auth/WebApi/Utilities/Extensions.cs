namespace MyProj.WebApi.Utilities
{
    public static class Extensions
    {
        public static async Task<IList<T>> ToListAsync<T>(this IAsyncEnumerable<T> enumerable)
        {
            var list = new List<T>();

            await foreach (var item in enumerable)
            {
                list.Add(item);
            }

            return list;
        }
    }
}
 