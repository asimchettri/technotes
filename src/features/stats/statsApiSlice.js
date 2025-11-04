import { apiSlice } from '../../app/api/apiSlice'

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
  }),
})

export const { useGetStatsQuery } = statsApiSlice
