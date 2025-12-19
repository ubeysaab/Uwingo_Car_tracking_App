import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}




// function Todos() {
//   // Access the client
//   const queryClient = useQueryClient()

//   // Queries
//   const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

//   // Mutations
//   const mutation = useMutation({
//     mutationFn: postTodo,
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ['todos'] })
//     },
//   })

//   return (
//     <div>
//       <ul>
//         {query.data?.map((todo) => (
//           <li key={todo.id}>{todo.title}</li>
//         ))}
//       </ul>

//       <button
//         onClick={() => {
//           mutation.mutate({
//             id: Date.now(),
//             title: 'Do Laundry',
//           })
//         }}
//       >
//         Add Todo
//       </button>
//     </div>
//   )
// }

